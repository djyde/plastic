<script>
  import Page from './Page.svelte'


  let page = {
    id: 'foo',
    title: 'Tutorial',
    children: [

    ]
  }
</script>

<div class="flex">
  <div class="flex-1">
    <div style="width: 960px;" class="mx-auto">
      <Page page={page} />
    </div>
  </div>
</div>
