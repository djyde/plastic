<script>
  import DB from "../db";
  import { navigate } from "svelte-routing";

  async function openFile() {
    
  }

  async function createNewPlasticDirectory() {
    const db = await DB.open()
    // console.log('navigate')
    // navigate('/', { replace: true })
  }
</script>

<div class="flex">
  <div class="flex-1 flex justify-center mt-64">
    <div
      on:click={openFile}
      class="mx-2 tracking-wide text-gray-400 hover:text-gray-700 border-2 rounded border-gray-300 inline-block px-12 py-4 border-dashed font-medium cursor-pointer"
    >
      Open...
    </div>
    <div
      on:click={createNewPlasticDirectory}
      class="mx-2 tracking-wide text-gray-400 hover:text-gray-700 border-2 rounded border-gray-300 inline-block px-12 py-4 border-dashed font-medium cursor-pointer"
    >
      Create new
    </div>
  </div>
</div>
