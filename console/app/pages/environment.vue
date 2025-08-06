<script setup lang="ts">
definePageMeta({
  panel: {
    title: '环境状况',
    icon: 'lucide:earth',
  },
});

const { data, x, ...k } = useEnvironmentData();
const windData = computed(() => {
  return data.value.map(d => ({
    date: d.date,
    speed: d.wind_speed_10m,
    direction: d.wind_direction_10m,
  }));
});

await k.init();
</script>

<template>
  <div v-if="data.length === 0" class="flex items-center justify-center h-64 text-muted-foreground">
    <UIcon name="lucide:cloud-off" class="h-8 w-8" />
    <span class="ml-2">暂无环境数据</span>
  </div>

  <div v-else class="grid grid-cols-3 gap-4">
    <LineChart
      title="气温"
      :value="k.formatTemp(k.averageTemp.value)"
      :data
      :x
      :y="k.yTemp"
      color="var(--ui-primary)"
      :x-tick-format="k.xTicks"
      :y-tick-format="(d: number) => `${d}°C`"
      :template="k.templateTemp"
    />

    <LineChart
      title="云量"
      :value="k.formatCloud(k.averageCloud.value)"
      :data
      :x
      :y="k.yCloud"
      color="var(--ui-secondary)"
      :x-tick-format="k.xTicks"
      :y-tick-format="(d: number) => `${d}%`"
      :template="k.templateCloud"
    />

    <LineChart
      title="太阳辐射"
      :value="k.formatSolar(k.averageSolar.value)"
      :data
      :x
      :y="k.ySolar"
      color="#F59E0B"
      :x-tick-format="k.xTicks"
      :y-tick-format="(d: number) => `${d} W/m²`"
      :template="k.templateSolar"
    />

    <div class="col-span-3 grid grid-cols-2">
      <WindChart
        :data="windData"
        :average-speed="k.averageWindSpeed.value"
        :average-direction="k.averageWindDirection.value"
      />
    </div>
  </div>
</template>
