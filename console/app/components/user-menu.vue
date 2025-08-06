<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

defineProps<{
  collapsed?: boolean
}>();

const users = ref([{
  label: '婺动力观测站',
  avatar: {
    icon: 'gravity-ui:antenna-signal',
    text: '婺动力观测站',
  },
}] satisfies DropdownMenuItem[]);
const selected = ref(users.value[0]);

const items = computed<DropdownMenuItem[][]>(() => {
  return [users.value.map((u): DropdownMenuItem => ({
    ...u,
    onSelect: () => selected.value = u,
  })), [{
    label: '创建观测站',
    icon: 'lucide:circle-plus',
  }, {
    label: '管理观测站',
    icon: 'lucide:cog',
  }]];
});
</script>

<template>
  <UDropdownMenu
    :items
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...selected,
        label: collapsed ? undefined : selected?.label,
        trailingIcon: collapsed ? undefined : 'lucide:chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{ trailingIcon: 'text-dimmed' }"
    />
  </UDropdownMenu>
</template>
