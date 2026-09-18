import type { QWeatherClient } from '../../client';
import { DailyForecastResponseSchema } from '../../schemas/weather';
import type { Location, Unit } from '../../types/common';
import type { DailyForecastResponse } from '../../types/weather';

export interface GetWeatherForecastParams {
  location: Location;
  /** 预报天数,支持 3d / 7d / 10d / 15d / 30d(部分套餐受限) */
  duration?: '3d' | '7d' | '10d' | '15d' | '30d';
  lang?: string;
  unit?: Unit;
}

/** 日级别天气预报 */
export async function getWeatherForecast(
  client: QWeatherClient,
  params: GetWeatherForecastParams,
): Promise<DailyForecastResponse> {
  const path = `/v7/weather/${params.duration ?? '7d'}`;
  const raw = await client.request<unknown>('weather', path, params);
  const parsed = DailyForecastResponseSchema.parse(raw);
  return parsed as DailyForecastResponse;
}
