<script>
  import { onMount, onDestroy } from "svelte";
  import Card from "../../../components/cards/Card.svelte";

  let mapElement;
  let map;

  let geojsonFeature = {
    id: "22de",
    enclosures: [],
    type: "Feature",
    properties: {
      name: "Coors Field",
      amenity: "Baseball Stadium",
      popupContent: "This is where the Rockies play!",
    },
    geometry: {
      type: "Point",
      coordinates: [-104.99404, 39.75621],
    },
  };

  onMount(async () => {
    const leaflet = await import("leaflet");

    map = leaflet.map(mapElement).setView([-104.99404, 39.75621], 5);

    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(map);

    leaflet
      .geoJSON(geojsonFeature)
      .addTo(map)
      .bindPopup((e) => e.feature.properties.popupContent)
      .openPopup();
  });

  onDestroy(async () => {
    if (map) {
      map.remove();
    }
  });
</script>

<div class="homeMap">
  <Card>
    <div slot="body" bind:this={mapElement} />
  </Card>
</div>

<style lang="scss">
  @import "leaflet/dist/leaflet.css";
  .homeMap {
    grid-area: map;
    div {
      aspect-ratio: 1 / 1;
    }
  }
</style>
