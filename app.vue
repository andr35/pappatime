<template>
  <div>
    <div class="fixed top-2 w-full z-10 flex justify-center">
      <UTabs :items="items" @change="onChange" v-model="curr" />
    </div>

    <div class="fixed top-4 right-4 z-10">
      <UCard :ui="{ body: { padding: 'px-2 py-2 sm:p-2' } }">
        <div class="flex space-x-2">
          <MapLightBtn />
          <ThemeBtn />
        </div>
      </UCard>
    </div>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const curr = ref(0);

const items = [
  { label: "Map", path: "/" },
  { label: "Table", path: "/table" },
];

_updateBasedOnPath();
watch(
  () => route.path,
  () => {
    _updateBasedOnPath();
  }
);

function onChange(index: number) {
  const item = items[index];
  router.push({ path: item.path });
}

function _updateBasedOnPath() {
  const index = items.findIndex((p) => p.path === route.path);
  curr.value = index;
}
</script>
