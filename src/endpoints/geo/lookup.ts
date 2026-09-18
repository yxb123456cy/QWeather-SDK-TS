import type { QWeatherClient } from '../../client';
import { GeoLookupResponseSchema } from '../../schemas/geo';
import type { GeoLookupResponse } from '../../types/geo';

export interface GeoLookupParams {
  /** 城市名 / 经纬度(支持 "lon,lat" 或 LocationID) */
  location: string | number;
  /** 是否仅返回主城区 */
  adm?: string;
  /** 模糊匹配范围 */
  range?: 'cn' | 'world';
  /** 搜索语言 */
  lang?: string;
  /** 返回数量,默认 10,最大 20 */
  number?: number;
}

/** 城市信息搜索 */
export async function geoLookup(
  client: QWeatherClient,
  params: GeoLookupParams,
): Promise<GeoLookupResponse> {
  const raw = await client.request<unknown>('geo', '/v2/city/lookup', params);
  const parsed = GeoLookupResponseSchema.parse(raw);
  return parsed as GeoLookupResponse;
}
