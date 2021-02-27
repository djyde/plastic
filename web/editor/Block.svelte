<script>
	import { editingBlockId, anchorOffset, onChangeBlock } from './store'
	import { clickOutside, autoResize } from './directives'
	import RichText from './Richtext.svelte'
	import { nanoid } from 'nanoid'
	import { tick, createEventDispatcher, onDestroy, getContext, afterUpdate, beforeUpdate, onMount } from 'svelte'

	export let block
	export let path
	export let root
	export let debugMode = true
	export let adapter
	export let isRoot = false

	let previewWrapper
	let focused = false
	let editor
	let blockBody = null
	
	const dispatch = createEventDispatcher()

	blockBody = adapter.getBlock(block.id)

	async function updateBlock(pageChanged = true) {
		block = block
		await tick()
		if (pageChanged) {
			adapter.onPageChanged(root)
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

	function makeBlock () {
		const id = nanoid(8)
		adapter.addBlock({
			id,
			content: ''
		})
		return {
			id,
			children: []
		}
	}
	
	onDestroy(() => {
		console.log('destroy', block.id)
		unsub()
	})

	$: hasChild  = block.children.length > 0
	
	async function onCreateChildEvent(e) {
		const at = e.detail.at
		const node = e.detail.node || makeBlock()
		block.children.splice(at, 0, node)
		await updateBlock()
		$editingBlockId = node.id
	}

	async function onBackwardEvent(e) {
		const { source } = e.detail
		if (isRoot) {
			const node = makeBlock()
			block.children.splice(source + 1, 0, node)
			await updateBlock()
			$editingBlockId = node.id
		} else {
			const origin = block.children.splice(source, 1)
			adapter.deleteBlock(origin[0].id)
			await updateBlock()
			dispatch('createChild', {
				at: path[path.length - 1] + 1,
			})
		}
	}
	
	async function onMoveAsChildEvent(e) {
		const { at } = e.detail
		const origin = block.children.splice(at, 1)
		// adapter.deleteBlock(origin[0].id)
		block.children[at - 1].children.push(origin[0])
		await updateBlock()
	}
	
	async function onRemoveChildEvent(e) {
		if (isRoot && block.children.length === 1) {
			// prevent
		} else {
			const at = e.detail.at
			const origin = block.children.splice(at, 1)
			adapter.deleteBlock(origin[0].id)
			updateBlock()
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
		$editingBlockId = block.id
	}

	async function selfCreateChild(at) {
		const newBlock = makeBlock()
		block.children.splice(at, 0, newBlock)
		await updateBlock()
		$editingBlockId = newBlock.id
	}
	
	function onClickOutside(from = 'unknown') {
		$editingBlockId = null
	}
	
	function onChangeContent(e) {
		adapter.updateBlock(block.id, {
			content: e.target.value
		})
		// block.content = e.target.value
		updateBlock(false)
	}

	function updateContent(content) {
		adapter.updateBlock(block.id, {
			content
		})
		// block.content = content
		updateBlock(false)
	}

	function onKeyDown(e){
		switch (e.code) {
			case 'Enter':
				if (!e.shiftKey) {
					e.preventDefault()

					// create new block
					if (isRoot) {
						block.children.unshift(makeBlock())
					} else if (hasChild) {
						selfCreateChild(0)
					} else {
						if (editor.value) {
							dispatch('createChild', {
								at: path[path.length - 1] + 1
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
		}
	}
</script>

{#if !isRoot}
<div class="main flex">
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
				<textarea use:clickOutside={onClickOutside} on:keydown={onKeyDown} spellcheck="false" bind:this={editor} class="editor" use:autoResize on:change={onChangeContent}>{blockBody.content}</textarea>
				{:else}
					<div bind:this={previewWrapper} class="preview"  on:click|stopPropagation={onClickPreview}>
						<RichText updateContent={updateContent} content={blockBody.content} />
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
				on:backward={onBackwardEvent}
				on:moveAsChild={onMoveAsChildEvent}
				on:createChild={onCreateChildEvent} 
				on:removeChild={onRemoveChildEvent}
				adapter={adapter}
				block={child} path={path.concat(index)} root={root} />
		{/each}
		</div>
	</div>
{/if}
