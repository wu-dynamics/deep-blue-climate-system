<script setup lang="ts" generic="T">
defineProps<{
  title?: string
  value?: string
  icon?: string
  center?: boolean
}>();
</script>

<template>
  <UCard
    :ui="{
      root: 'flex flex-col',
      body: `flex flex-col flex-1 h-80 p-0 sm:p-0 m-4 mb-0 ${center && 'justify-center items-center mt-0'}`,
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon v-if="icon" :name="icon" size="20" />
        <p v-if="title" class="text-sm" :class="!icon && 'text-muted'" v-html="title" />
      </div>
      <p v-if="value" class="text-3xl text-highlighted font-semibold mt-1.5" v-html="value" />
    </template>
    <slot />
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
