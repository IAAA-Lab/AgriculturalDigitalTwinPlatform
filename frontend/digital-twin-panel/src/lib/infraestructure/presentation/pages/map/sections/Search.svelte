<script lang="ts">
  import { IMAGES_SERVER_URL } from "src/app/config/config";
  import { selectedEnclosure } from "src/app/config/stores/selectedEnclosure";
  import type { Enclosure } from "src/lib/core/Domain";
  import { getColorList } from "src/lib/core/functions";
  import { Link } from "svelte-routing";
  import Card from "../../../components/cards/Card.svelte";
  import MapSearchCard from "../components/MapSearchCard.svelte";

  const colorList = getColorList(2);

  export let enclosures: Enclosure[] = [];
  console.log(enclosures);
  let search = "";

  // Listener for the search input
  // $: {
  //   enclosures = enclosures.filter((e) =>
  //     e.toLowerCase().includes(search.toLowerCase())
  //   );
  // }
</script>

<Card>
  <h2 class="m-0 mb-8" slot="header">Enclosures</h2>
  <div slot="body" class="p-8">
    <input
      type="search"
      bind:value={search}
      placeholder="Buscar..."
      style="width: 100%;"
    />
    <div class="search-more">
      <span class="text-xs"
        ><strong>{enclosures.length} resultados<strong /></strong></span
      >
      <div class="filter-order">
        <i class="fi fi-rr-settings-sliders" />
        <i class="fi fi-rr-sort-amount-down-alt" />
      </div>
    </div>
    <br />
    <div class="enclosures">
      {#each enclosures as enclosure, i}
        <Link to={`/enclosure/${enclosure.id}`}>
          <MapSearchCard
            enclosureName={enclosure.id}
            area={enclosure.properties.area.value}
            ndvi={enclosure.properties.ndvi.value}
            geojsonFeature={enclosure}
            color={colorList[i]}
          >
            <img
              slot="crops"
              src={`${IMAGES_SERVER_URL}/${enclosure.cropIds?.at(0).name}.png`}
              alt="crops"
              height="30"
              class="ml-8"
            />
          </MapSearchCard>
        </Link>
      {/each}
    </div>
  </div>
</Card>

<style lang="scss">
  .enclosures {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding-left: 5px;
    padding-right: 5px;
  }

  .search-more {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: 8px;
    padding-right: 8px;
  }
  .filter-order {
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    cursor: pointer;
  }
</style>
