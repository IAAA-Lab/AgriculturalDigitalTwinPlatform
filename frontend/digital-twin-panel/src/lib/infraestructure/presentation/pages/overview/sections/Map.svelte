<script>
  import { onMount } from "svelte";
  import Card from "../../../components/cards/Card.svelte";
  import leaflet from "leaflet";
  import {
    getColorList,
    markerMapIconByColor,
  } from "../../../../../core/functions";

  let mapElement;
  let i = 0;
  export let geojsonFeatures;
  const colorList = getColorList(geojsonFeatures.features.length);

  onMount(async () => {
    const map = leaflet.map(mapElement);

    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(map);

    const features = leaflet
      .geoJSON(geojsonFeatures, {
        // Change marker icon for each feature
        pointToLayer: function (feature, latlng) {
          return leaflet.marker(latlng, {
            icon: markerMapIconByColor(colorList[i++]),
          });
        },
        // GeoJSON coords are in [lon, lat] order instead of [lat, lon]
        // that Leaflet uses (by default), so reverse them
        coordsToLatLng: function (coords) {
          return new leaflet.LatLng(coords[0], coords[1]);
        },
      })
      .addTo(map)
      .bindPopup((e) => e.feature.id);

    // Fits map to all features present automatically
    map.fitBounds(features.getBounds(), { padding: [50, 50] }).setMaxZoom(10);

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
