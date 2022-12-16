<script>
  import {
    getIconByCharacteristic,
    getRangeBarColor,
  } from "src/lib/core/functions";
  import Card from "../../../components/cards/Card.svelte";
  import Range from "../../../components/misc/Range.svelte";
  import StatsCard from "../components/StatsCard.svelte";
  let characteristics = [
    {
      name: "Área total",
      value: 8.43,
      unit: "Ha",
    },
    {
      name: "Área en uso",
      value: 8.12,
      unit: "Ha",
    },
    {
      name: "Coef. de regadío",
      value: 50,
      unit: "%",
    },
    {
      name: "Pendiente media",
      value: 24.5,
      unit: "%",
    },
  ];
</script>

<section>
  <h2 class="m-0">Parcelas del usuario</h2>
  <summary class="text-sm m-0 mb-8">Promedio de características</summary>
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
  <br />
  <div class="dynamic__characteristics">
    <Card>
      <h4 slot="header" class="m-0 mb-8 text-sm">
        Salud de las plantas (NDVI)
      </h4>
      <div slot="body" class="range">
        <Range value={0.1} to={1} background={getRangeBarColor(0.1)} />
        <span class="text-sm fw-700 ml-8">{10} %</span>
      </div>
    </Card>
    <Card>
      <h4 slot="header" class="m-0 mb-8 text-sm">Área en uso</h4>
      <div slot="body" class="range">
        <Range value={95} background={getRangeBarColor(95 / 100)} />
        <span class="text-sm fw-700 ml-8">{95} %</span>
      </div>
    </Card>
  </div>
</section>

<style lang="scss">
  section {
    grid-area: characteristics;
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

    .range {
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
    }

    .dynamic__characteristics {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
