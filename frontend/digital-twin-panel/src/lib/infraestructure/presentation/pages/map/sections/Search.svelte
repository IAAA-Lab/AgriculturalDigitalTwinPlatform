<script lang="ts">
  import { IMAGES_SERVER_URL, enclosuresService } from "src/app/config/config";
  import { selectedEnclosure } from "src/app/config/stores/selectedEnclosure";
  import type { Enclosure, NDVI } from "src/lib/core/Domain";
  import { getColorList, onCropImageError } from "src/lib/core/functions";
  import { Link } from "svelte-routing";
  import Card from "../../../components/cards/Card.svelte";
  import MapSearchCard from "../components/MapSearchCard.svelte";
  import { onMount } from "svelte";

  export let enclosures: Enclosure[] = [];
  const colorList = getColorList(enclosures.length);
  let search = "";
</script>

<Card>
  <h2 class="m-0 mb-8 ml-8" slot="header">Recintos</h2>
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
            location={enclosure.properties.geographicSpot}
            enclosureName={enclosure.id}
            area={enclosure.properties.area}
            geojsonFeature={enclosure}
            color={colorList[i]}
            cropName={enclosure.properties.crop.name}
          >
            <img
              on:error={onCropImageError}
              slot="crops"
              src={`${IMAGES_SERVER_URL}/${enclosure.properties.crop.id}.png`}
              alt="img planta"
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
