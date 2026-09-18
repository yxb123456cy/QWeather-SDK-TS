import type { QWeatherClient } from '../../client';
import { geoLookup } from './lookup';
import { geoTop } from './top';

export function createGeoAPI(client: QWeatherClient) {
  return {
    /** 城市搜索 */
    lookup: (params: Parameters<typeof geoLookup>[1]) => geoLookup(client, params),
    /** 热门城市 */
    top: (params: Parameters<typeof geoTop>[1] = {}) => geoTop(client, params),
  };
}
