import type { QWeatherClient } from '../../client';
import { getWeatherForecast } from './forecast';
import { getWeatherNow } from './now';

export function createWeatherAPI(client: QWeatherClient) {
  return {
    /** 实况天气 */
    now: (params: Parameters<typeof getWeatherNow>[1]) => getWeatherNow(client, params),
    /** 日级天气预报 */
    forecast: (params: Parameters<typeof getWeatherForecast>[1]) =>
      getWeatherForecast(client, params),
  };
}
