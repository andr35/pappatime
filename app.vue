<template>
  <div>
    <div class="fixed top-2 w-full z-10 flex justify-center">
      <UTabs :items="items" @change="onChange" />
    </div>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const items = [{ label: "Map" }, { label: "Table" }];

function onChange(index: number) {
  switch (index) {
    case 0:
      router.push({ path: "/" });
      break;
    case 1:
      router.push({ path: "/table" });
      break;

    default:
      break;
  }
}
</script>
