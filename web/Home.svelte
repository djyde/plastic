<script>

  import Page from "./Page.svelte";
  import db from './db'

  let page = null;

  (async () => {
    const note = db.createDailyNote();
    page = JSON.parse(JSON.stringify(note));
  })();

</script>

<div class="flex">
  <div class="flex-1">
    <div style="width: 960px;" class="mx-auto">
      {#if page}
        <Page {page} />
      {:else}
        <span></span>
      {/if}
    </div>
  </div>
</div>
