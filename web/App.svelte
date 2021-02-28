<script>
  import { Router, Link, Route } from "svelte-routing";
  import DailyNotes from "./pages/DailyNotes.svelte";
  import OpenFile from "./pages/OpenFile.svelte";

  import Page from "./Page.svelte";
  import { setContext } from "svelte";
  import rules from './rules'
  import DB from './db'

  export let url;

  setContext('plastic', {
    rules
  })

  let db
  if (db = DB.get()) {
  } else {
    url = "/openFile"
  }
</script>

<Router {url}>
  <nav class="flex justify-center p-4">
  </nav>
  <div class="flex">
    <div class="flex-1">
      <div style="width: 960px;" class="mx-auto">

        <Route path="page/:id" let:params>
          <Page pageId={params.id} />
        </Route>

        <Route path="openFile">
          <OpenFile />
        </Route>

        <Route path="/">
          <DailyNotes />
        </Route>

      </div>
    </div>
  </div>
</Router>
