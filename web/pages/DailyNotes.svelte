<script>
  import Page from "../Page.svelte";
  import DB from "../db";
  const db = DB.get();

  let page = null;

  (async () => {
    const note = db.createDailyNote();
    page = JSON.parse(JSON.stringify(note));
  })();
</script>

{#if page}
  <Page pageId={page.id} />
{:else}
  <span />
{/if}
