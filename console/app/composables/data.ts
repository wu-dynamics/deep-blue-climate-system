interface WeatherData {
  hourly: {
    time: string[]
    temperature_2m: number[]
    cloud_cover: number[]
    pressure_msl: number[]
    surface_pressure: number[]
    wind_speed_10m: number[]
    wind_direction_10m: number[]
    shortwave_radiation: number[]
    cloud_cover_low: number[]
    cloud_cover_mid: number[]
    cloud_cover_high: number[]
    precipitation: number[]
    rain: number[]
    showers: number[]
    snowfall: number[]
  }
  daily?: {
    time: string[]
    sunrise: string[]
    sunset: string[]
  }
}

interface MarineData {
  hourly: {
    time: string[]
    sea_surface_temperature: number[]
    ocean_current_velocity: number[]
    ocean_current_direction: number[]
  }
}

interface AirQualityData {
  hourly: {
    time: string[]
    carbon_dioxide: number[]
    ozone: number[]
  }
}

interface MeteoData {
  weather: WeatherData | null
  marine: MarineData | null
  airQuality: AirQualityData | null
  coords: { latitude: number, longitude: number } | null
}

// 全局状态
const status = ref<'pending' | 'fetched'>('pending');
const data = ref<MeteoData>({
  weather: null,
  marine: null,
  airQuality: null,
  coords: null,
});

// 获取所有气象数据
async function fetchAllWeatherData(latitude: number, longitude: number) {
  const [weather, marine, airQuality] = await Promise.all([
    // 基础天气数据
    $fetch<WeatherData>('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        hourly: [
          'temperature_2m',
          'cloud_cover',
          'pressure_msl',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'shortwave_radiation',
          'cloud_cover_low',
          'cloud_cover_mid',
          'cloud_cover_high',
          'precipitation',
          'rain',
          'showers',
          'snowfall',
        ].join(','),
        daily: 'sunrise,sunset',
        past_hours: 24,
        forecast_hours: 0,
        timezone: TIMEZONE,
      },
    }),

    // 海洋数据
    $fetch<MarineData>('https://marine-api.open-meteo.com/v1/marine', {
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        hourly: [
          'sea_surface_temperature',
          'ocean_current_velocity',
          'ocean_current_direction',
        ].join(','),
        past_days: '1',
        timezone: TIMEZONE,
      },
    }),

    // 空气质量数据
    $fetch<AirQualityData>('https://air-quality-api.open-meteo.com/v1/air-quality', {
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        hourly: ['carbon_dioxide', 'ozone'].join(','),
        past_days: '1',
        timezone: TIMEZONE,
      },
    }),
  ]);

  data.value = {
    weather,
    marine,
    airQuality,
    coords: { latitude, longitude },
  };
  status.value = 'fetched';
}

export function useMeteo() {
  async function init() {
    if (status.value === 'fetched')
      return;
    status.value = 'pending';
    const { coords } = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    await fetchAllWeatherData(coords.latitude, coords.longitude);
    status.value = 'fetched';
  }

  return { status, data, init };
}
