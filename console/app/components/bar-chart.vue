<script setup lang="ts" generic="T">
import { VisAxis, VisCrosshair, VisStackedBar, VisTooltip, VisXYContainer } from '@unovis/vue';

defineProps<{
  title: string
  value: string
  data: T[]
  x: (d: T, i: number) => number
  y: (d: T) => number
  color?: string
  xTickFormat?: (i: number) => string
  yTickFormat?: (i: number) => string
  template: (d: T) => string
}>();
</script>

<template>
  <UCard :ui="{ body: 'h-80 p-0 sm:p-0 m-4 mb-0' }">
    <template #header>
      <p class="text-sm text-muted mb-1.5" v-text="title" />
      <p class="text-3xl text-highlighted font-semibold" v-text="value" />
    </template>
    <VisXYContainer :data>
      <VisStackedBar :x :y :color />
      <VisAxis type="x" :x :tick-format="xTickFormat" />
      <VisAxis type="y" :y :tick-format="yTickFormat" />
      <VisCrosshair :color :template />
      <VisTooltip />
    </VisXYContainer>
  </UCard>
</template>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);

  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
