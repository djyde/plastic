<script>
  import Block from "plastic-editor";

  let block = {
    id: "root",
    content: "",
    children: [
      {
        id: "empty",
        content: "",
        children: [],
      },
    ],
  };
</script>

<div class="flex">
  <div class="flex-1">
    <div style="width: 960px;" class="mx-auto">
      <div class="px-8 pt-16 mb-8">
        <input
          value="Test page"
          class="outline-none text-2xl font-bold w-full"
          placeholder="Page title"
        />
      </div>
      <div class="px-8">
        <Block {block} root={block} path={[0]} />
      </div>
    </div>
  </div>
</div>
