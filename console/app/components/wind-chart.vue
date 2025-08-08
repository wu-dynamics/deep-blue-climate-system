<script setup lang="ts">
import { format } from 'date-fns';

interface WindDataPoint {
  date: Date
  speed: number
  direction: number
}

withDefaults(defineProps<{
  data: WindDataPoint[]
  averageSpeed: number
  averageDirection: number
  directionText?: string
}>(), {
  directionText: '平均风向',
});

function formatDate(date: Date) {
  return format(date, 'HH:mm');
}

function formatSpeed(speed: number) {
  return `${speed.toFixed(1)} km/h`;
}

function formatDirection(direction: number) {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const index = Math.round(direction / 45) % 8;
  return directions[index];
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
}

function createWindArrow(direction: number, speed: number, maxSpeed: number) {
  const centerX = 120;
  const centerY = 60;
  const maxRadius = 40;
  const radius = (speed / maxSpeed) * maxRadius;

  const tip = polarToCartesian(centerX, centerY, radius, direction);
  const leftWing = polarToCartesian(centerX, centerY, radius * 0.7, direction - 20);
  const rightWing = polarToCartesian(centerX, centerY, radius * 0.7, direction + 20);

  return {
    line: `M ${centerX} ${centerY} L ${tip.x} ${tip.y}`,
    arrow: `M ${tip.x} ${tip.y} L ${leftWing.x} ${leftWing.y} M ${tip.x} ${tip.y} L ${rightWing.x} ${rightWing.y}`,
  };
}
</script>

<template>
  <UCard :ui="{ body: 'h-80 p-0 sm:p-0 m-4 mb-0' }">
    <template #header>
      <div class="flex justify-between">
        <div>
          <p class="text-sm text-muted mb-1.5">
            平均风速
          </p>
          <p class="text-3xl text-highlighted font-semibold">
            {{ formatSpeed(averageSpeed) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-muted mb-1.5">
            {{ directionText }}
          </p>
          <p class="text-3xl text-highlighted font-semibold">
            {{ formatDirection(averageDirection) }}
          </p>
        </div>
      </div>
    </template>

    <div class="relative w-full h-full flex">
      <!-- 风向罗盘 -->
      <div class="w-2/3 flex items-center justify-center">
        <svg viewBox="50 50 140 20" class="w-full h-full scale-67">
          <!-- 罗盘圆环 -->
          <circle
            cx="120"
            cy="60"
            r="45"
            fill="none"
            stroke="var(--ui-border)"
            stroke-width="1"
            opacity="0.3"
          />
          <circle
            cx="120"
            cy="60"
            r="30"
            fill="none"
            stroke="var(--ui-border)"
            stroke-width="1"
            opacity="0.2"
          />
          <circle
            cx="120"
            cy="60"
            r="15"
            fill="none"
            stroke="var(--ui-border)"
            stroke-width="1"
            opacity="0.1"
          />

          <!-- 方向标记 -->
          <text x="120" y="25" text-anchor="middle" class="text-xs fill-current text-muted font-mono">N</text>
          <text x="160" y="65" text-anchor="middle" class="text-xs fill-current text-muted font-mono">E</text>
          <text x="120" y="103" text-anchor="middle" class="text-xs fill-current text-muted font-mono">S</text>
          <text x="80" y="65" text-anchor="middle" class="text-xs fill-current text-muted font-mono">W</text>

          <!-- 平均风向箭头 -->
          <g v-if="data.length > 0" opacity="0.8">
            <path
              :d="createWindArrow(averageDirection, averageSpeed, Math.max(...data.map(d => d.speed))).line"
              stroke="#3B82F6"
              stroke-width="3"
              fill="none"
            />
            <path
              :d="createWindArrow(averageDirection, averageSpeed, Math.max(...data.map(d => d.speed))).arrow"
              stroke="#3B82F6"
              stroke-width="2"
              fill="none"
            />
          </g>
        </svg>
      </div>

      <!-- 风速时间图 -->
      <div class="w-1/3 p-4">
        <div class="h-full overflow-y-auto">
          <div v-for="(point, index) in data.slice(-8)" :key="index" class="mb-2 text-xs">
            <div class="flex justify-between items-center">
              <span class="text-muted" v-text="formatDate(point.date)" />
              <div class="flex items-center gap-2">
                <span class="text-highlighted" v-text="formatSpeed(point.speed)" />
                <div
                  class="w-3 h-3 rounded-full bg-blue-500"
                  :style="{ opacity: point.speed / Math.max(...data.map(d => d.speed)) }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
