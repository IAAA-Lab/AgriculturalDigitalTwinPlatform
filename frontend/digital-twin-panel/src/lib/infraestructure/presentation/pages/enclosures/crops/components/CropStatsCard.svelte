<script lang="ts">
  import { numberWithCommas } from "src/lib/core/functions";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import CardInnerPrimary from "src/lib/infraestructure/presentation/components/cards/CardInnerPrimary.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";

  export let title: string;
  export let value: number;
  export let unit: string = "";
  export let diff: number;
  export let primary: boolean = false;

  let diffColor: string;
  let diffIcon: string;

  $: diffColor = diff > 0 ? "text-color-success" : "text-color-error";
  $: diffIcon = diff > 0 ? "up" : "down";
</script>

<svelte:component this={primary ? CardInnerPrimary : CardInner}>
  <div slot="header" class="card-header pt-8 tt-u">
    <h4 class="text-sm stat-header m-0">
      {title}
    </h4>
  </div>
  <div slot="body" class="stat-body">
    <div class="value-unit">
      <h2 class="m-0 fw-700">{numberWithCommas(value)}</h2>
      <span class="text-sm {unit && 'ml-4'}">{unit}</span>
    </div>
    <div class="icon-diff">
      <span class="diff text-xs {diffColor}">
        <i class="fi fi-rr-angle-small-{diffIcon} {diffColor}" />
        {diff}
      </span>
    </div>
    <div class="chart">
      <LineChart
        data={[2, 2, 2, 2, 3]}
        labels={["we", "d", "sd", "sd", "wds"]}
        color={"orange"}
      />
    </div>
  </div>
</svelte:component>

<style lang="scss">
  .stat-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .stat-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .value-unit {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    .diff {
      background-color: #fbfbfb;
      padding: 3px 8px;
      border-radius: 7px;
    }

    .chart {
      height: 100px;
      max-width: 300px;
      width: 100%;
    }
  }
</style>
