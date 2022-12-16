<div class={`card ${$$props.class}`}>
  <slot name="header" class="header" />
  <slot name="body" />
</div>

<style lang="scss">
  .card {
    background: #fbfbfb;
    border: 2px solid #e3e3e3e2;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.075);
    border-radius: 7px;
    padding: 8px;
    :global(h4) {
      padding: 0 0.8rem;
    }
  }
</style>
