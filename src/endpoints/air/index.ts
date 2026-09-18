import type { QWeatherClient } from '../../client';
import type { Location } from '../../types/common';

export interface GetAirCurrentParams {
  location: Location;
  lang?: string;
}

/** 空气质量实况(stub) */
export async function getAirCurrent(
  _client: QWeatherClient,
  _params: GetAirCurrentParams,
): Promise<unknown> {
  throw new Error('[qweather] air API not implemented yet — coming in v0.2');
}

export function createAirAPI(client: QWeatherClient) {
  return {
    current: (params: GetAirCurrentParams) => getAirCurrent(client, params),
  };
}
