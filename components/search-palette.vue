<template>
  <UModal v-model="searchBarOpen">
    <UCommandPalette
      @update:modelValue="(value) => onSelected(value)"
      v-model="selected"
      nullable
      :groups="[{ key: 'restaurants', commands: restaurants }]"
      :fuse="{ fuseOptions: { threshold: 0.1 } }"
    />
  </UModal>
</template>

<script setup lang="ts">
import type { RestaurantFeature } from "~/models/restaurant-feature";

const db = await useDb();
const searchBarOpen = useSearchBarOpen();
const currentPoint = useCurrentPoint();
const currentPointZoomed = useCurrentPointZoomed();

const restaurants = computed(
  () =>
    db.geojsonData.value?.features.map((f) => ({
      id: f.properties.code,
      label: f.properties.name,
    })) ?? []
);

const selected = ref<any | null>(null);

function onSelected(restaurant: { id: string; label: string } | null) {
  if (!restaurant) {
    return;
  }

  const item = db.geojsonData.value?.features.find(
    (v) => v.properties.code === restaurant.id
  );
  if (item) {
    currentPoint.value = item as RestaurantFeature;
    currentPointZoomed.value = item as RestaurantFeature;
  }
  searchBarOpen.value = false;
}
</script>
