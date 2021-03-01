<script>
  import { getContext, onMount } from "svelte";
  import ReferenceBlock from "./ReferenceBlock.svelte";

  import Block from "./editor/Block.svelte";
  import dayjs from "dayjs";
  import adapter from "./adapter";
  import PageSearchInput from "./components/PageSearchInput.svelte";

  import DB from "./db";
  import RouteLink from "./components/RouteLink.svelte";

  const { rules } = getContext("plastic");

  export let pageId;

  let references = [];

  let page;

  let isStared;

  $: {
    page = JSON.parse(JSON.stringify(DB.get().getPageById(pageId)));

    (async () => {
      references = DB.get().findPageReferenceBlocks(pageId);
      isStared = DB.get().isStared(pageId);
    })();
  }

  let staredPages = DB.get().getStaredPages();

  function star() {
    console.log('star', pageId)
    DB.get().starPage(pageId);
    isStared = DB.get().isStared(pageId);
  }

  function unstar() {
    DB.get().unstarPage(pageId);
    console.log('unstar', pageId)
    isStared = DB.get().isStared(pageId);
  }
</script>

<div class="flex h-screen">
  <aside class="w-64 border-r border-gray-100">
    <div class="mb-12" />
    <div class="text-gray-500 font-bold px-6 mb-2">Stared Pages</div>
    <RouteLink
      className="block px-6 py-2 hover:text-gray-700 font-medium"
      to={`/daily`}>Daily Notes</RouteLink
    >

    {#each staredPages as page (page.id)}
      <RouteLink
        className="block px-6 py-2 hover:text-gray-700 fofnt-medium"
        to={`/page/${page.id}`}>{page.title}</RouteLink
      >
    {/each}
  </aside>

  <div class="flex-1 overflow-scroll">
    <nav class="p-4 flex">
      <div class="flex-1" />

      <div class="flex-1 flex justify-end">
        <div class="w-64">
          <PageSearchInput />
        </div>
      </div>
    </nav>

    <div class="flex">
      <div class="flex-1 px-12">
        <div class="px-8 pt-8 mb-8">
          <input
            value={page.type === "daily"
              ? dayjs(page.title).format("MMMM, DD, YYYY")
              : page.title}
            class="outline-none text-2xl font-bold w-full"
            placeholder="Page title"
          />

          <div class="text-gray-500 text-sm underline mt-2">
            {#if isStared}
              <span on:click={unstar} class="cursor-pointer">Unstar</span>
            {:else}
              <span on:click={star} class="cursor-pointer"
                >Star this page
              </span>
            {/if}
          </div>
        </div>
        <div class="px-8">
          <Block
            {rules}
            isRoot={true}
            {adapter}
            block={page}
            root={page}
            path={[0]}
          />
        </div>

        <div class="p-8">
          <h1 class="font-bold mb-2">References</h1>

          <div>
            {#each references as blockBody (blockBody.id)}
              <div class="my-4">
                <ReferenceBlock {blockBody} />
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
