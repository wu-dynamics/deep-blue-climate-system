import { format } from 'date-fns';

export interface WeatherDataRecord {
  date: Date
  temperature_2m: number
  cloud_cover: number
  pressure_msl: number
  surface_pressure: number
  wind_speed_10m: number
  wind_direction_10m: number
  shortwave_radiation: number
  cloud_cover_low: number
  cloud_cover_mid: number
  cloud_cover_high: number
}

const x = (d: WeatherDataRecord) => d.date.getTime();
const yTemp = (d: WeatherDataRecord) => d.temperature_2m;
const yCloud = (d: WeatherDataRecord) => d.cloud_cover;
const ySolar = (d: WeatherDataRecord) => d.shortwave_radiation;
const yPressure = (d: WeatherDataRecord) => [d.surface_pressure, d.pressure_msl - d.surface_pressure];

const formatTemp = (num: number) => `${num.toFixed(1)}°C`;
const formatCloud = (num: number) => `${num.toFixed(0)}%`;
const formatSolar = (num: number) => `${num.toFixed(0)} W/m²`;
const formatPressure = (num: number) => `${num.toFixed(1)} hPa`;
const formatDate = (date: Date) => format(date, 'HH:mm');

const templateTemp = (d: WeatherDataRecord) => `${formatDate(d.date)}: ${formatTemp(d.temperature_2m)}`;
const templateCloud = (d: WeatherDataRecord) => `${formatDate(d.date)}: ${formatCloud(d.cloud_cover)}`;
const templateSolar = (d: WeatherDataRecord) => `${formatDate(d.date)}: ${formatSolar(d.shortwave_radiation)}`;
const templatePressure = (d: WeatherDataRecord) => `${formatDate(d.date)}: 海平面气压 ${formatPressure(d.pressure_msl)}, 地面气压 ${formatPressure(d.surface_pressure)}`;

export function useEnvironmentData() {
  const { data: meteoData, init } = useMeteo();

  const data = computed(() => {
    if (!meteoData.value.weather?.hourly)
      return [];

    const now = new Date();
    const hourly = meteoData.value.weather.hourly;

    return hourly.time.map((timeStr: string, index: number) => {
      return {
        date: new Date(timeStr),
        temperature_2m: hourly.temperature_2m?.[index] || 0,
        cloud_cover: hourly.cloud_cover?.[index] || 0,
        pressure_msl: hourly.pressure_msl?.[index] || 0,
        surface_pressure: hourly.surface_pressure?.[index] || 0,
        wind_speed_10m: hourly.wind_speed_10m?.[index] || 0,
        wind_direction_10m: hourly.wind_direction_10m?.[index] || 0,
        shortwave_radiation: hourly.shortwave_radiation?.[index] || 0,
        cloud_cover_low: hourly.cloud_cover_low?.[index] || 0,
        cloud_cover_mid: hourly.cloud_cover_mid?.[index] || 0,
        cloud_cover_high: hourly.cloud_cover_high?.[index] || 0,
      } as WeatherDataRecord;
    }).filter((record: WeatherDataRecord) => {
      // 只保留过去和现在的数据
      return record.date <= now && record.temperature_2m !== 0;
    });
  });

  // 使用 VueUse 的 useAverage 计算平均值
  const averageTemp = useAverage(() => data.value.map((d: WeatherDataRecord) => d.temperature_2m));
  const averageCloud = useAverage(() => data.value.map((d: WeatherDataRecord) => d.cloud_cover));
  const averageSolar = useAverage(() => data.value.map((d: WeatherDataRecord) => d.shortwave_radiation));
  const averagePressure = useAverage(() => data.value.map((d: WeatherDataRecord) => d.pressure_msl));
  const averageWindSpeed = useAverage(() => data.value.map((d: WeatherDataRecord) => d.wind_speed_10m));

  const averageWindDirection = computed(() => {
    if (!data.value.length)
      return 0;
    // 计算风向平均值（圆形平均）
    const sins = data.value.reduce((sum: number, d: WeatherDataRecord) => sum + Math.sin(d.wind_direction_10m * Math.PI / 180), 0);
    const coss = data.value.reduce((sum: number, d: WeatherDataRecord) => sum + Math.cos(d.wind_direction_10m * Math.PI / 180), 0);
    const avgRad = Math.atan2(sins / data.value.length, coss / data.value.length);
    return ((avgRad * 180 / Math.PI) + 360) % 360;
  });

  const xTicks = (i: number) => data.value[i] ? formatDate(data.value[i].date) : '';

  // 添加 loading 和 error 处理，但保持与原始架构的兼容性
  const loading = computed(() => !meteoData.value.weather);
  const error = ref<string | null>(null);

  return {
    data,
    averageTemp,
    averageCloud,
    averageSolar,
    averagePressure,
    averageWindSpeed,
    averageWindDirection,
    loading,
    error,
    xTicks,
    init,
    x,
    yTemp,
    yCloud,
    ySolar,
    yPressure,
    formatTemp,
    formatCloud,
    formatSolar,
    formatPressure,
    formatDate,
    templateTemp,
    templateCloud,
    templateSolar,
    templatePressure,
  };
}
