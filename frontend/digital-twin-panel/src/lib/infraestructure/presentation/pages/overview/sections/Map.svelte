<script>
  import { onMount } from "svelte";
  import Card from "../../../components/cards/Card.svelte";
  import leaflet from "leaflet";
  import { getColorList } from "../../../../../core/functions";

  let mapElement;
  let i = 0;
  export let enclosures;
  const colorList = getColorList(enclosures.length);

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
      features: enclosures,
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
      .addTo(map)
      .bindPopup((e) => e.feature.id);

    // Fits map to all features present automatically
    map.fitBounds(features.getBounds(), { padding: [25, 25] }).setMaxZoom(17);

    return () => map.remove();
  });
</script>

<section>
  <Card>
    <div slot="body" bind:this={mapElement} />
  </Card>
</section>

<style lang="scss">
  @import "leaflet/dist/leaflet.css";
  section {
    grid-area: map;
    div {
      min-height: 200px;
      aspect-ratio: 1 / 1;
    }
  }
</style>
