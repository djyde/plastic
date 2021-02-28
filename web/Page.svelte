<script>
  import { getContext } from "svelte";
  import ReferenceBlock from "./ReferenceBlock.svelte";

  import Block from "./editor/Block.svelte";
  import dayjs from "dayjs";
  import adapter from "./adapter";
  import db from "./db";

  export let pageId;

  let references = [];

  let page = JSON.parse(JSON.stringify(db.getPageById(pageId)));

  const { rules } = getContext("plastic");

  (async () => {
    references = db.findPageReferenceBlocks(pageId);
  })();
</script>

<div class="px-8 pt-16 mb-8">
  <input
    value={page.type === "daily"
      ? dayjs(page.title).format("MMMM, DD, YYYY")
      : page.title}
    class="outline-none text-2xl font-bold w-full"
    placeholder="Page title"
  />
</div>
<div class="px-8">
  <Block {rules} isRoot={true} {adapter} block={page} root={page} path={[0]} />
</div>

<div class="p-8">
  <h1 class="font-bold mb-2">References</h1>

  <div>
    {#each references as blockBody (blockBody.id)}
      <ReferenceBlock {blockBody} />
      <!-- {#if blocksMap[blockBody.id]}
    <div>
      <a href={`/page/${blockBody.pageId}`}>{blockBody.pageId}</a>
    </div>
      <Block rules={rules} block={blocksMap[blockBody.id].block} adapter={adapter} path={blocksMap[blockBody.id].path} root={blocksMap[blockBody.id].page}/>
    {/if} -->
    {/each}
  </div>
</div>
