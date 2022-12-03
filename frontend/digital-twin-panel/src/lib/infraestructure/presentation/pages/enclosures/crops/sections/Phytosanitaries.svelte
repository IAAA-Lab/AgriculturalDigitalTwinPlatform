<script>
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import BarChart from "src/lib/infraestructure/presentation/components/charts/BarChart.svelte";
  import LineChart from "src/lib/infraestructure/presentation/components/charts/LineChart.svelte";
  import DoughnutChart from "src/lib/infraestructure/presentation/components/charts/DoughnutChart.svelte";
  import Tables from "../../../overview/sections/Tables.svelte";
  import PieChart from "src/lib/infraestructure/presentation/components/charts/PieChart.svelte";
</script>

<Card>
  <div slot="header" class="header mb-16">
    <h2 class="m-0">Fitosanitarios</h2>
    <input type="date" />
  </div>
  <div slot="body" class="body m-16">
    <div class="table__wrapper">
      <Tables />
    </div>
    <CardInner class="chart__pie__wrapper">
      <h4 slot="header" class="m-0">Eficacia</h4>
      <div slot="body" class="chart__pie__body">
        <div class="chart__pie">
          <PieChart data={[2, 10]} labels={["Buena", "Mala"]} />
        </div>
        <select>
          <option value="1">CULPROSAN WG</option>
          <option value="2">Stamina</option>
          <option value="3">THOR GOLD</option>
        </select>
      </div>
    </CardInner>
    <CardInner class="chart__doughnut__wrapper">
      <div slot="body" class="chart__doughnout">
        <DoughnutChart
          data={[2, 2, 2, 2, 3]}
          labels={["we", "d", "sd", "sd", "wds"]}
        />
      </div>
    </CardInner>
    <CardInner class="chart__line__wrapper">
      <div slot="body" class="chart__line">
        <BarChart
          data={[
            3, 4, 4, 1, 4, 8, 9, 23, 1, 2, 43, 23, 1, 2, 1, 3, 1, 3, 34, 13, 1,
            23,
          ]}
          labels={[
            "we",
            "d",
            "sd",
            "sd",
            "wds",
            "ds",
            "sd",
            "sd",
            "ds",
            "sd",
            "sd",
            "ds",
            "sd",
            "sd",
            "ds",
            "sd",
            "sd",
            "ds",
            "sd",
            "sd",
            "ds",
            "sd",
          ]}
          color={"orange"}
        />
      </div>
    </CardInner>
  </div>
</Card>

<style>
  .header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    column-gap: 0.5rem;
  }

  .body {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(6, minmax(auto, 1fr));
  }

  .table__wrapper {
    grid-column: 1 / 6;
  }

  :global(.chart__pie__wrapper) {
    grid-column: 6 / 7;
  }

  :global(.chart__doughnut__wrapper) {
    grid-column: 1 / 3;
  }

  :global(.chart__line__wrapper) {
    grid-column: 3 / 7;
  }

  .chart__pie,
  .chart__line,
  .chart__doughnout {
    height: 200px;
  }

  .chart__pie__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 0.75rem;
  }
</style>
