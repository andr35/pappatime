<template>
  <div ref="mapElem" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import mapboxgl, { GeoJSONSource, type LngLatLike } from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import { MapLightPreset } from "~/models/map-light-preset";
import type { RestaurantFeature } from "~/models/restaurant-feature";

const LAYER = "markers-layer";
const SOURCE = "data";

const appConfig = useAppConfig();
const db = await useDb();
const currentPoint = useCurrentPoint();
const currentPointZoomed = useCurrentPointZoomed();
const mapLightPreset = useMapLightPreset();

const mapElem = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  await nextTick();

  mapboxgl.accessToken = appConfig.mapboxToken;
  const map = new mapboxgl.Map({
    container: mapElem.value!,
    style: "mapbox://styles/mapbox/standard", // style URL
    center: [11.12108, 46.06787], // starting position [lng, lat]
    zoom: 12, // starting zoom
  });

  map.on("style.load", () => {
    // Add terrain - elevation
    map.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14,
    });
    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ source: "mapbox-dem" });
  });

  map.on("load", async () => {
    // Init marker
    const img = new Image(24, 24);
    img.src = `markers/marker.svg`;
    img.onload = () => {
      map.addImage("my-restaurant", img);
    };

    map.addSource(SOURCE, {
      type: "geojson",
      data: db.geojsonData.value!,
    });
    watch(db.geojsonData, () => {
      if (db.geojsonData.value) {
        (map.getSource(SOURCE) as GeoJSONSource).setData(db.geojsonData.value);
      }
    });

    // Init layer
    map.addLayer({
      id: LAYER,
      source: SOURCE,

      // type: "circle",
      // paint: {
      //   "circle-radius": 4,
      //   "circle-stroke-width": 2,
      //   "circle-color": "red",
      //   "circle-stroke-color": "white",
      // },

      type: "symbol",
      layout: {
        // Icon
        "icon-image": "my-restaurant",
        "icon-offset": [0, -12],
        // Text
        "text-field": ["get", "name"],
        "text-size": 12,
        "text-offset": [0, 0.6],
        "text-anchor": "top",
        "icon-allow-overlap": true,
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
        "text-halo-blur": 0.5,
      },
    });

    // Init event handlers
    map.on("click", LAYER, (ev) => {
      const feature = ev.features?.[0];
      if (feature) {
        currentPoint.value = feature as unknown as RestaurantFeature;
      }
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on("mouseenter", LAYER, () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", LAYER, () => {
      map.getCanvas().style.cursor = "";
    });

    // Add geolocation button
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      }),
      "top-left"
    );

    watch(currentPointZoomed, (value) => {
      if (value) {
        map.flyTo({
          zoom: 20,
          center: value.geometry.coordinates as LngLatLike,
        });
        currentPointZoomed.value = null;
      }
    });

    watch(mapLightPreset, (value) => {
      map.setConfigProperty("basemap", "lightPreset", value);
      map.setPaintProperty(LAYER, "text-color", value === MapLightPreset.dusk || value === MapLightPreset.night ? "#ffffff" : "#000000");
      map.setPaintProperty(LAYER, "text-halo-color", value === MapLightPreset.dusk || value === MapLightPreset.night ? "#000000" : "#ffffff");
    });
  });
});
</script>

<style src="mapbox-gl/dist/mapbox-gl.css"></style>
