<template>
  <ClientOnly>
    <UButton
      :icon="presets[currentIndex].icon"
      size="xs"
      color="gray"
      variant="ghost"
      aria-label="Map Light Preset"
      @click="onNextPreset()"
    />

    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { MapLightPreset } from "~/models/map-light-preset";

let currentIndex = ref(0);
const mapLightPreset = useMapLightPreset();

const presets = [
  { type: MapLightPreset.day, icon: "i-heroicons-sun-solid" },
  { type: MapLightPreset.dusk, icon: "i-heroicons-moon" },
  { type: MapLightPreset.night, icon: "i-heroicons-moon-solid" },
  { type: MapLightPreset.dawn, icon: "i-heroicons-sun" },
];

function onNextPreset() {
  currentIndex.value = (currentIndex.value + 1) % presets.length;
  const next = presets[currentIndex.value];

  mapLightPreset.value = next.type;
}
</script>
