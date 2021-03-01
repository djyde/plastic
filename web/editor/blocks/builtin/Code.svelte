<script lang="ts">
  import type { Token } from "../../parser";

  export let focusTextHelper;
  export let item: Token;
</script>

<code on:click|capture={focusTextHelper(1)} class="bg-gray-100 box-border px-1 "
  >{item.value}</code
>
