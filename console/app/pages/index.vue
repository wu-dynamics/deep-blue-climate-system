<script setup lang="ts">
definePageMeta({
  panel: {
    title: '仪表盘',
    icon: 'lucide:circle-gauge',
    noPadding: true,
  },
});

const now = useNow();
const geo = useGeolocation();
const pos = computed(() => ({
  latitude: geo.coords.value.accuracy && geo.coords.value.latitude.toFixed(3),
  longitude: geo.coords.value.accuracy && geo.coords.value.longitude.toFixed(3),
}));
</script>

<template>
  <InspiraBlackHoleBackground class="w-full h-full flex flex-col items-center justify-center gap-3">
    <div class="flex items-center">
      <img src="~/assets/submerged.avif" class="w-20">
      <UIcon name="lucide:x" size="42" />
      <img src="~/assets/wu-dynamics.avif" class="w-20">
    </div>
    <p class="text-3xl font-bold">
      深蓝气候终端
    </p>

    <p class="text-center text-lg" v-text="now.toLocaleString()" />

    <p class="flex items-center text-center text-lg">
      <span class="mr-2">纬度</span>
      <span v-if="pos.latitude" class="font-mono" v-text="pos.latitude" />
      <UIcon v-else name="lucide:loader-2" class="animate-spin" />

      <span class="mx-2">经度</span>
      <span v-if="pos.longitude" class="font-mono" v-text="pos.longitude" />
      <UIcon v-else name="lucide:loader-2" class="animate-spin" />
    </p>
  </InspiraBlackHoleBackground>
</template>
