<script>

  import Page from "./Page.svelte";
  import db from './db'

  let page = null;

  (async () => {
    const note = db.createDailyNote();
    console.log(note);
    page = note;
  })();

  
</script>

<div class="flex">
  <div class="flex-1">
    <div style="width: 960px;" class="mx-auto">
      {#if page}
        <Page {page} />
      {:else}
        <span>Loading...</span>
      {/if}
    </div>
  </div>
</div>
