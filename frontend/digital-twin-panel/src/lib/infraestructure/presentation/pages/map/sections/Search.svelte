<script>
  import { getColorList } from "@/src/lib/core/functions";
  import Card from "../../../components/cards/Card.svelte";
  import MapSearchCard from "../components/MapSearchCard.svelte";

  const colorList = getColorList(2);

  let enclosures = ["Enclosure 1", "Enclosure 2", "Enclosure 3", "Enclosure 4"];
  let search = "";

  // Listener for the search input
  $: {
    enclosures = enclosures.filter((e) =>
      e.toLowerCase().includes(search.toLowerCase())
    );
  }
</script>

<Card>
  <div slot="header">
    <h2 class="m-0 mb-8">Enclosures</h2>
  </div>
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
      <MapSearchCard
        enclosureName="Rec#143-30-12-3-1-0"
        area={100}
        ndvi={87}
        geojsonFeature={{
          type: "Feature",
          properties: { YourType: "YourType" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [41.700972, -1.186698],
                [43.700972, -5.186698],
                [43.700972, -1.186698],
                [41.700972, -1.186698],
              ],
            ],
          },
        }}
        color={colorList[0]}
      >
        <div slot="crops" class="row" />
      </MapSearchCard>
      <MapSearchCard
        enclosureName="Rec#123-32-12-3-1-3"
        area={2345}
        ndvi={24}
        geojsonFeature={{
          type: "Feature",
          properties: { YourType: "YourType" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [44.700972, -0.186698],
                [44.700972, -7.186698],
                [43.700972, -0.186698],
                [41.700972, -4.186698],
              ],
            ],
          },
        }}
        color={colorList[1]}
      >
        <div slot="crops" class="row" />
      </MapSearchCard>
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
