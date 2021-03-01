<script lang="ts">
  import type { Token } from "../editor/parser";

  import router from "../router";
  export let item: Token;

  function onClick(e) {
    e.preventDefault();
    router.navigate(`/page/${item.meta.page.id}`);
  }
</script>

<span
  >[<a
    on:click|stopPropagation={onClick}
    class="text-blue-500"
    href={`/page/${item.meta.page.id}`}>{item.meta.page.title}</a
  >]</span
>
