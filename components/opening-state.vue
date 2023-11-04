<template>
  <UBadge variant="soft" :color="isClosed ? 'red' : 'green'">{{
    isClosed ? "Closed" : "Open"
  }}</UBadge>
</template>

<script lang="ts">
const todayWeekDay = new Date().getDay();

const mapping: Record<string, number> = {
  DOMENICA: 0,
  LUNEDI: 1,
  MARTEDI: 2,
  MERCOLEDI: 3,
  GIOVEDI: 4,
  VENERDI: 5,
  SABATO: 6,
};
</script>

<script setup lang="ts">
const props = defineProps<{ closingDay?: string }>();

const isClosed = computed(() => {
  if (!props.closingDay || props.closingDay === "MAI CHIUSO") {
    return false;
  }

  const closingDays = props.closingDay
    .split(" E ")
    .map((d) => mapping[d] ?? -1);

  return closingDays.includes(todayWeekDay);
});
</script>
