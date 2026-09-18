import type { QWeatherClient } from '../../client';
import type { Location } from '../../types/common';

export interface GetIndicesParams {
  location: Location;
  /** 指数类型,逗号分隔,例如 "1,2,3" */
  type: string;
  lang?: string;
}

/** 生活指数(stub) */
export async function getIndices(
  _client: QWeatherClient,
  _params: GetIndicesParams,
): Promise<unknown> {
  throw new Error('[qweather] indices API not implemented yet — coming in v0.2');
}

export function createIndicesAPI(client: QWeatherClient) {
  return {
    list: (params: GetIndicesParams) => getIndices(client, params),
  };
}
