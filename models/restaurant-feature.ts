import { Geometry, Point } from "geojson";
import { Restaurant } from "./restaurant";

export type RestaurantFeature = GeoJSON.Feature<Point, Restaurant>;
