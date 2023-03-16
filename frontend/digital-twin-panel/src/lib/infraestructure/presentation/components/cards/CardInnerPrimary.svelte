<div class="card">
  <slot name="header" />
  <slot name="body" />
</div>

<style lang="scss">
  .card {
    background: color-bg(secondary);
    border: 1px solid #e3e3e3;
    box-shadow: 0px 7px 15px rgba(244, 176, 139, 0.45);
    border-radius: 10px;
    padding: 8px;

    :global(*) {
      color: white !important;
    }
  }
</style>
