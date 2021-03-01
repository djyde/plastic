<script lang="ts">
  import type { Page } from "../plastic";

  import router from "../router";

  export let page: Page

  function onClick(e) {
    e.preventDefault();
    router.navigate(`/page/${page.id}`);
  }
</script>

<span
  ><a
    on:click|stopPropagation={onClick}
    class="text-blue-500"
    href={`/page/${page.id}`}>#{page.title}</a
  ></span
>
