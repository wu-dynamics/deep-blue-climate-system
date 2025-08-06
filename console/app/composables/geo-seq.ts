import { format } from 'date-fns';

export interface GeoSeqDataRecord {
  date: Date
  pressureMsl: number
  surfacePressure: number
  pressureDiff: number
}

const x = (d: GeoSeqDataRecord) => d.date.getTime();
const yPressureStack = (d: GeoSeqDataRecord) => [d.surfacePressure, d.pressureMsl];
const yPressureMsl = (d: GeoSeqDataRecord) => d.pressureMsl;
const ySurfacePressure = (d: GeoSeqDataRecord) => d.surfacePressure;
const yPressureDiff = (d: GeoSeqDataRecord) => d.pressureDiff;

const formatPressure = (num: number) => `${num.toFixed(1)} hPa`;
const formatVariance = (num: number) => `${num.toFixed(2)} hPa`;
const formatDate = (date: Date) => format(date, 'HH:mm');

const templatePressureStack = (d: GeoSeqDataRecord) => `${formatDate(d.date)}: 海面气压 ${formatPressure(d.pressureMsl)}, 地面气压 ${formatPressure(d.surfacePressure)}`;
const templatePressureMsl = (d: GeoSeqDataRecord) => `${formatDate(d.date)}: ${formatPressure(d.pressureMsl)}`;
const templateSurfacePressure = (d: GeoSeqDataRecord) => `${formatDate(d.date)}: ${formatPressure(d.surfacePressure)}`;
const templatePressureDiff = (d: GeoSeqDataRecord) => `${formatDate(d.date)}: ${formatPressure(d.pressureDiff)}`;

export function useGeoSeqData() {
  const { data: meteoData, init } = useMeteo();

  const loading = computed(() => !meteoData.value.weather);
  const error = ref<unknown>();

  const data = computed(() => {
    if (!meteoData.value.weather?.hourly)
      return [];

    const now = new Date();
    const hourly = meteoData.value.weather.hourly;

    return hourly.time.map((timeStr: string, index: number) => {
      return {
        date: new Date(timeStr),
        pressureMsl: hourly.pressure_msl?.[index] || 0,
        surfacePressure: hourly.surface_pressure?.[index] || 0,
        pressureDiff: (hourly.pressure_msl?.[index] || 0) - (hourly.surface_pressure?.[index] || 0),
      } as GeoSeqDataRecord;
    }).filter((record: GeoSeqDataRecord) => {
      // 只保留过去和现在的数据，且气压值有效
      return record.date <= now && record.pressureMsl > 0 && record.surfacePressure > 0;
    });
  });

  // 使用 VueUse 的 useAverage 计算平均值
  const averagePressureMsl = useAverage(() => data.value.map((d: GeoSeqDataRecord) => d.pressureMsl));
  const averageSurfacePressure = useAverage(() => data.value.map((d: GeoSeqDataRecord) => d.surfacePressure));
  const averagePressureDiff = useAverage(() => data.value.map((d: GeoSeqDataRecord) => d.pressureDiff));

  // 气压范围计算
  const pressureRange = computed(() => {
    if (!data.value.length)
      return { min: 980, max: 1040 };

    const pressures = [...data.value.map((d: GeoSeqDataRecord) => d.pressureMsl), ...data.value.map((d: GeoSeqDataRecord) => d.surfacePressure)];
    const min = Math.min(...pressures);
    const max = Math.max(...pressures);
    const padding = (max - min) * 0.1; // 10% padding

    return {
      min: Math.max(950, min - padding), // 不低于 950 hPa
      max: Math.min(1080, max + padding), // 不高于 1080 hPa
    };
  });

  // 统计数据
  const stats = computed(() => {
    const pressureDiffs = data.value.map((d: GeoSeqDataRecord) => d.pressureDiff);
    const maxPressureDiff = data.value.length ? Math.max(...pressureDiffs) : 0;
    const minPressureDiff = data.value.length ? Math.min(...pressureDiffs) : 0;

    // 计算气压差方差（用于评估稳定性）
    const variance = data.value.length
      ? pressureDiffs.reduce((sum: number, diff: number) => {
        return sum + (diff - averagePressureDiff.value) ** 2;
      }, 0) / pressureDiffs.length
      : 0;

    return {
      avgPressureMsl: averagePressureMsl.value,
      avgSurfacePressure: averageSurfacePressure.value,
      avgPressureDiff: averagePressureDiff.value,
      maxPressureDiff,
      minPressureDiff,
      pressureVariance: Math.sqrt(variance), // 标准差
    };
  });

  const xTicks = (i: number) => data.value[i] ? formatDate(data.value[i].date) : '';

  return {
    data,
    stats,
    pressureRange,
    loading,
    error,
    init,
    x,
    yPressureStack,
    yPressureMsl,
    ySurfacePressure,
    yPressureDiff,
    formatPressure,
    formatVariance,
    xTicks,
    templatePressureStack,
    templatePressureMsl,
    templateSurfacePressure,
    templatePressureDiff,
  };
}
