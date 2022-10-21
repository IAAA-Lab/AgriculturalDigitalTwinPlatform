<script>
  import { onMount, onDestroy } from "svelte";
  import Card from "../../../components/cards/Card.svelte";
  import leaflet from "leaflet";
  import { getColorList } from "../../../../../core/utils";

  let map;
  let mapElement;
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

    map.fitBounds(features.getBounds(), { padding: [50, 50] });
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
    min-width: 400px;
  }
</style>
