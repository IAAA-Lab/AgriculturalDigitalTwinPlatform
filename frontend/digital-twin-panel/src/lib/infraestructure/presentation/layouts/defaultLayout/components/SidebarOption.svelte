<script>
  export let text;
  export let selected = false;
</script>

<div class="sidebar-option" class:selected>
  <div class="sidebar-option-icon pt-4 pl-4 pr-4">
    <slot />
  </div>
  <h3 class="sidebar-option-text m-0 ml-16 text-sm">
    {text}
  </h3>
</div>

<style lang="scss">
  .sidebar-option {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 5px 0px 5px 10px;
    width: 100%;
    border-radius: 10px;

    cursor: pointer;
    transition: all 0.2s ease-out;

    &:hover {
      h3 {
        color: color(primary);
      }
      :global(i) {
        color: color(primary);
      }
    }

    &.selected {
      background-color: color-bg(primary);
      @extend .sidebar-option, :hover;
    }
  }
</style>
