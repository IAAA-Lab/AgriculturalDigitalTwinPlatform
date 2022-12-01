<script lang="ts">
  export let value = 0;
  export let height: number = 20;
  export let background: string = "";
  export let to: number = 100;
</script>

<div
  class="range-bar"
  style="--range-bar-width: {(value / to) *
    100}%; --range-bar-color: {background}; --range-bar-height: {height}px"
/>

<style lang="scss">
  .range-bar {
    width: 100%;
    height: var(--range-bar-height, 20px);
    background: rgb(220, 220, 220);
    border-radius: 10px;
    padding: 3px;
    overflow: hidden;

    &:before {
      content: "";
      display: block;
      width: var(--range-bar-width, 50%);
      height: 100%;
      background: var(--range-bar-color, rgb(220, 220, 220));
      border-radius: 8px;
    }
  }
</style>
