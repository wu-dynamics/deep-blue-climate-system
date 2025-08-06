import { format } from 'date-fns';

export interface CloudBrighteningDataRecord {
  date: Date
  total: number
  low: number
  mid: number
  high: number
}

const x = (d: CloudBrighteningDataRecord) => d.date.getTime();
const yTotal = (d: CloudBrighteningDataRecord) => d.total;
const yLow = (d: CloudBrighteningDataRecord) => d.low;
const yMid = (d: CloudBrighteningDataRecord) => d.mid;
const yHigh = (d: CloudBrighteningDataRecord) => d.high;
const yStacked = (d: CloudBrighteningDataRecord) => [d.low, d.mid, d.high];

const formatCloud = (num: number) => `${num.toFixed(0)}%`;
const formatVariance = (num: number) => `${num.toFixed(1)}%`;
const formatDate = (date: Date) => format(date, 'HH:mm');

const templateTotal = (d: CloudBrighteningDataRecord) => `${formatDate(d.date)}: ${formatCloud(d.total)}`;
const templateLow = (d: CloudBrighteningDataRecord) => `${formatDate(d.date)}: ${formatCloud(d.low)}`;
const templateMid = (d: CloudBrighteningDataRecord) => `${formatDate(d.date)}: ${formatCloud(d.mid)}`;
const templateHigh = (d: CloudBrighteningDataRecord) => `${formatDate(d.date)}: ${formatCloud(d.high)}`;
const templateStacked = (d: CloudBrighteningDataRecord) => `${formatDate(d.date)}: 低云 ${formatCloud(d.low)}, 中云 ${formatCloud(d.mid)}, 高云 ${formatCloud(d.high)}`;

export function useCloudBrighteningData() {
  const { data: meteoData, init } = useMeteo();

  const loading = computed(() => !meteoData.value.weather);
  const error = ref<string | null>(null);

  const data = computed(() => {
    if (!meteoData.value.weather?.hourly)
      return [];

    const now = new Date();
    const hourly = meteoData.value.weather.hourly;

    return hourly.time.map((timeStr: string, index: number) => {
      return {
        date: new Date(timeStr),
        total: hourly.cloud_cover?.[index] || 0,
        low: hourly.cloud_cover_low?.[index] || 0,
        mid: hourly.cloud_cover_mid?.[index] || 0,
        high: hourly.cloud_cover_high?.[index] || 0,
      } as CloudBrighteningDataRecord;
    }).filter((record: CloudBrighteningDataRecord) => {
      // 只保留过去和现在的数据
      return record.date <= now && record.total >= 0;
    });
  });

  // 使用 VueUse 的 useAverage 计算平均值
  const averageTotal = useAverage(() => data.value.map((d: CloudBrighteningDataRecord) => d.total));
  const averageLow = useAverage(() => data.value.map((d: CloudBrighteningDataRecord) => d.low));
  const averageMid = useAverage(() => data.value.map((d: CloudBrighteningDataRecord) => d.mid));
  const averageHigh = useAverage(() => data.value.map((d: CloudBrighteningDataRecord) => d.high));

  // 统计数据
  const stats = computed(() => {
    return {
      avgTotal: averageTotal.value,
      avgLow: averageLow.value,
      avgMid: averageMid.value,
      avgHigh: averageHigh.value,
      maxTotal: data.value.length ? Math.max(...data.value.map((d: CloudBrighteningDataRecord) => d.total)) : 0,
      minTotal: data.value.length ? Math.min(...data.value.map((d: CloudBrighteningDataRecord) => d.total)) : 0,
      cloudVariance: data.value.length
        ? Math.sqrt(data.value.reduce((sum: number, d: CloudBrighteningDataRecord) => {
            return sum + (d.total - averageTotal.value) ** 2;
          }, 0) / data.value.length)
        : 0,
    };
  });

  // 云量分类状态
  const cloudStatus = computed(() => {
    const total = stats.value.avgTotal;
    if (total < 20)
      return { status: '晴朗', color: 'text-yellow-500', icon: 'lucide:sun' };
    if (total < 50)
      return { status: '少云', color: 'text-blue-400', icon: 'lucide:cloud-sun' };
    if (total < 80)
      return { status: '多云', color: 'text-gray-500', icon: 'lucide:cloud' };
    return { status: '阴天', color: 'text-gray-700', icon: 'lucide:cloud-drizzle' };
  });

  const xTicks = (i: number) => data.value[i] ? formatDate(data.value[i].date) : '';

  return {
    // 数据
    data,
    stats,
    cloudStatus,
    loading,
    error,
    init,

    // 访问器
    x,
    yTotal,
    yLow,
    yMid,
    yHigh,
    yStacked,

    // 格式化函数
    formatCloud,
    formatVariance,
    xTicks,
    templateTotal,
    templateLow,
    templateMid,
    templateHigh,
    templateStacked,
  };
}
