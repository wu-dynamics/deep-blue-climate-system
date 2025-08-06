<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem, NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();

const open = ref(false);
const onSelect = () => open.value = false;

const links = [
  [
    { label: '仪表盘', icon: 'lucide:circle-gauge', to: '/', onSelect },
    { label: '环境状况', icon: 'lucide:earth', to: '/environment', onSelect },
    { label: '海洋地质碳封存', icon: 'lucide:archive', to: '/geo-seq', onSelect },
    { label: '海洋生物固碳', icon: 'lucide:leaf', to: '/bio-capture', onSelect },
    { label: '海洋化学固碳', icon: 'lucide:flask-round', to: '/chem-capture', onSelect },
    { label: '海洋云增亮', icon: 'lucide:cloud', to: '/cloud-brightening', onSelect },
  ],
] satisfies NavigationMenuItem[][];

const groups = computed((): CommandPaletteGroup<CommandPaletteItem>[] => [{
  id: 'goto',
  label: '跳转到',
  items: links.flat(),
}]);
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      class="bg-elevated/25"
      :ui="{ header: 'flex justify-center text-lg font-bold', footer: 'lg:border-t lg:border-default' }"
    >
      <template #header>
        <img src="~/assets/submerged.avif" class="w-9">
        深蓝气候终端
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups />

    <UDashboardPanel v-if="route.meta.panel" :id="route.name?.toString()" :ui="{ body: route.meta.panel.noPadding ? 'p-0 sm:p-0' : '' }">
      <template #header>
        <UDashboardNavbar
          :icon="route.meta.panel.icon"
          :title="route.meta.panel.title"
        >
          <template #right>
            <ULink href="https://www.firstlegoleague.org" target="_blank">
              <img class="h-(--ui-header-height)" src="~/assets/fll.avif" title="FIRST LEGO League">
            </ULink>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <Suspense>
          <template #default>
            <NuxtErrorBoundary>
              <slot />
              <template #error="{ error }">
                {{ console.error(error) }}
                <div class="w-full h-full flex flex-col items-center justify-center gap-3">
                  <UIcon name="lucide:circle-x" class="text-muted-foreground" size="72" />
                  <span class="font-medium text-muted-foreground text-3xl">无法获取地理位置</span>
                </div>
              </template>
            </NuxtErrorBoundary>
          </template>

          <template #fallback>
            <div class="flex items-center justify-center h-64">
              <div class="text-center space-y-4">
                <UIcon name="lucide:loader-2" class="animate-spin h-12 w-12 mx-auto text-primary" />
                <p class="text-lg text-muted-foreground">
                  正在加载数据...
                </p>
              </div>
            </div>
          </template>
        </Suspense>
      </template>
    </UDashboardPanel>

    <slot v-else />
  </UDashboardGroup>
</template>
