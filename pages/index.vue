<template>
  <div class="fixed top-4 right-4 z-10">
    <UCard>
      <ThemeBtn></ThemeBtn>
    </UCard>
  </div>

  <div class="w-screen h-screen">
    <Map :zoomOn="zoomEvent"></Map>
  </div>

  <div class="fixed bottom-4 w-full px-2 flex justify-center z-10">
    <UCard>
      <template #header>
        <UContainer
          v-if="currentPoint"
          class="flex justify-between items-center"
        >
          <span>{{ currentPoint.properties.name }}</span>

          <div class="flex space-x-2">
            <UTooltip text="Fly to">
              <UButton
                icon="i-heroicons-arrows-pointing-in"
                size="sm"
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
                  size="sm"
                  color="primary"
                  variant="soft"
                  :ui="{ rounded: 'rounded-full' }"
                />
              </UTooltip>
            </UPopover>
          </div>

          <template #panel>
            <pre class="text-xs">
          {{ currentPoint.properties }}
        </pre
            >
          </template>
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
      <UContainer v-else>
        <p>
          <i>Click on a point to view details</i>
        </p>
      </UContainer>
      <template #footer>
        <UContainer class="flex items-center justify-between">
          <p class="text-xs">Type <UKbd>/</UKbd> to search</p>
          <UButton
            icon="i-heroicons-magnifying-glass"
            size="md"
            color="primary"
            variant="solid"
            :ui="{ rounded: 'rounded-full' }"
            @click="isSearchOpen = !isSearchOpen"
          />
        </UContainer>
      </template>
    </UCard>
  </div>

  <SearchPalette :isOpen="isSearchOpen" />
</template>

<script setup lang="ts">
import { RestaurantFeature } from "~/models/restaurant-feature";

const currentPoint = useCurrentPoint();

const zoomEvent = ref<RestaurantFeature | null>(null);
const isSearchOpen = ref<boolean>(false);

function onZoomOnCurrentPoint() {
  if (!currentPoint.value) {
    return;
  }

  zoomEvent.value = currentPoint.value;

  setTimeout(() => {
    zoomEvent.value = null;
  }, 500);
}
</script>
