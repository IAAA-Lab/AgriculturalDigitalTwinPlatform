<script>
  import { onMount, onDestroy } from "svelte";
  import Card from "../../../components/cards/Card.svelte";
  import leaflet from "leaflet";
  import { getColorList } from "../../../../../core/functions";
  import { parcelsService } from "src/app/config/config";

  export let enclosures = [];
  let map;
  let mapElement;
  let i = 0;

  const colorList = getColorList(enclosures.length);

  onMount(async () => {
    map = leaflet.map(mapElement);

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
      .bindPopup((e) => e.feature.properties.popupContent);

    map.fitBounds(features.getBounds(), { padding: [25, 25] });
  });

  onDestroy(async () => {
    if (map) {
      map.remove();
    }
  });
</script>

<div bind:this={mapElement} />

<style lang="scss">
  @import "leaflet/dist/leaflet.css";

  div {
    border: 8px solid color-bg(card);
  }
</style>
