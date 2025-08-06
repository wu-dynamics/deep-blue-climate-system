import { format } from 'date-fns';

export interface BioCaptureDataRecord {
  date: Date
  temperature: number
  currentVelocity: number
  currentDirection: number
}

const x = (d: BioCaptureDataRecord) => d.date.getTime();
const yTemp = (d: BioCaptureDataRecord) => d.temperature;

const formatTemp = (num: number) => `${num.toFixed(1)}°C`;
const formatDate = (date: Date) => format(date, 'HH:mm');

const templateTemp = (d: BioCaptureDataRecord) => `${formatDate(d.date)}: ${formatTemp(d.temperature)}`;

export function useBioCaptureData() {
  const { data: meteoData, init } = useMeteo();

  const loading = computed(() => !meteoData.value.marine && !meteoData.value.weather);
  const error = ref<string | null>(null);

  const data = computed(() => {
    if (!meteoData.value.marine?.hourly)
      return [];

    const now = new Date();
    const hourly = meteoData.value.marine.hourly;

    return hourly.time.map((timeStr: string, index: number) => {
      return {
        date: new Date(timeStr),
        temperature: hourly.sea_surface_temperature?.[index] || 0,
        currentVelocity: hourly.ocean_current_velocity?.[index] || 0,
        currentDirection: hourly.ocean_current_direction?.[index] || 0,
      } as BioCaptureDataRecord;
    }).filter((record: BioCaptureDataRecord) => {
      // 只保留过去和现在的数据
      return record.date <= now;
    });
  });

  // 海流数据
  const currentData = computed(() => {
    return data.value.map(d => ({
      date: d.date,
      speed: d.currentVelocity,
      direction: d.currentDirection,
    }));
  });

  // 使用 VueUse 的 useAverage 计算平均值
  const averageTemp = useAverage(() => data.value.map((d: BioCaptureDataRecord) => d.temperature));
  const averageCurrentSpeed = useAverage(() => data.value.map((d: BioCaptureDataRecord) => d.currentVelocity));

  const averageCurrentDirection = computed(() => {
    if (!data.value.length)
      return 0;
    // 计算风向平均值（圆形平均）
    const sins = data.value.reduce((sum: number, d: BioCaptureDataRecord) => sum + Math.sin(d.currentDirection * Math.PI / 180), 0);
    const coss = data.value.reduce((sum: number, d: BioCaptureDataRecord) => sum + Math.cos(d.currentDirection * Math.PI / 180), 0);
    const avgRad = Math.atan2(sins / data.value.length, coss / data.value.length);
    return ((avgRad * 180 / Math.PI) + 360) % 360;
  });

  const xTicks = (i: number) => data.value[i] ? formatDate(data.value[i].date) : '';

  // 检查是否为内陆城市（海洋数据全为 0）
  const isInlandCity = computed(() => {
    if (!data.value.length)
      return true;

    // 检查海面温度、海流速度是否全为 0 或接近 0
    const hasValidTemp = data.value.some(d => d.temperature > 1);
    const hasValidCurrent = data.value.some(d => d.currentVelocity > 0.1);

    return !hasValidTemp && !hasValidCurrent;
  });

  // 日出日落数据
  const sunData = computed(() => {
    if (!meteoData.value.weather?.daily
      || !meteoData.value.weather.daily.sunrise?.[0]
      || !meteoData.value.weather.daily.sunset?.[0]
      || !meteoData.value.weather.daily.time?.[0]) {
      return null;
    }

    return {
      date: new Date(meteoData.value.weather.daily.time[0]),
      sunrise: meteoData.value.weather.daily.sunrise[0],
      sunset: meteoData.value.weather.daily.sunset[0],
    };
  });

  return {
    data,
    currentData,
    sunData,
    averageTemp,
    averageCurrentSpeed,
    averageCurrentDirection,
    isInlandCity,
    loading,
    error,
    init,
    x,
    yTemp,
    formatTemp,
    formatDate,
    templateTemp,
    xTicks,
  };
}
