<script setup lang="ts">
definePageMeta({
  panel: {
    title: '海洋化学固碳',
    icon: 'lucide:flask-round',
  },
});

const { data, x, ...k } = useChemCaptureData();
await k.init();
</script>

<template>
  <div v-if="data.length === 0" class="flex items-center justify-center h-64 text-muted-foreground">
    <UIcon name="lucide:flask-round" class="h-8 w-8" />
    <span class="ml-2">暂无化学数据</span>
  </div>

  <div v-else class="grid grid-cols-3 gap-4">
    <LineChart
      title="二氧化碳浓度"
      :value="k.formatCO2(k.averageCO2.value)"
      :data
      :x
      :y="k.yCO2"
      color="#EF4444"
      :x-tick-format="k.xTicks"
      :y-tick-format="(d: number) => `${d} ppm`"
      :template="k.templateCO2"
    />

    <LineChart
      title="臭氧浓度"
      :value="k.formatOzone(k.averageOzone.value)"
      :data
      :x
      :y="k.yOzone"
      color="#8B5CF6"
      :x-tick-format="k.xTicks"
      :y-tick-format="(d: number) => `${d} μg/m³`"
      :template="k.templateOzone"
    />

    <StackedChart
      title="降水分析"
      :value="k.formatPrecip(k.totalPrecipitation.value)"
      :data
      :x
      :y="k.yPrecipitation"
      :colors="['var(--ui-secondary)', 'var(--ui-warning)']"
      :x-tick-format="k.xTicks"
      :y-tick-format="(d: number) => `${d} mm`"
      :template="k.templatePrecip"
      :stacked-keys="['雨', '雪']"
    />
  </div>
</template>
