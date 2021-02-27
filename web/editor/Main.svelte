<script>
import { setContext } from "svelte";

  import Block from "./Block.svelte";
  import { mockData } from './mock'

  let page = {
    id: 'root',
    children: [
      {
        id: 'first',
        children: []
      }
    ]
  }

  const blocks = {
    'first': {
      content: ''
    }
  }

  function exportBlock () {
    console.log(JSON.stringify({
      page,
      blocks
    }, null, 2));
  }

  function onChangeBlock() {
    // new block
  }

  setContext('plastic', {
    addBlock(block) {
      blocks[block.id] = block
    },
    getBlock(blockId) {
      console.log(blocks[blockId])
      return blocks[blockId]
    },
    updateBlock(blockId, body) {
      blocks[blockId] = {
        ...blocks[blockId],
        ...body
      }
    },
    onPageChanged() {
      console.log('page change')
    }
  })
</script>

<div class="py-24">
  <div class="mx-auto" style="width: 960px">
    <div class="mb-4">
      <button on:click={exportBlock} class="bg-blue-500 px-4 py-1 text-sm rounded text-white">Export</button>
    </div>
    <Block block={page} path={[0]} root={page} />
  </div>
</div>
