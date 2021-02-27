<script>
  import db from '../../db'
  import { navigate, Link } from 'svelte-routing'
  export let item

  console.log(item.value)
  let pageInfo = db.touchPageByTitle(item.value)

  console.log(pageInfo)
</script>

<span>[<Link class="text-blue-500" to={`/page/${pageInfo.id}`}>{item.value}</Link>]</span>