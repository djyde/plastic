<script>
  import { anchorOffset } from './store'
  import { tokenizer } from "./parser";
import DB from '../db'
const db = DB.get()
  export let blockBody
  export let updateContent;
  export let rules = []

  let toMatch = `${blockBody.content}`;

  const tokens = tokenizer(toMatch, rules);

  function replaceRange(s, start, end, substitute) {
    return s.substring(0, start) + substitute + s.substring(end);
  }

  const replace = (item) => (newValue) => {
    const range = [item.position, item.position + item.matched[0].length];
    updateContent(replaceRange(blockBody.content, range[0], range[1], newValue))
  };

  const focusTextHelper = (item) => (offset = 0) => e => {
    const selection = window.getSelection();
    $anchorOffset = selection.anchorOffset + item.position + offset
  }

  // collect block reference pages
  db.setBlockPageReferences(blockBody.id, tokens.filter(_ => _.type === 'LINK').map(_ => _.page.id))
</script>

<div>
  {#each tokens as item}
    {#if item.type === 'TEXT'}
      <span on:click|capture={focusTextHelper(item)()}>{item.value}</span>
    {:else}
      <svelte:component blockBody={blockBody} focusTextHelper={focusTextHelper(item)} this={item.component} {...item.props} replace={replace(item)} item={item} />
    {/if}
  {/each}
  <!-- <span>block</span> {content} -->
</div>
