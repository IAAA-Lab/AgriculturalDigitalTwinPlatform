<script>
  import { getColorList } from "@/src/lib/core/utils";
  import Card from "../../../components/cards/Card.svelte";

  import MapSearchCard from "../../../components/misc/MapSearchCard.svelte";

  const colorList = getColorList(2);
</script>

<Card>
  <div slot="header">
    <h2 class="m-0 mb-8">Enclosures</h2>
  </div>
  <div slot="body">
    <div class="search">
      <!-- TODO: Autocomplete -->
      <input type="text" placeholder="Buscar..." />
    </div>
    <br />
    <div class="enclosures">
      <MapSearchCard
        enclosureName="Enclosure 1"
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
        enclosureName="Enclosure 2"
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
</style>
