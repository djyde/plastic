<script lang="ts">
  export let url: string
  export let title: string

  function onClickLink(e) {
    e.preventDefault()
    // @ts-expect-error
    global.require("electron").shell.openExternal(url)
  }
</script>

<a class="text-blue-500" on:click|stopPropagation={onClickLink} href={url}>{title}</a>