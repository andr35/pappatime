<template>
  <UContainer class="m-auto mt-20">
    <UInput v-model="q" placeholder="Filter..." />
    <UTable :columns="columns" :rows="filteredRows" />
  </UContainer>
</template>

<script setup lang="ts">
const db = await useDb();

const q = ref("");

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

const filteredRows = computed(() => {
  if (!q.value) {
    return restaurants.value;
  }
  return restaurants.value.filter((r) => {
    return Object.values(r).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
</script>
