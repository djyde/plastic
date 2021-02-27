<script>
  export let item
  export let focusTextHelper

</script>

<strong on:click|capture={focusTextHelper(2)}>{item.value}</strong>
