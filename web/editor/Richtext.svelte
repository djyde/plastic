<script>
  import { anchorOffset } from './store'
  import { tokenizer } from "./parser";

  export let content = "";
  export let updateContent;

  let toMatch = `${content}`;

  const tokens = tokenizer(toMatch);

  function replaceRange(s, start, end, substitute) {
    return s.substring(0, start) + substitute + s.substring(end);
  }

  const replace = (item) => (newValue) => {
    const range = [item.position, item.position + item.matched[0].length];
    updateContent(replaceRange(content, range[0], range[1], newValue))
  };

  const focusTextHelper = (item) => (offset = 0) => e => {
    const selection = window.getSelection();
    $anchorOffset = selection.anchorOffset + item.position + offset
  }
</script>

<div>
  {#each tokens as item}
    {#if item.type === 'TEXT'}
      <span on:click|capture={focusTextHelper(item)()}>{item.value}</span>
    {:else}
      <svelte:component focusTextHelper={focusTextHelper(item)} this={item.component} {...item.props} replace={replace(item)} item={item} />
    {/if}
  {/each}
  <!-- <span>block</span> {content} -->
</div>
