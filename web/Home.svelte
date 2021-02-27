<script>
  import Page from './Page.svelte'
  const { ipcRenderer } = global.require('electron-better-ipc')

  let page = null

  ;(async () => {
    const note = await ipcRenderer.callMain('createDailyNote')
    page = note
  })();

</script>

<div class="flex">
  <div class="flex-1">
    <div style="width: 960px;" class="mx-auto">
      {#if page}
        <Page page={page} />
      {:else}
        <span>Loading...</span>
      {/if}
    </div>
  </div>
</div>
