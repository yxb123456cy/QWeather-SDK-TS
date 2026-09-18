import type { QWeatherClient } from '../../client';
import { mapApiError } from '../../errors';
import { WeatherNowResponseSchema } from '../../schemas/weather';
import type { Location, Unit } from '../../types/common';
import type { WeatherNowResponse } from '../../types/weather';

export interface GetWeatherNowParams {
  /** LocationID 或 "lon,lat" */
  location: Location;
  /** 单次覆盖默认语言 */
  lang?: string;
  /** 单次覆盖默认单位 */
  unit?: Unit;
}

/** 实况天气 */
export async function getWeatherNow(
  client: QWeatherClient,
  params: GetWeatherNowParams,
): Promise<WeatherNowResponse> {
  const raw = (await client.request<{ code?: string; [k: string]: unknown }>(
    'weather',
    '/v7/weather/now',
    params as unknown as object,
  )) as { code?: string; [k: string]: unknown };
  // 业务错误码先于 schema 校验抛出
  if (raw.code && raw.code !== '200') {
    throw mapApiError({
      message: 'QWeather API error',
      code: raw.code,
      endpoint: '/v7/weather/now',
    });
  }
  const parsed = WeatherNowResponseSchema.parse(raw);
  return parsed as unknown as WeatherNowResponse;
}
