<script>
  import DailyNotes from "./pages/DailyNotes.svelte";
  import OpenFile from "./pages/OpenFile.svelte";
  import Page from "./Page.svelte";
  import { onDestroy, onMount, setContext } from "svelte";
  import rules from "./rules";
  import DB from "./db";
  import router from "./router";

  let pageNow = {
    component: OpenFile,
    props: {},
  };

  setContext("plastic", {
    rules,
  });

  onDestroy(() => {
    router.destroy();
  });

  function updateTitle() {
    // document.title = `Plastic - ${DB.get().directory}`;
  }

  router.on("/", () => {
    if (DB.get()) {
      updateTitle();
      router.navigate("/daily");
    } else {
      router.navigate("/openFile");
    }
  });

  router.on("/page/:id", ({ data }) => {
    updateTitle();
    pageNow = {
      component: Page,
      props: {
        pageId: data.id,
      },
    };
  });

  router.on("/daily", () => {
    updateTitle();
    pageNow = {
      component: DailyNotes,
      props: {},
    };
  });

  router.on("/openFile", () => {
    updateTitle();
    pageNow = {
      component: OpenFile,
      props: {},
    };
  });

  router.navigate(router.getCurrentLocation().hashString);
</script>

<div class="flex">
  <div class="flex-1">
    <svelte:component this={pageNow.component} {...pageNow.props} />
  </div>
</div>
