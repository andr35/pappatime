import { Geometry } from "geojson";
import { MapLightPreset } from "~/models/map-light-preset";
import { Restaurant } from "~/models/restaurant";
import { RestaurantFeature } from "~/models/restaurant-feature";

export const useGeojsonData = () =>
  useState<GeoJSON.FeatureCollection<Geometry, Restaurant> | null>(
    "data-geojson",
    () => null
  );

export const useCurrentPoint = () =>
  useState<RestaurantFeature | null>("current-point", () => null);

export const useCurrentPointZoomed = () =>
  useState<RestaurantFeature | null>("current-point-zoomed", () => null);

export const useSearchBarOpen = () =>
  useState<boolean>("search-bar-open", () => false);

export const useMapLightPreset = () =>
  useState<MapLightPreset>("map-light-preset", () => MapLightPreset.day);
