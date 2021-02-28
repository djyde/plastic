<script>
  import { navigate, link } from 'svelte-routing'
  export let item

</script>

<span>[<a use:link on:click|stopPropagation class="text-blue-500" href={`/page/${item.page.id}`}>{item.page.title}</a>]</span>