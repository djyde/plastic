<script>
  import router from '../router'
  export let item

  function onClick(e) {
    e.preventDefault()
    router.navigate(`/page/${item.page.id}`)
  }

</script>

<span>[<a on:click|stopPropagation={onClick} class="text-blue-500" href={`/page/${item.page.id}`}>{item.page.title}</a>]</span>