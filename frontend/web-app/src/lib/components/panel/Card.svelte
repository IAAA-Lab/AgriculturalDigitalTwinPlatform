<script>
  export let height = "auto";
  export let width = "auto";
</script>

<div class="card" style="--height: {height}; --width: {width}">
  <slot name="header" />
  <slot name="body" />
</div>

<style lang="scss">
  .card {
    background: color-bg(card);
    border: 2px solid rgba(189, 202, 187, 0.764);
    border-radius: 10px;
    padding: 10px;
    height: var(--height);
    width: var(--width);
  }
</style>
