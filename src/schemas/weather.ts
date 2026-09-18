import { z } from 'zod';

const ReferSchema = z
  .object({
    sources: z.array(z.string()).optional(),
    license: z.array(z.string()).optional(),
  })
  .partial();

const WeatherNowBlockSchema = z.object({
  obsTime: z.string(),
  temp: z.string(),
  feelsLike: z.string(),
  icon: z.string(),
  text: z.string(),
  wind360: z.string(),
  windDir: z.string(),
  windScale: z.string(),
  windSpeed: z.string(),
  humidity: z.string(),
  precip: z.string(),
  pressure: z.string(),
  vis: z.string(),
  cloud: z.string().optional(),
  dew: z.string().optional(),
});

export const WeatherNowResponseSchema = z.object({
  code: z.string(),
  updateTime: z.string(),
  now: WeatherNowBlockSchema,
  refer: ReferSchema,
});

export type WeatherNowResponseZ = z.infer<typeof WeatherNowResponseSchema>;

const DailyForecastBlockSchema = z.object({
  fxDate: z.string(),
  sunrise: z.string().optional(),
  sunset: z.string().optional(),
  moonrise: z.string().optional(),
  moonset: z.string().optional(),
  moonPhase: z.string().optional(),
  moonPhaseIcon: z.string().optional(),
  tempMax: z.string(),
  tempMin: z.string(),
  iconDay: z.string(),
  textDay: z.string(),
  iconNight: z.string(),
  textNight: z.string(),
  wind360Day: z.string(),
  windDirDay: z.string(),
  windScaleDay: z.string(),
  windSpeedDay: z.string(),
  wind360Night: z.string(),
  windDirNight: z.string(),
  windScaleNight: z.string(),
  windSpeedNight: z.string(),
  humidity: z.string(),
  precip: z.string(),
  pressure: z.string(),
  vis: z.string(),
  cloud: z.string().optional(),
  uvIndex: z.string().optional(),
});

export const DailyForecastResponseSchema = z.object({
  code: z.string(),
  updateTime: z.string(),
  daily: z.array(DailyForecastBlockSchema),
  refer: ReferSchema,
});

export type DailyForecastResponseZ = z.infer<typeof DailyForecastResponseSchema>;
