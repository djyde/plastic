<script>
  export let checked
  export let replace

  function onClickCheckbox() {
    if (checked) {
      replace('{{{TODO}}}')
    } else {
      replace('{{{DONE}}}')
    }
  }
</script>

<input checked={checked} on:click|stopPropagation={onClickCheckbox} type="checkbox" />