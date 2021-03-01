<script>
  import DB from "../db";
  import router from "../router";

  async function openFile() {
    await DB.open(false)
    console.log(DB.get())
    router.navigate('/')
  }

  async function createNewPlasticDirectory() {
    const db = await DB.open(true)
    // console.log('navigate')
    router.navigate('/')
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
