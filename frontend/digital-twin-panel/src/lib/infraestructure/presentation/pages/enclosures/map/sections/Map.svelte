<script>
  import { onMount } from "svelte";
  import leaflet from "leaflet";
  import { getColorList } from "src/lib/core/functions";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";

  let mapElement;
  let i = 0;
  export let parcels;
  const colorList = getColorList(parcels.length);

  console.log(parcels);

  onMount(async () => {
    const map = leaflet.map(mapElement);

    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(map);

    const geojsonFeatures = {
      type: "FeatureCollection",
      features: parcels,
    };

    const features = leaflet
      .geoJSON(geojsonFeatures, {
        style: (feature) => {
          return {
            fillColor: colorList[i++],
            weight: 2,
            opacity: 1,
            color: "black",
            fillOpacity: 0.7,
            pane: "markerPane",
          };
        },
      })
      .addTo(map);
    // .bindPopup((e) => e.feature.type);

    // Fits map to all features present automatically
    map.fitBounds(features.getBounds(), { padding: [25, 25] }).setMaxZoom(17);

    return () => map.remove();
  });
</script>

<Card>
  <svelte:fragment slot="body">
    <div bind:this={mapElement} />
  </svelte:fragment>
</Card>

<style lang="scss">
  @import "leaflet/dist/leaflet.css";
  div {
    min-height: 200px;
    height: 100%;
  }
</style>
