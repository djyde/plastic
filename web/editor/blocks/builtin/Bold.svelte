<script lang="ts">
  import type { Token } from "../../parser";

  export let item: Token;
  export let focusTextHelper;
</script>

<strong on:click|capture={focusTextHelper(2)}>{item.value}</strong>
