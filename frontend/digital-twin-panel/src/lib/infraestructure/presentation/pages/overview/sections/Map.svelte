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

  const colorList = getColorList(1);
  console.log(colorList);

  onMount(async () => {
    map = leaflet.map(mapElement);
    map.fitBounds([[39.75621, -104.99404]], 13);

    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      .addTo(map);

    leaflet
      .geoJSON(geojsonFeature, {
        // Change marker
        pointToLayer: function (feature, latlng) {
          return leaflet.marker(latlng, {
            icon: markerMapIconByColor(colorList[i++]),
          });
        },
        coordsToLatLng: function (coords) {
          return new leaflet.LatLng(coords[1], coords[0]);
        },
      })
      .addTo(map)
      .bindPopup((e) => e.feature.properties.popupContent);
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
