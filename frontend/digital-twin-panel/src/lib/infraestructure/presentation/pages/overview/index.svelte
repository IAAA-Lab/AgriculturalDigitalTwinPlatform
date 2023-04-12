<script lang="ts">
  import { enclosuresService } from "src/app/config/config";
  import { getColorList } from "src/lib/core/functions";
  import Error from "../../components/misc/Error.svelte";
  import Loading from "../../components/misc/Loading.svelte";
  import FirstColTable from "./components/FirstColTable.svelte";
  import Characteristics from "./sections/Characteristics.svelte";
  import Map from "./sections/Map.svelte";
  import Tables from "./sections/Tables.svelte";
  import { listOfEnclosures } from "src/app/config/stores/selectedEnclosure";
  import { map } from "leaflet";
  import Summary from "./sections/Summary.svelte";
</script>

<div class="container-responsive">
  <h1 class="title">Overview</h1>
  <div class="inner__container">
    {#await enclosuresService.getEnclosures($listOfEnclosures)}
      <Loading />
    {:then enclosures}
      <Characteristics {enclosures} />
      <Map {enclosures} />
      <Tables
        rows={enclosures.map((enclosure, index) => ({
          color: getColorList(enclosures.length)[index],
          id: enclosure.id,
          area: enclosure.properties.area,
          slope: enclosure.properties.slope,
          irrigationCoef: enclosure.properties.irrigationCoef,
          usedArea: enclosure.properties.areaSIGPAC,
          properties: enclosure.properties,
          // ndvi: await enclosuresService.getNDVI(enclosure.id)
        }))}
        columns={[
          {
            key: "enclosureId",
            title: "Recinto",
            value: (v) => v.id,
            sortable: true,
            renderComponent: FirstColTable,
          },
          {
            key: "Planta",
            title: "Planta",
            value: (v) => v.properties.crop.name || "N/A",
            sortable: true,
          },
          {
            key: "area",
            title: "Área (Ha)",
            value: (v) => v.area,
            sortable: true,
          },
          {
            key: "areaSIGPAC",
            title: "Área SIGPAC (Ha)",
            value: (v) => v.usedArea,
            sortable: true,
          },
          { key: "slope", title: "Pendiente (%)", value: (v) => v.slope },
          {
            key: "irrigationCoef",
            title: "Coef. de regadío (%)",
            value: (v) => v.irrigationCoef,
          },
          // { key: "ndvi", title: "NDVI", value: (v) => v.ndvi, sortable: true },
        ]}
      />
    {:catch error}
      <Error errorMessage={error.message} />
    {/await}
    <Summary />
  </div>
</div>

<style lang="scss">
  .inner__container {
    display: grid;
    gap: 0.75rem;
    grid-template-areas:
      "map"
      "characteristics"
      "tables"
      "summary";
    :global(.summary) {
      display: none;
    }
  }

  @include media(">large") {
    .inner__container {
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
      // Don't show the popup panel on large screens
      display: none !important;
    }
  }
</style>
