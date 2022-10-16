<div class="card">
  <slot name="header" />
  <slot name="body" />
</div>

<style lang="scss">
  .card {
    background: #fbfbfb;
    border: 1px solid #e3e3e3;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.05);
    border-radius: 7px;
    padding: 8px;
  }
</style>
