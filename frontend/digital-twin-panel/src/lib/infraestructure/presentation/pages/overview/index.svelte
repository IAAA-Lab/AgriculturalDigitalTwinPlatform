<script lang="ts">
  import { parcelsService } from "src/app/config/config";
  import { getColorList } from "src/lib/core/functions";
  import Error from "../../components/misc/Error.svelte";
  import Loading from "../../components/misc/Loading.svelte";
  import FirstColTable from "./components/FirstColTable.svelte";
  import Characteristics from "./sections/Characteristics.svelte";
  import Map from "./sections/Map.svelte";
  import Summary from "./sections/Summary.svelte";
  import Tables from "./sections/Tables.svelte";
</script>

<h1 class="title">Overview</h1>
<div class="overview mr-8 container-responsive">
  {#await parcelsService.getEnclosures( ["50-99-0-0-28-144-1", "50-99-0-0-2-190-1"] )}
    <Loading />
  {:then parcels}
    <Characteristics />
    <Map {parcels} />
    {@const colorList = getColorList(parcels.length)}
    <Tables
      rows={[
        {
          color: colorList[0],
          id: "47-96-0-0-5-25-1",
          area: 6.2002,
          slope: 14,
          irrigationCoef: 100,
          usedArea: 98,
          ndvi: 0.087,
        },
        {
          color: colorList[1],
          id: "47-124-0-0-4-560-1",
          area: 2.2222,
          slope: 35,
          irrigationCoef: 0,
          usedArea: 92,
          ndvi: 0.12,
        },
      ]}
      columns={[
        {
          key: "parcelId",
          title: "Parcela",
          value: (v) => v.id,
          sortable: true,
          renderComponent: FirstColTable,
        },
        {
          key: "area",
          title: "Área (Ha)",
          value: (v) => v.area,
          sortable: true,
        },
        { key: "slope", title: "Pendiente media (%)", value: (v) => v.slope },
        {
          key: "irrigationCoef",
          title: "Coef. de regadío (%)",
          value: (v) => v.irrigationCoef,
        },
        {
          key: "usedArea",
          title: "Área en uso (%)",
          value: (v) => v.usedArea,
          sortable: true,
        },
        { key: "ndvi", title: "NDVI", value: (v) => v.ndvi, sortable: true },
      ]}
    />
  {:catch error}
    <Error />
  {/await}
  <Summary />
</div>

<style lang="scss">
  .overview {
    display: grid;
    gap: 0.75rem;
    grid-template-areas:
      "map"
      "characteristics"
      "tables";
    :global(.summary) {
      display: none;
    }
  }

  @include media(">large") {
    .overview {
      grid-template-columns: 2.5fr 2.5fr 2fr;
      grid-template-areas:
        "map characteristics summary"
        "map characteristics summary"
        "tables tables summary";
      :global(.summary) {
        display: block;
      }
    }
    :global(.cupertino-pane-wrapper) {
      display: none !important;
    }
  }
</style>
