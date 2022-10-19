<script>
  import { onMount, onDestroy } from "svelte";
  import Card from "../../../components/cards/Card.svelte";
  import leaflet from "leaflet";
  import {
    getColorList,
    markerMapIconByColor,
  } from "../../../../../core/utils";

  let mapElement;
  let map;
  let i = 0;

  let geojsonFeatures = {
    type: "FeatureCollection",
    features: [
      {
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
          coordinates: [41.700972, -1.186698],
        },
      },
      {
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
          coordinates: [43.700972, -5.186698],
        },
      },
    ],
  };

  const colorList = getColorList(geojsonFeatures.features.length);

  onMount(async () => {
    map = leaflet.map(mapElement);

    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(map);

    const features = leaflet
      .geoJSON(geojsonFeatures, {
        // Change marker
        pointToLayer: function (feature, latlng) {
          return leaflet.marker(latlng, {
            icon: markerMapIconByColor(colorList[i++]),
          });
        },
        coordsToLatLng: function (coords) {
          return new leaflet.LatLng(coords[0], coords[1]);
        },
      })
      .addTo(map)
      .bindPopup((e) => e.feature.properties.popupContent);

    map.fitBounds(features.getBounds(), { padding: [50, 50] });
  });

  onDestroy(async () => {
    if (map) {
      map.remove();
    }
  });
</script>

<section class="homeMap">
  <Card>
    <div slot="body" bind:this={mapElement} />
  </Card>
</section>

<style lang="scss">
  @import "leaflet/dist/leaflet.css";
  .homeMap {
    grid-area: map;
    div {
      min-height: 200px;
      aspect-ratio: 1 / 1;
    }
  }
</style>
