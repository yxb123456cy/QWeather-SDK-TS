import type { HostKey } from '../types/common';

/** 不同子域对应不同 host(GeoAPI 与 weather 分离) */
const HOST_MAP: Record<HostKey, string> = {
  weather: 'https://api.qweather.com',
  geo: 'https://geoapi.qweather.com',
  air: 'https://api.qweather.com',
};

/** 拼接完整 URL */
export function buildUrl(host: HostKey, path: string): string {
  return `${HOST_MAP[host]}${path}`;
}

/** 把 camelCase 转成和风接口要求的 snake/lower 命名(默认和风接口已是 kebab-like) */
export function toQueryRecord(input: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      out[k] = v.join(',');
    } else if (typeof v === 'boolean') {
      out[k] = v ? 'true' : 'false';
    } else {
      out[k] = String(v);
    }
  }
  return out;
}
