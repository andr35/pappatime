import type { Point } from "geojson";
import type { Restaurant } from "./restaurant";

export type RestaurantFeature = GeoJSON.Feature<Point, Restaurant>;
