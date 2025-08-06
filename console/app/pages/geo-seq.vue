<script setup lang="ts">
definePageMeta({
  panel: {
    title: '海洋地质碳封存',
    icon: 'lucide:archive',
  },
});

const { data, stats, pressureRange, x, yPressureMsl, ySurfacePressure, yPressureDiff, yPressureStack, formatPressure, formatVariance, xTicks, templatePressureMsl, templateSurfacePressure, templatePressureDiff, templatePressureStack, ...k } = useGeoSeqData();
await k.init();

const pressureStatus = computed(() => {
  const pressure = stats.value.avgPressureMsl;
  if (pressure < 1013)
    return { status: '低压', color: 'text-blue-500', icon: 'lucide:trending-down' };
  if (pressure > 1020)
    return { status: '高压', color: 'text-red-500', icon: 'lucide:trending-up' };
  return { status: '正常', color: 'text-blue-500', icon: 'lucide:minus' };
});
</script>

<template>
  <div v-if="data.length === 0" class="flex items-center justify-center h-64 text-muted-foreground">
    <UIcon name="lucide:archive" class="h-8 w-8" />
    <span class="ml-2">暂无地质数据</span>
  </div>

  <div v-else class="grid grid-cols-3 gap-4">
    <StackedChart
      title="气压组合分析"
      :value="`地面 ${formatPressure(stats.avgSurfacePressure)}<br>海面 ${formatPressure(stats.avgPressureMsl)}`"
      :data
      :x
      :y="yPressureStack"
      :colors="['var(--ui-primary)', 'var(--ui-secondary)']"
      :x-tick-format="xTicks"
      :y-tick-format="(d: number) => `${d} hPa`"
      :template="templatePressureStack"
      :stacked-keys="['地面气压', '海面气压']"
    />

    <div class="col-span-2 grid grid-cols-2 gap-4">
      <StatCard title="气压状态" :icon="pressureStatus.icon" center>
        <p class="text-2xl font-bold" :class="pressureStatus.color" v-text="pressureStatus.status" />
        <p class="text-xs text-muted mt-1" v-text="formatPressure(stats.avgPressureMsl)" />
      </StatCard>

      <StatCard title="气压波动" icon="lucide:activity" center>
        <p class="text-2xl font-bold text-blue-500" v-text="formatVariance(stats.pressureVariance)" />
        <p class="text-xs text-muted mt-1">
          标准差
        </p>
      </StatCard>

      <StatCard title="海拔修正" icon="lucide:mountain" center>
        <p class="text-2xl font-bold text-blue-500" v-text="formatPressure(stats.avgPressureDiff)" />
        <p class="text-xs text-muted mt-1">
          平均差值
        </p>
      </StatCard>

      <StatCard title="地面气压" icon="lucide:gauge" center>
        <p class="text-2xl font-bold text-blue-500" v-text="formatPressure(stats.avgSurfacePressure)" />
        <p class="text-xs text-muted mt-1">
          当前高度
        </p>
      </StatCard>
    </div>
  </div>
</template>
