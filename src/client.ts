import { ofetch, type $Fetch } from 'ofetch';
import { signRequest, type Credential } from './auth/sign';
import { QWeatherError, mapApiError, NetworkError } from './errors';
import {
  DEFAULT_MAX_RETRIES,
  DEFAULT_TIMEOUT,
  SDK_VERSION,
  USER_AGENT,
} from './internal/constants';
import { noopLogger, type LoggerFn } from './internal/logger';
import { defaultBackoff, isRetryableStatus } from './transport/retry';
import type { HostKey, LangCode, Unit } from './types/common';
import { buildUrl, toQueryRecord } from './utils/url';
import { createAirAPI } from './endpoints/air';
import { createGeoAPI } from './endpoints/geo';
import { createIndicesAPI } from './endpoints/indices';
import { createWarningAPI } from './endpoints/warning';
import { createWeatherAPI } from './endpoints/weather';

export interface QWeatherClientOptions {
  /** API Key(必填,也可通过 QWEATHER_KEY 环境变量传入) */
  key?: string;
  /** 订阅用户签名鉴权 */
  credential?: { token: string; privateKey: string };
  /** 默认语言,默认 zh-cn */
  lang?: LangCode;
  /** 默认单位制,默认 m 公制 */
  unit?: Unit;
  /** 超时(毫秒),默认 10000 */
  timeout?: number;
  /** 重试策略 */
  retry?: {
    maxRetries?: number;
    backoff?: (attempt: number) => number;
  };
  /** 自定义 fetch(测试/代理):调用时临时替换 globalThis.fetch */
  fetch?: typeof globalThis.fetch;
  /** 自定义 logger */
  logger?: LoggerFn;
}

interface InternalOptions {
  credential: Credential;
  lang: LangCode;
  unit: Unit;
  timeout: number;
  retry: { maxRetries: number; backoff: (n: number) => number };
  logger: LoggerFn;
  customFetch?: typeof globalThis.fetch;
}

/** 主客户端 */
export class QWeatherClient {
  readonly #opts: InternalOptions;
  readonly #fetcher: $Fetch;
  readonly version: string = SDK_VERSION;

  weather: ReturnType<typeof createWeatherAPI>;
  geo: ReturnType<typeof createGeoAPI>;
  air: ReturnType<typeof createAirAPI>;
  warning: ReturnType<typeof createWarningAPI>;
  indices: ReturnType<typeof createIndicesAPI>;

  constructor(opts: QWeatherClientOptions) {
    const key = opts.key ?? process.env['QWEATHER_KEY'];
    if (!key) {
      throw new Error(
        '[qweather] API key is required. Pass `key` option or set QWEATHER_KEY env var.',
      );
    }
    const internal: InternalOptions = {
      credential: opts.credential
        ? { key, token: opts.credential.token, privateKey: opts.credential.privateKey }
        : { key },
      lang: opts.lang ?? 'zh-cn',
      unit: opts.unit ?? 'm',
      timeout: opts.timeout ?? DEFAULT_TIMEOUT,
      retry: {
        maxRetries: opts.retry?.maxRetries ?? DEFAULT_MAX_RETRIES,
        backoff: opts.retry?.backoff ?? defaultBackoff,
      },
      logger: opts.logger ?? noopLogger,
    };
    if (opts.fetch) internal.customFetch = opts.fetch;
    this.#opts = internal;

    this.#fetcher = ofetch.create({
      timeout: this.#opts.timeout,
      retry: 0,
      headers: { 'User-Agent': USER_AGENT },
    });

    this.weather = createWeatherAPI(this);
    this.geo = createGeoAPI(this);
    this.air = createAirAPI(this);
    this.warning = createWarningAPI(this);
    this.indices = createIndicesAPI(this);
  }

  /** 暴露给 endpoint 模块的内部请求方法 */
  async request<T>(
    host: HostKey,
    path: string,
    params: object = {},
  ): Promise<T> {
    const merged: Record<string, string> = toQueryRecord({
      lang: this.#opts.lang,
      unit: this.#opts.unit,
      ...params,
    });
    const signed = await signRequest(path, merged, this.#opts.credential);
    const url = buildUrl(host, path);

    let attempt = 0;
    // biome-ignore lint/correctness/noConstantCondition: retry loop
    while (true) {
      let raw: T;
      try {
        if (this.#opts.customFetch) {
          const qs = new URLSearchParams(signed).toString();
          const fullUrl = `${url}?${qs}`;
          const res = await this.#opts.customFetch(fullUrl);
          if (!res.ok) {
            const text = await res.text();
            const err: { status?: number; message?: string; data?: { code?: string } } = {
              status: res.status,
              message: text || `HTTP ${res.status}`,
            };
            try {
              err.data = JSON.parse(text);
            } catch {
              // ignore
            }
            throw err;
          }
          raw = (await res.json()) as T;
        } else {
          raw = await this.#fetcher<T>(url, {
            method: 'GET',
            query: signed,
          });
        }
        return raw;
      } catch (err) {
        const e = err as {
          status?: number;
          statusCode?: number;
          data?: { code?: string };
          message?: string;
        };
        const status = e.status ?? e.statusCode;
        attempt += 1;

        // 物理 HTTP 错误:按状态码决定是否重试
        if (attempt > this.#opts.retry.maxRetries || !isRetryableStatus(status)) {
          if (status) {
            throw mapApiError({
              message: e.message ?? `HTTP ${status}`,
              code: String(status),
              status,
              endpoint: path,
            });
          }
          throw new NetworkError(e.message ?? 'Network error', {
            code: 'network',
            endpoint: path,
            cause: err,
          });
        }

        const wait = this.#opts.retry.backoff(attempt);
        this.#opts.logger('[qweather] retrying', { path, attempt, wait, status });
        await new Promise((r) => setTimeout(r, wait));
      }
    }
  }
}

/** 顶层工厂函数 */
export function createClient(opts: QWeatherClientOptions): QWeatherClient {
  return new QWeatherClient(opts);
}

/** 让 QWeatherError 也导出(便于用户类型守卫) */
export { QWeatherError };
