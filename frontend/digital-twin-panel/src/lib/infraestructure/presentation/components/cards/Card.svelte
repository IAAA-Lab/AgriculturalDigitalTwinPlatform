<div class="card">
  <slot name="header" />
  <slot name="body" />
</div>

<style lang="scss">
  .card {
    background: color-bg(card);
    border: 1px solid rgba(152, 230, 144, 0.4);
    border-radius: 10px;
    padding: 10px;
  }
</style>
