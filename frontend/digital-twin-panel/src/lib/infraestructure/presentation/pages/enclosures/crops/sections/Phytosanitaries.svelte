<script>
  import { parcelsService } from "src/app/config/config";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import BarChart from "src/lib/infraestructure/presentation/components/charts/BarChart.svelte";
  import DoughnutChart from "src/lib/infraestructure/presentation/components/charts/DoughnutChart.svelte";
  import PieChart from "src/lib/infraestructure/presentation/components/charts/PieChart.svelte";
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import PhytosTable from "../components/PhytosTable.svelte";

  export let enclosureId;

  let selectedProduct;
</script>

{#await parcelsService.getPhytosanitaries(enclosureId, new Date(), new Date())}
  <Loading />
{:then phytosList}
  <Card>
    <div slot="header" class="header mb-16">
      <h2 class="m-0">Fitosanitarios</h2>
      <div class="input__dates__wrapper">
        <input type="date" value="2021-03-03" />
        <input type="date" value="2021-08-12" />
      </div>
    </div>
    <div slot="body" class="body m-16">
      <div class="table__pie__chart__wrapper">
        <CardInner class="table__wrapper">
          <svelte:fragment slot="body">
            <PhytosTable {phytosList} />
          </svelte:fragment>
        </CardInner>
        <CardInner class="chart__pie__wrapper">
          <h4 slot="header" class="m-0">Eficacia</h4>
          <div slot="body" class="chart__pie__body">
            {@const selectedProductInfo = phytosList.filter(
              (phyto) => phyto.product === selectedProduct
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
              ...new Set(phytosList.map((phyto) => phyto.product)),
            ]}
            <select bind:value={selectedProduct}>
              {#each uniqueProducts as product}
                <option value={product}>{product}</option>
              {/each}
            </select>
          </div>
        </CardInner>
      </div>
      <div class="chart__doughnut__line__wrapper">
        <CardInner class="chart__doughnut__wrapper">
          <h4 slot="header" class="m-0 mb-16">Dosis aplicada por producto</h4>
          <div slot="body" class="chart__doughnout">
            <!-- Sum all unique products dosages to a list -->
            {@const uniqueProducts = [
              ...new Set(phytosList.map((phyto) => phyto.product)),
            ]}
            {@const productsDosages = uniqueProducts.map((product) => {
              const productPhytos = phytosList.filter(
                (phyto) => phyto.product === product
              );
              return productPhytos.reduce((acc, curr) => acc + curr.dosage, 0);
            })}
            <DoughnutChart data={productsDosages} labels={uniqueProducts} />
          </div>
        </CardInner>
        <CardInner class="chart__line__wrapper">
          <div slot="body" class="chart__line">
            <BarChart
              data={phytosList.map((phyto) => phyto.dosage)}
              labels={phytosList.map((phyto) =>
                phyto.startDate.toLocaleDateString()
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
{:catch}
  <Error />
{/await}

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

  .table__pie__chart__wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;

    :global(.table__wrapper) {
      flex: 7;
      overflow: scroll;
      height: 300px;
      min-width: 220px;
    }

    :global(.chart__pie__wrapper) {
      flex: 1;
      min-width: 220px;
    }
  }

  .chart__doughnut__line__wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    :global(.chart__doughnut__wrapper) {
      flex: 3;
      min-width: 120px;
    }

    :global(.chart__line__wrapper) {
      flex: 7;
      min-width: 120px;
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
