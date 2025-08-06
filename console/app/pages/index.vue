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
  latitude: geo.coords.value.accuracy ? geo.coords.value.latitude.toFixed(3) : '?',
  longitude: geo.coords.value.accuracy ? geo.coords.value.longitude.toFixed(3) : '?',
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
    <p class="text-center text-lg">
      <span class="font-mono text-xl" v-text="now.toLocaleString()" />
      <br>
      纬度
      <span class="font-mono" v-text="pos.latitude" />
      <span class="ml-2">
        经度
      </span>
      <span class="font-mono" v-text="pos.longitude" />
    </p>
  </InspiraBlackHoleBackground>
</template>
