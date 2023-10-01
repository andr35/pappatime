<template>
  <UModal :modelValue="isOpen">
    <UCommandPalette
      v-model="selected"
      nullable
      :groups="[{ key: 'restaurants', commands: restaurants }]"
      :fuse="{ resultLimit: 6, fuseOptions: { threshold: 0.1 } }"
    />
  </UModal>
</template>

<script setup lang="ts">
const db = await useDb();

const restaurants = computed(
  () =>
    db.geojsonData.value?.features.map((f) => ({
      id: f.properties.code,
      label: f.properties.name,
    })) ?? []
);

defineProps<{ isOpen: boolean }>();

const selected = ref<any | null>(null);
</script>
