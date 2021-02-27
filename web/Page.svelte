<script>
  import Block from "./editor/Block.svelte";
  import dayjs from 'dayjs'
  import adapter from './adapter'
  export let page;

  let block = {
    id: "root",
    children: page.children.length ? page.children : [
      {
        id: `${Date.now()}`,
        content: '',
        children: []
      }
    ],
  };

</script>

<div class="px-8 pt-16 mb-8">
  <input
    value={page.type === 'daily' ? dayjs(page.title).format('MMMM, DD, YYYY') : page.title}
    class="outline-none text-2xl font-bold w-full"
    placeholder="Page title"
  />
</div>
<div class="px-8">
  <Block adapter={adapter} {block} root={block} path={[0]} />
</div>
