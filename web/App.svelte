<script>
  import { Router, Link, Route } from "svelte-routing";
  import DailyNotes from "./pages/DailyNotes.svelte";
  import Page from "./Page.svelte";

  let url = "";
</script>

<Router {url}>
  <nav class="flex justify-center p-4">
    <!-- <div class="self-center">
    <div class="px-4 py-2  border border-gray-200 rounded w-72">
      <input class="w-full outline-none" placeholder="Find or create page" />
    </div>
  </div> -->
  </nav>
  <div class="flex">
    <div class="flex-1">
      <div style="width: 960px;" class="mx-auto">
        <Route path="/">
          <DailyNotes />
        </Route>

        <Route path="/page/:id" let:params>
          <Page pageId={params.id} />
        </Route>
      </div>
    </div>
  </div>
</Router>
