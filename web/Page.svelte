<script>
  import Block from "plastic-editor";
  import dayjs from 'dayjs'
  const { ipcRenderer } = global.require('electron-better-ipc')

  export let page;

  let block = {
    id: "root",
    content: "",
    children: page.children.length ? page.children : [
      {
        id: `${Date.now()}`,
        content: '',
        children: []
      }
    ],
  };

  async function onChangeBlock() {
    await ipcRenderer.callMain('updatePage', {
      pageId: page.id,
      children: page.children
    })
    console.log('saved!')
  }
</script>

<div class="px-8 pt-16 mb-8">
  <input
    value={page.type === 'daily' ? dayjs(page.title).format('MMMM, DD, YYYY') : page.title}
    class="outline-none text-2xl font-bold w-full"
    placeholder="Page title"
  />
</div>
<div class="px-8">
  <Block dispatchChangeBlockToRoot={onChangeBlock} {block} root={block} path={[0]} />
</div>
