import { format } from 'date-fns';

export interface ChemCaptureDataRecord {
  date: Date
  co2: number
  ozone: number
  precipitation: number
  rain: number
  showers: number
  snowfall: number
}

const x = (d: ChemCaptureDataRecord) => d.date.getTime();
const yCO2 = (d: ChemCaptureDataRecord) => d.co2;
const yOzone = (d: ChemCaptureDataRecord) => d.ozone;
const yPrecipitation = (d: ChemCaptureDataRecord) => [d.precipitation, 0];

const formatCO2 = (num: number) => `${num.toFixed(1)} ppm`;
const formatOzone = (num: number) => `${num.toFixed(1)} μg/m³`;
const formatPrecip = (num: number) => `${num.toFixed(1)} mm`;
const formatDate = (date: Date) => format(date, 'HH:mm');

const templateCO2 = (d: ChemCaptureDataRecord) => `${formatDate(d.date)}: ${formatCO2(d.co2)}`;
const templateOzone = (d: ChemCaptureDataRecord) => `${formatDate(d.date)}: ${formatOzone(d.ozone)}`;
const templatePrecip = (d: ChemCaptureDataRecord) => `${formatDate(d.date)}: 雨 ${formatPrecip(d.rain)} + ${formatPrecip(d.showers)}, 雪 ${formatPrecip(d.snowfall)}`;

export function useChemCaptureData() {
  const { data: meteoData, init } = useMeteo();

  const loading = computed(() => !meteoData.value.airQuality && !meteoData.value.weather);
  const error = ref<string | null>(null);

  const data = computed(() => {
    if (!meteoData.value.airQuality?.hourly || !meteoData.value.weather?.hourly)
      return [];

    const timeArray = meteoData.value.airQuality.hourly.time;
    const now = new Date();

    return timeArray.map((timeStr: string, index: number) => {
      return {
        date: new Date(timeStr),
        co2: meteoData.value.airQuality!.hourly.carbon_dioxide?.[index] || 0,
        ozone: meteoData.value.airQuality!.hourly.ozone?.[index] || 0,
        precipitation: meteoData.value.weather!.hourly.precipitation?.[index] || 0,
        rain: meteoData.value.weather!.hourly.rain?.[index] || 0,
        showers: meteoData.value.weather!.hourly.showers?.[index] || 0,
        snowfall: meteoData.value.weather!.hourly.snowfall?.[index] || 0,
      } as ChemCaptureDataRecord;
    }).filter((record: ChemCaptureDataRecord) => {
      // 只保留过去和现在的数据，过滤掉未来的数据
      return record.date <= now;
    });
  });

  // 使用 VueUse 的 useAverage 计算平均值
  const averageCO2 = useAverage(() => data.value.map((d: ChemCaptureDataRecord) => d.co2));
  const averageOzone = useAverage(() => data.value.map((d: ChemCaptureDataRecord) => d.ozone));

  const totalPrecipitation = computed(() => {
    return data.value.reduce((acc, { precipitation }) => acc + precipitation, 0);
  });

  const xTicks = (i: number) => data.value[i] ? formatDate(data.value[i].date) : '';

  return {
    data,
    averageCO2,
    averageOzone,
    totalPrecipitation,
    loading,
    error,
    init,
    x,
    yCO2,
    yOzone,
    yPrecipitation,
    formatCO2,
    formatOzone,
    formatPrecip,
    formatDate,
    templateCO2,
    templateOzone,
    templatePrecip,
    xTicks,
  };
}
