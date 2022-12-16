<script>
  export let text;
  export let selected = false;
</script>

<div class="sidebar-option" class:selected>
  <div class="pt-4 pl-4 pr-4">
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
    padding: 5px 10px 5px 10px;
    border-radius: 10px;

    &:hover {
      :global(i),
      h3 {
        color: color(primary);
      }
    }

    &.selected {
      transition: background-color 5s ease-out;
      background-color: color-bg(primary);
      @extend .sidebar-option, :hover;
    }
  }
</style>
