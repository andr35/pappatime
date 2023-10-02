<template>
  <div class="w-screen h-screen">
    <Map></Map>
  </div>

  <div class="fixed bottom-4 w-full px-2 flex justify-center z-10">
    <UCard
      :ui="{
        header: { padding: 'px-2 py-2 sm:p-2' },
        body: { padding: 'px-2 py-2 sm:p-2' },
        footer: { padding: 'px-2 py-2 sm:p-2' },
      }"
    >
      <template #header v-if="currentPoint">
        <UContainer class="flex justify-between items-center space-x-4">
          <span>{{ currentPoint.properties.name }}</span>

          <div class="flex space-x-2">
            <UTooltip text="Fly to">
              <UButton
                icon="i-heroicons-arrows-pointing-in"
                size="2xs"
                color="primary"
                variant="soft"
                :ui="{ rounded: 'rounded-full' }"
                @click="onZoomOnCurrentPoint()"
              />
            </UTooltip>

            <UPopover>
              <UTooltip text="Raw data">
                <UButton
                  icon="i-heroicons-code-bracket"
                  size="2xs"
                  color="primary"
                  variant="soft"
                  :ui="{ rounded: 'rounded-full' }"
                />
              </UTooltip>
              <template #panel>
                <pre class="text-xs">
          {{ currentPoint.properties }}
        </pre
                >
              </template>
            </UPopover>
            <UTooltip text="Close">
              <UButton
                icon="i-heroicons-chevron-down"
                size="2xs"
                color="red"
                variant="soft"
                :ui="{ rounded: 'rounded-full' }"
                @click="onCloseDetailsPanel()"
              />
            </UTooltip>
          </div>
        </UContainer>
      </template>
      <UContainer v-if="currentPoint" class="flex-col space-y-2">
        <div class="flex items-center">
          <UIcon name="i-heroicons-map-pin" class="text-2xl mr-2" />
          <p>{{ currentPoint.properties.address }}</p>
        </div>
        <div class="flex items-center">
          <UIcon name="i-heroicons-building-office-2" class="text-2xl mr-2" />
          <p>{{ currentPoint.properties.city }}</p>
        </div>
        <div class="flex items-center">
          <UIcon
            name="i-heroicons-question-mark-circle"
            class="text-2xl mr-2"
          />
          <p>{{ currentPoint.properties.type }}</p>
        </div>
        <div class="flex items-center">
          <UIcon name="i-heroicons-x-circle" class="text-2xl mr-2" />
          <p>{{ currentPoint.properties.closingDay }}</p>
        </div>
        <div class="flex items-center">
          <UIcon name="i-heroicons-map" class="text-2xl mr-2" />
          <UKbd>
            {{ (currentPoint.geometry as any).coordinates[0] }}
            {{ (currentPoint.geometry as any).coordinates[1] }}
          </UKbd>
        </div>
      </UContainer>
      <template #footer>
        <UContainer class="flex items-center justify-between space-x-4">
          <div>
            <p class="text-xs">Click on a point to view details</p>
            <p class="text-xs">Type <UKbd>/</UKbd> to search</p>
          </div>
          <UButton
            icon="i-heroicons-magnifying-glass"
            size="md"
            color="primary"
            variant="solid"
            :ui="{ rounded: 'rounded-full' }"
            @click="toggleSearchBar()"
          />
        </UContainer>
      </template>
    </UCard>
  </div>

  <SearchPalette />
</template>

<script setup lang="ts">
const currentPoint = useCurrentPoint();
const currentPointZoomed = useCurrentPointZoomed();
const searchBarOpen = useSearchBarOpen();

defineShortcuts({
  "/": {
    handler: () => {
      toggleSearchBar();
    },
  },
});

defineShortcuts({
  escape: {
    handler: () => {
      onCloseDetailsPanel();
    },
  },
});

function onZoomOnCurrentPoint() {
  if (!currentPoint.value) {
    return;
  }

  currentPointZoomed.value = currentPoint.value;
}

function onCloseDetailsPanel() {
  currentPoint.value = null;
}

function toggleSearchBar() {
  searchBarOpen.value = !searchBarOpen.value;
}
</script>
