<template>
  <UContainer class="m-4">
    <UTable :columns="columns" :rows="restaurants" />
  </UContainer>
</template>

<script setup lang="ts">
const db = await useDb();

const columns = [
  {
    key: "code",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "address",
    label: "Address",
    sortable: true,
  },
  {
    key: "city",
    label: "City",
    sortable: true,
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
  },
  {
    key: "closingDay",
    label: "Closing Day",
    sortable: true,
  },
];

const restaurants = computed(
  () => db.geojsonData.value?.features.map((r) => r.properties) ?? []
);
</script>
