<script>
  import DB from "../db";
  import router from "../router";

  const db = DB.get();

  let results = [];

  let showResult = true;

  function searchPage(e) {
    results = db.searchPageByKeyword(e.target.value);
  }

  // searchPage({ target: { value: "o" } });
</script>

<div class="relative">
  <input
    class="w-full outline-none bg-gray-100 p-2 px-4 rounded"
    type="text"
    on:input={searchPage}
    on:focus={(e) => (showResult = true)}
    on:blur={(e) => {
      setTimeout(() => {
        showResult = false;
      }, 100);
    }}
    placeholder="Search or create page"
  />

  {#if showResult && results.length}
    <div class="border border-gray-100 shadow-sm absolute left-0 right-0">
      {#each results as result (result.id)}
        <a
          href="/"
          class="w-full block hover:bg-gray-100 px-4 py-2 text-sm"
          on:click={(e) => {
            e.preventDefault();
            router.navigate(`/page/${result.id}`);
          }}>{result.title}</a
        >
      {/each}
    </div>
  {/if}
</div>
