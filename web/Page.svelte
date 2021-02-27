<script>
  import Block from "plastic-editor";
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

  function onChangeBlock() {
    console.log('update', block)
  }
</script>

<div class="px-8 pt-16 mb-8">
  <input
    value={page.title}
    class="outline-none text-2xl font-bold w-full"
    placeholder="Page title"
  />
</div>
<div class="px-8">
  <Block dispatchChangeBlockToRoot={onChangeBlock} {block} root={block} path={[0]} />
</div>
