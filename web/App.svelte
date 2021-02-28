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

  router.on("/", () => {
    if (DB.get()) {
      router.navigate("/daily");
    } else {
      router.navigate("/openFile");
    }
  });

  router.on("/page/:id", ({ data }) => {
    pageNow = {
      component: Page,
      props: {
        pageId: data.id,
      },
    };

    console.log(pageNow)
  });

  router.on("/daily", () => {
    pageNow = {
      component: DailyNotes,
      props: {},
    };
  });

  router.on("/openFile", () => {
    pageNow = {
      component: OpenFile,
      props: {},
    };
  });

  router.navigate(router.getCurrentLocation().url);

</script>

<nav class="flex justify-center p-4" />
<div class="flex">
  <div class="flex-1">
    <div style="width: 960px;" class="mx-auto">
      <svelte:component this={pageNow.component} {...pageNow.props} />
    </div>
  </div>
</div>
