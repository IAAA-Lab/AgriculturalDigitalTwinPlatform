<script lang="ts">
  export let value = 0;

  const LOW = value < 25;
  const MEDIUM = value >= 25 && value < 75;
  const HIGH = value >= 75;

  const getRangeBarColor = (value: number) => {
    if (HIGH) {
      return "green";
    } else if (MEDIUM) {
      return "yellow";
    } else {
      return "red";
    }
  };
</script>

<div
  class="range-bar"
  style="--range-bar-width: {value}%; --range-bar-color: {getRangeBarColor(
    value
  )};"
/>

<style lang="scss">
  .range-bar {
    width: 100%;
    height: 25px;
    background-color: rgb(220, 220, 220);
    border-radius: 10px;
    padding: 3px;

    &:before {
      content: "";
      display: block;
      width: var(--range-bar-width, 50%);
      height: 100%;
      background-color: var(--range-bar-color, rgb(220, 220, 220));
      border-radius: 8px;
    }
  }
</style>
