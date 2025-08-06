<script setup lang="ts">
import { zh_cn } from '@nuxt/ui-pro/locale';
</script>

<template>
  <UApp :locale="zh_cn">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
