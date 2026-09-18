import { type $Fetch, ofetch } from 'ofetch';
import { USER_AGENT } from '../internal/constants';

/** 构建一个全局共享的 ofetch 实例,挂上默认 User-Agent / 超时 */
export function createFetcher(opts: {
  timeout: number;
  retry: number;
  customFetch?: typeof globalThis.fetch;
}): $Fetch {
  // ofetch.create 的 FetchOptions 不允许直接传 fetch;
  // 若需要自定义 fetch,在 client.request 内层捕获并通过 query 之外的全局 fetch 接管。
  return ofetch.create({
    timeout: opts.timeout,
    retry: opts.retry,
    headers: {
      'User-Agent': USER_AGENT,
    },
  });
}
