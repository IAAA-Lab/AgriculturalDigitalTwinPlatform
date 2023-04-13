<script>
  import { enclosuresService } from "src/app/config/config";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import BarChart from "src/lib/infraestructure/presentation/components/charts/BarChart.svelte";
  import DoughnutChart from "src/lib/infraestructure/presentation/components/charts/DoughnutChart.svelte";
  import PhytosTable from "../components/PhytosTable.svelte";

  export let enclosureId;

  let selectedProduct;
  let startDate = new Date("2021-03-03");
  let endDate = new Date("2023-03-03");
  let startDateInput = startDate.toISOString().split("T")[0];
  let endDateInput = endDate.toISOString().split("T")[0];

  let treatments = [];

  $: startDate = new Date(startDateInput);
  $: endDate = new Date(endDateInput);

  $: {
    enclosuresService
      .getTreatments(enclosureId, startDate, endDate)
      .then((treatmentsList) => {
        treatments = treatmentsList;
      })
      .catch((error) => {
        treatments = [];
      });
  }
</script>

<Card>
  <div slot="header" class="header mb-16">
    <h2 class="m-0">Tratamientos</h2>
    <div class="input__dates__wrapper">
      <input type="date" bind:value={startDateInput} />
      <input type="date" bind:value={endDateInput} />
    </div>
  </div>
  <div slot="body" class="body p-8">
    <CardInner>
      <div slot="body" class="table__inner">
        <PhytosTable {treatments} />
      </div>
    </CardInner>
    <div class="table__pie__chart__wrapper">
      <!-- <CardInner class="chart__pie__wrapper">
          <h4 slot="header" class="m-0">Eficacia</h4>
          <div slot="body" class="chart__pie__body">
            {@const selectedProductInfo = treatments.filter(
              (phyto) => phyto.phytosanitary.name === selectedProduct
            )}
            {@const goodEfficacyCount = selectedProductInfo.filter(
              (phyto) => phyto.efficacy === "Good"
            ).length}
            <div class="chart__pie">
              <PieChart
                data={[
                  goodEfficacyCount,
                  selectedProductInfo.length - goodEfficacyCount,
                ]}
                labels={["Buena", "Mala"]}
                colors={["green", "red"]}
              />
            </div>
            {@const uniqueProducts = [
              ...new Set(treatments.map((phyto) => phyto.phytosanitary.name)),
            ]}
            <select bind:value={selectedProduct}>
              {#each uniqueProducts as product}
                <option value={product}>{product}</option>
              {/each}
            </select>
          </div>
        </CardInner> -->
    </div>
    <div class="chart__doughnut__line__wrapper">
      <CardInner class="chart__doughnut__wrapper">
        <h4 slot="header" class="m-0 mb-16">Dosis aplicada por producto</h4>
        <div slot="body" class="chart__doughnout">
          <!-- Sum all unique products dosages to a list -->
          {@const uniqueProducts = [
            ...new Set(treatments.map((phyto) => phyto.phytosanitary.name)),
          ]}
          {@const productsDosages = uniqueProducts.map((product) => {
            const productPhytos = treatments.filter(
              (phyto) => phyto.phytosanitary.name === product
            );
            return productPhytos.reduce((acc, curr) => acc + curr.quantity, 0);
          })}
          <DoughnutChart data={productsDosages} labels={uniqueProducts} />
        </div>
      </CardInner>
      <CardInner class="chart__line__wrapper">
        <div slot="body" class="chart__line">
          <BarChart
            data={treatments.map((phyto) => phyto.quantity)}
            labels={treatments.map(
              (phyto) => phyto.date.toString().split("T")[0]
            )}
            color="red"
            yAxisLabel="Dosis (L/ha)"
            title="Dosis aplicada por fecha"
          />
        </div>
      </CardInner>
    </div>
  </div>
</Card>

<style lang="scss">
  .header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    column-gap: 0.5rem;
  }

  .body {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }

  .table__inner {
    height: 300px;
    overflow: scroll;
  }

  .table__pie__chart__wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;

    :global(.chart__pie__wrapper) {
      flex: 1;
      min-width: 275px;
    }
  }

  .chart__doughnut__line__wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    :global(.chart__doughnut__wrapper) {
      flex: 3;
      min-width: 275px;
    }

    :global(.chart__line__wrapper) {
      flex: 7;
      min-width: 275px;
    }
    gap: 1rem;
  }

  .chart__pie {
    height: 140px;
  }
  .chart__line {
    height: 300px;
  }
  .chart__doughnout {
    height: 200px;
  }

  .chart__pie__body {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }

  .input__dates__wrapper {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    column-gap: 0.5rem;
  }
</style>
