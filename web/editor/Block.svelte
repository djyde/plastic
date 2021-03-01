<script lang="ts">
	import { editingBlockId, anchorOffset, onChangeBlock } from './store'
	import { clickOutside, autoResize } from './directives'
	import RichText from './RichText.svelte'
	import { tick, createEventDispatcher, onDestroy } from 'svelte'
	import type { Rule } from './parser';
	import bridge from '../bridge'
import type { Block, Page, ShallowBlock } from '../plastic';

	export let block: Page | ShallowBlock
	export let path: number[]
	export let root: Page | ShallowBlock
	export let debugMode = false
	export let editable = true
	export let isRoot = false
	export let rules: Rule[] = []

	let previewWrapper: HTMLDivElement | null
	let focused = false
	let editor: HTMLTextAreaElement | null
	let blockBody: null | Block = null
	
	const dispatch = createEventDispatcher()

	blockBody = bridge.getBlock(block.id)

	async function updateBlockStructure(pageChanged = true) {
		block = block
		await tick()
		if (pageChanged) {
			// @ts-expect-error
			bridge.onPageChanged(root)
		}
	}

	const unsub = editingBlockId.subscribe(async value => {
		if (value === block.id) {
			focused = true
			await tick()
			editor.focus()
			if ($anchorOffset !== null) {
				editor.selectionEnd = $anchorOffset
			}
		} else {
			focused = false
		}
	})

	function makeBlock (): ShallowBlock {
		const id = bridge.addBlock('', root.id)
		return {
			id,
			children: []
		}
	}
	
	onDestroy(() => {
		unsub()
	})

	$: hasChild  = block.children.length > 0
	
	async function onCreateChildEvent(e) {
		const at = e.detail.at
		const node = e.detail.node || makeBlock()
		block.children.splice(at, 0, node)
		await updateBlockStructure()
		$editingBlockId = node.id
	}

	async function onBackwardEvent(e) {
		const { source } = e.detail
		if (isRoot) {
			const node = makeBlock()
			block.children.splice(source + 1, 0, node)
			await updateBlockStructure()
			$editingBlockId = node.id
		} else {
			const origin = block.children.splice(source, 1)
			bridge.deleteBlock(origin[0].id)
			await updateBlockStructure()
			dispatch('createChild', {
				at: path[path.length - 1] + 1,
			})
		}
	}
	
	async function onMoveAsChildEvent(e) {
		const { at } = e.detail
		const origin = block.children.splice(at, 1)
		// bridge.deleteBlock(origin[0].id)
		block.children[at - 1].children.push(origin[0])
		await updateBlockStructure()
	}
	
	async function onRemoveChildEvent(e) {
		if (isRoot && block.children.length === 1) {
			// prevent
		} else {
			const at = e.detail.at
			const origin = block.children.splice(at, 1)
			bridge.deleteBlock(origin[0].id)
			updateBlockStructure()
			if (at === 0) {
				// move cursor to parent
				$editingBlockId = block.id
			} else {
				// move cursor to nearby
				$editingBlockId = block.children[at - 1].id
			}
		}
	}

	async function onClickPreview(e) {
		if (editable) {
			$editingBlockId = block.id
		}
	}

	async function selfCreateChild(at) {
		const newBlock = makeBlock()
		block.children.splice(at, 0, newBlock)
		await updateBlockStructure()
		$editingBlockId = newBlock.id
	}
	
	function onClickOutside(from = 'unknown') {
		$editingBlockId = null
	}
	
	function onChangeContent(e) {
		bridge.updateBlock(block.id, {
			content: e.target.value
		})
		// block.content = e.target.value
		// updateBlock(false)
	}

	function updateContent(content) {
		bridge.updateBlock(block.id, {
			content
		})
		// block.content = content
		// updateBlock(false)
	}

	function onKeyDown(e){
		switch (e.key) {
			case 'Enter':
				if (!e.shiftKey) {
					e.preventDefault()

					// create new block
					if (isRoot) {
						block.children.unshift(makeBlock())
					} else if (hasChild) {
						if (editor.selectionStart === 0) {
							dispatch('createChild', {
								at: path[path.length - 1]
							})
						} else {
							selfCreateChild(0)
						}
					} else {
						if (editor.value) {
							dispatch('createChild', {
								at: editor.selectionStart === 0 ? path[path.length - 1] : path[path.length - 1] + 1
							})
						} else {
							dispatch('backward', {
								source: path[path.length - 1]
							})
						}
					}
				}
				
				break
			case 'Backspace':
				if (!editor.value) {
					e.preventDefault()
					if (!(block.children.length > 0)) {
						dispatch('removeChild', {
							at: path[path.length - 1]
						})
					}
				}
				break
			case 'Tab':
				e.preventDefault()
				if (path[path.length - 1] !== 0) {
					dispatch('moveAsChild', {
						at: path[path.length - 1]
					})
				}
				break
			case '[':
				{
					const [ start, end ] = [editor.selectionStart, editor.selectionEnd]
					if (start === end) {
						editor.setRangeText(']', start, end)
					} else {
						editor.setSelectionRange(start, start)
						// editor.setRangeText('[', start, start)
						editor.setRangeText(']', end, end)

						setTimeout(() => {
							editor.setSelectionRange(start + 1, end + 1)
						})
					}
				}
				break
			case '{':
				{
					const [ start, end ] = [editor.selectionStart, editor.selectionEnd]
					if (start === end) {
						editor.setRangeText('}', start, end)
					}
				}
				break
		}
	}
</script>

{#if !isRoot}
<div class="main flex mb-2">
	<div class="pl-4 pr-2" style="margin-top: 10px;">
		<div class=" bg-gray-900 rounded-full" style="width: 5px; height: 5px;"></div>
	</div>
	<div class="flex-1">
			{#if debugMode}
				<span class="debug">{JSON.stringify({
					id: block.id,
					path,
					isRoot
				})}</span>
			{/if}
			{#if blockBody}
				{#if focused}
				<textarea use:clickOutside={onClickOutside} on:keydown={onKeyDown} spellcheck={false} bind:this={editor} class="editor" use:autoResize on:change={onChangeContent}>{blockBody.content}</textarea>
				{:else}
					<div bind:this={previewWrapper} class="preview"  on:click|stopPropagation={onClickPreview}>
						<RichText rules={rules} updateContent={updateContent} blockBody={blockBody} />
					</div>
				{/if}
			{/if}
	</div>
	
</div>
{/if}

{#if block.children.length > 0}
	<div class="{ !isRoot ? 'ml-4 children flex' : 'children flex' }">
		{#if !isRoot}
			<div class="self-stretch bg-gray-300" style="width: 1px; margin-left: 2px"></div>
		{/if}
		<div class="flex-1">
			{#each block.children as child, index (child.id)}
			<svelte:self
				editable={editable}
				rules={rules}
				on:backward={onBackwardEvent}
				on:moveAsChild={onMoveAsChildEvent}
				on:createChild={onCreateChildEvent} 
				on:removeChild={onRemoveChildEvent}
				block={child} path={path.concat(index)} root={root} />
		{/each}
		</div>
	</div>
{/if}
