import type { Refer } from './common';

/** 实况天气核心字段 */
export interface WeatherNowBlock {
  obsTime: string;
  temp: string;
  feelsLike: string;
  icon: string;
  text: string;
  wind360: string;
  windDir: string;
  windScale: string;
  windSpeed: string;
  humidity: string;
  precip: string;
  pressure: string;
  vis: string;
  cloud?: string;
  dew?: string;
}

/** 实况天气响应 */
export interface WeatherNowResponse {
  code: string;
  updateTime: string;
  now: WeatherNowBlock;
  refer: Refer;
}

/** 预报(日) */
export interface DailyForecastBlock {
  fxDate: string;
  sunrise?: string;
  sunset?: string;
  moonrise?: string;
  moonset?: string;
  moonPhase?: string;
  moonPhaseIcon?: string;
  tempMax: string;
  tempMin: string;
  iconDay: string;
  textDay: string;
  iconNight: string;
  textNight: string;
  wind360Day: string;
  windDirDay: string;
  windScaleDay: string;
  windSpeedDay: string;
  wind360Night: string;
  windDirNight: string;
  windScaleNight: string;
  windSpeedNight: string;
  humidity: string;
  precip: string;
  pressure: string;
  vis: string;
  cloud?: string;
  uvIndex?: string;
}

export interface DailyForecastResponse {
  code: string;
  updateTime: string;
  daily: DailyForecastBlock[];
  refer: Refer;
}
