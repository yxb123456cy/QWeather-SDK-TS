import type { QWeatherClient } from '../../client';
import type { Location } from '../../types/common';

export interface GetWarningListParams {
  location: Location;
  lang?: string;
}

/** 灾害预警列表(stub) */
export async function getWarningList(
  _client: QWeatherClient,
  _params: GetWarningListParams,
): Promise<unknown> {
  throw new Error('[qweather] warning API not implemented yet — coming in v0.2');
}

export function createWarningAPI(client: QWeatherClient) {
  return {
    list: (params: GetWarningListParams) => getWarningList(client, params),
  };
}
