<script setup lang="ts">
definePageMeta({
  panel: {
    title: '海洋生物固碳',
    icon: 'lucide:leaf',
  },
});

const { data, currentData, sunData, averageTemp, averageCurrentSpeed, averageCurrentDirection, isInlandCity, x, yTemp, formatTemp, xTicks, templateTemp, ...k } = useBioCaptureData();
await k.init();
</script>

<template>
  <div v-if="isInlandCity || data.length === 0" class="flex items-center justify-center h-64 text-muted-foreground">
    <UIcon name="lucide:waves" class="h-8 w-8" />
    <span class="ml-2">暂无海洋数据</span>
  </div>

  <div v-else class="grid grid-cols-3 gap-4">
    <LineChart
      title="海面温度"
      :value="formatTemp(averageTemp)"
      :data
      :x
      :y="yTemp"
      color="#06B6D4"
      :x-tick-format="xTicks"
      :y-tick-format="(d: number) => `${d}°C`"
      :template="templateTemp"
    />

    <WindChart
      title="海流分析"
      :data="currentData"
      :average-speed="averageCurrentSpeed"
      :average-direction="averageCurrentDirection"
    />
  </div>
</template>
