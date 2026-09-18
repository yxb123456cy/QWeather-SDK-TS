import type { QWeatherClient } from '../../client';
import { GeoTopResponseSchema } from '../../schemas/geo';
import type { GeoTopResponse } from '../../types/geo';

export interface GeoTopParams {
  /** 数量,默认 10,最大 20 */
  number?: number;
  lang?: string;
}

/** 热门城市列表 */
export async function geoTop(
  client: QWeatherClient,
  params: GeoTopParams = {},
): Promise<GeoTopResponse> {
  const raw = await client.request<unknown>('geo', '/v2/city/top', params);
  const parsed = GeoTopResponseSchema.parse(raw);
  return parsed as GeoTopResponse;
}
