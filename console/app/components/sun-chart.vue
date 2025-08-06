<script setup lang="ts">
import { format } from 'date-fns';

defineProps<{
  title: string
  sunrise: string
  sunset: string
  date: Date
}>();

function parseTimeString(timeString: string) {
  const date = new Date(timeString);
  return format(date, 'HH:mm');
}

function calculateArcPosition(timeString: string, isSetTime = false) {
  // 计算在日出到日落时间范围内的位置比例
  let position;

  if (isSetTime) {
    // 日落在右侧 (180 度)
    position = 1.0;
  } else {
    // 日出在左侧 (0 度)
    position = 0.0;
  }

  // 将比例转换为弧度角度 (0 到 180 度)
  const angle = position * 180;
  const radian = (angle * Math.PI) / 180;

  const centerX = 120;
  const centerY = 80;
  const radius = 60;

  return {
    x: centerX + Math.cos(Math.PI - radian) * radius,
    y: centerY - Math.sin(Math.PI - radian) * radius,
    angle,
  };
}
</script>

<template>
  <UCard :ui="{ body: 'h-80 p-0 sm:p-0 m-4 mb-0' }">
    <template #header>
      <p class="text-sm text-muted mb-1.5" v-text="title" />
      <p class="text-sm text-highlighted font-medium">
        {{ format(date, 'yyyy-MM-dd') }}
      </p>
    </template>

    <div class="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 240 120" class="w-full h-full">
        <!-- 虚弧线背景 -->
        <path
          d="M 60 80 A 60 60 0 0 1 180 80"
          fill="none"
          stroke="var(--ui-border)"
          stroke-width="2"
          stroke-dasharray="5,5"
          opacity="0.5"
        />

        <!-- 日出位置 -->
        <g v-if="sunrise">
          <circle
            :cx="calculateArcPosition(sunrise).x"
            :cy="calculateArcPosition(sunrise).y"
            r="6"
            fill="#FbbF24"
            stroke="#F59E0B"
            stroke-width="2"
          />
          <text
            :x="calculateArcPosition(sunrise).x"
            :y="calculateArcPosition(sunrise).y - 15"
            text-anchor="middle"
            class="text-xs fill-current text-highlighted"
          >
            {{ parseTimeString(sunrise) }}
          </text>
          <text
            :x="calculateArcPosition(sunrise).x"
            :y="calculateArcPosition(sunrise).y + 25"
            text-anchor="middle"
            class="text-xs fill-current text-muted"
          >
            日出
          </text>
        </g>

        <!-- 日落位置 -->
        <g v-if="sunset">
          <circle
            :cx="calculateArcPosition(sunset, true).x"
            :cy="calculateArcPosition(sunset, true).y"
            r="6"
            fill="#EF4444"
            stroke="#DC2626"
            stroke-width="2"
          />
          <text
            :x="calculateArcPosition(sunset, true).x"
            :y="calculateArcPosition(sunset, true).y - 15"
            text-anchor="middle"
            class="text-xs fill-current text-highlighted"
          >
            {{ parseTimeString(sunset) }}
          </text>
          <text
            :x="calculateArcPosition(sunset, true).x"
            :y="calculateArcPosition(sunset, true).y + 25"
            text-anchor="middle"
            class="text-xs fill-current text-muted"
          >
            日落
          </text>
        </g>

        <!-- 地平线 -->
        <line
          x1="60"
          y1="80"
          x2="180"
          y2="80"
          stroke="var(--ui-text-dimmed)"
          stroke-width="1"
        />
      </svg>
    </div>
  </UCard>
</template>
