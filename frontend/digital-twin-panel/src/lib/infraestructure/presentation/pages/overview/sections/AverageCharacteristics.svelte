<script>
  import Card from "../../../components/cards/Card.svelte";
  import StatsCard from "../../../components/cards/StatsCard.svelte";
  import PieChart from "../../../components/charts/PieChart.svelte";
  let characteristics = [
    {
      name: "Lluvia",
      value: 3.5,
      unit: "%",
    },
    {
      name: "Viento",
      value: 23,
      unit: "km/h",
    },
    {
      name: "Temperatura",
      value: 23,
      unit: "°C",
    },
  ];

  const getIconByCharacteristic = (characteristic) => {
    switch (characteristic.name) {
      case "Lluvia":
        return `<i class="fi fi-rr-raindrops" />`;
      case "Viento":
        return `<i class="fi fi-rr-wind" />`;
      case "Temperatura":
        return `<i class="fi fi-rr-temperature-low" />`;
      default:
        return `<i class="fi fi-rr-map-marker" />`;
    }
  };
</script>

<section class="avgCharacteristics">
  <h2 class="m-0 mb-8">Valores promedios</h2>
  <div class="characteristics">
    {#each characteristics as characteristic}
      <div class="characteristic-item">
        <StatsCard
          statName={characteristic.name}
          statValue={characteristic.value}
          statUnit={characteristic.unit}
        >
          {@html getIconByCharacteristic(characteristic)}
        </StatsCard>
      </div>
    {/each}
  </div>
  <div class="characteristics-analytics mt-16">
    <Card>
      <div slot="header" class="characteristics-analytics-header ml-8">
        <h3 class="m-0">Valores promedios por parcela</h3>
        <select>
          <option value="1">Parcela 1</option>
          <option value="2">Parcela 2</option>
          <option value="3">Parcela 3</option>
        </select>
      </div>
      <div slot="body" class="p-8">
        <div class="characteristics-analytics-chart">
          <PieChart
            data={characteristics.map((c) => c.value)}
            labels={characteristics.map((c) => c.name)}
          />
        </div>
      </div>
    </Card>
  </div>
</section>

<style lang="scss">
  .avgCharacteristics {
    grid-area: avgCharacteristics;
    word-break: break-all;
    word-wrap: break-word;

    .characteristics {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.5rem;
      .characteristic-item {
        flex: 200px;
      }
    }

    .characteristics-analytics-chart {
      max-height: 200px;
    }

    .characteristics-analytics-header {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
