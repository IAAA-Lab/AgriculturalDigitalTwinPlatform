<script>
  export let text;
  export let selected = false;
</script>

<div class="sidebar-option" class:selected>
  <div class="sidebar-option-icon mr-16 pt-4">
    <slot />
  </div>
  <h3 class="sidebar-option-text m-0 text-sm">
    {text}
  </h3>
</div>

<style lang="scss">
  .sidebar-option {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 5px 0px 5px 10px;
    border-radius: 10px;
    width: 100%;
    min-width: 100px;

    cursor: pointer;
    transition: all 0.2s ease-out;

    &:hover {
      h3 {
        color: color(primary);
      }
      :global(i) {
        color: color(primary) !important;
      }
    }

    &.selected {
      background-color: rgb(221, 245, 221);
      @extend .sidebar-option, :hover;
    }
  }
</style>
