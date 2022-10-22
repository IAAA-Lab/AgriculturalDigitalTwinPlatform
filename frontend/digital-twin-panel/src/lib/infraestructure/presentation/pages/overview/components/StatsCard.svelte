<script lang="ts">
  import { numberWithCommas } from "../../../../../core/functions";
  import Card from "../../../components/cards/Card.svelte";
  export let statName = "-";
  export let statValue: number;
  export let statUnit = "N/A";
</script>

<Card>
  <div class="stats-card" slot="body">
    <div class="stat-icon">
      <slot />
    </div>
    <div class="ml-8 stat-content">
      <h4 class="text-sm m-0">
        {statName}
      </h4>
      <div class="stat-value-unit">
        <h2 class="m-0 fw-600">
          {numberWithCommas(statValue)}
        </h2>
        <span class="ml-8 text-xxs">
          {statUnit}
        </span>
      </div>
    </div>
  </div>
</Card>

<style lang="scss">
  .stats-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .stat-icon {
      width: 70px;
      height: 70px;
      background: color-bg(primary);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      :global(i) {
        font-size: 45px;
        color: color(primary);
      }
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .stat-value-unit {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
