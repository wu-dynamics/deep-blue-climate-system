<script setup lang="ts">
definePageMeta({
  panel: {
    title: '海洋云增亮',
    icon: 'lucide:cloud',
  },
});

const { data, stats, cloudStatus, x, yTotal, yStacked, formatCloud, xTicks, templateTotal, templateStacked, ...k } = useCloudBrighteningData();
await k.init();
</script>

<template>
  <div v-if="data.length === 0" class="flex items-center justify-center h-64 text-muted-foreground">
    <UIcon name="lucide:cloud-off" class="h-8 w-8" />
    <span class="ml-2">暂无云量数据</span>
  </div>

  <div v-else class="grid grid-cols-2 gap-4">
    <LineChart
      title="总云量"
      :value="formatCloud(stats.avgTotal)"
      :data
      :x
      :y="yTotal"
      color="var(--ui-primary)"
      :x-tick-format="xTicks"
      :y-tick-format="(d: number) => `${d}%`"
      :template="templateTotal"
    />

    <StackedChart
      title="分层云量分析"
      :value="`低 ${formatCloud(stats.avgLow)} 中 ${formatCloud(stats.avgMid)} 高 ${formatCloud(stats.avgHigh)}`"
      :data
      :x
      :y="yStacked"
      :colors="['var(--ui-color-secondary-100)', 'var(--ui-color-secondary-400)', 'var(--ui-color-secondary-950)']"
      :x-tick-format="xTicks"
      :y-tick-format="(d: number) => `${d}%`"
      :template="templateStacked"
      :stacked-keys="['低云', '中云', '高云']"
    />

    <div class="col-span-2 grid grid-cols-4 gap-4 h-40">
      <StatCard title="低云 (0~3km)" icon="lucide:cloud" center>
        <p class="text-2xl font-bold text-blue-400">
          {{ formatCloud(stats.avgLow) }}
        </p>
        <p class="text-xs text-muted mt-1">
          平均覆盖率
        </p>
      </StatCard>

      <StatCard title="中云 (3~8km)" icon="lucide:cloud" center>
        <p class="text-2xl font-bold text-blue-500">
          {{ formatCloud(stats.avgMid) }}
        </p>
        <p class="text-xs text-muted mt-1">
          平均覆盖率
        </p>
      </StatCard>

      <StatCard title="高云 (8km+)" icon="lucide:cloud" center>
        <p class="text-2xl font-bold text-blue-600">
          {{ formatCloud(stats.avgHigh) }}
        </p>
        <p class="text-xs text-muted mt-1">
          平均覆盖率
        </p>
      </StatCard>

      <StatCard title="天气状态" :icon="cloudStatus.icon" center>
        <p class="text-2xl font-bold " :class="cloudStatus.color">
          {{ cloudStatus.status }}
        </p>
        <p class="text-xs text-muted mt-1">
          {{ formatCloud(stats.avgTotal) }}
        </p>
      </StatCard>
    </div>
  </div>
</template>
