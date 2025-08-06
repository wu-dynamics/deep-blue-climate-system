<script setup lang="ts" generic="T">
import { VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from '@unovis/vue';

const props = defineProps<{
  title: string
  value: string
  data: T[]
  x: (d: T, i: number) => number
  y: (d: T) => number[]
  colors?: string[]
  xTickFormat?: (i: number) => string
  yTickFormat?: (i: number) => string
  template: (d: T) => string
  stackedKeys: string[]
}>();

// For stacked charts, we need to create individual accessor functions for each stack layer
const stackedAccessors = computed(() => {
  return props.stackedKeys.map((_, index) => (d: T) => {
    const values = props.y(d);
    return values[index] || 0;
  });
});
</script>

<template>
  <StatCard :title :value>
    <VisXYContainer :data>
      <VisLine :x :y="stackedAccessors" :color="colors" />
      <VisAxis type="x" :x :tick-format="xTickFormat" />
      <VisAxis type="y" :tick-format="yTickFormat" />
      <VisCrosshair :template />
      <VisTooltip />
    </VisXYContainer>
  </StatCard>
</template>
