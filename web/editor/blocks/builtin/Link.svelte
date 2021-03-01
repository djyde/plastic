<script lang="ts">
  import type { Token } from "../../parser";

  export let item: Token;
</script>

<span
  >[<a on:click|stopPropagation class="text-blue-500" href="/#">{item.value}</a
  >]</span
>
