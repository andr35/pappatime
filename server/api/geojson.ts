import { defineEventHandler } from "h3";
import geojson from "../../public/geojson.json";

export default defineEventHandler(() => {
  return geojson;
});
