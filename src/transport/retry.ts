/** 指数退避 + 抖动,最大 30s */
export function defaultBackoff(attempt: number): number {
  return Math.min(30_000, 500 * 2 ** attempt) + Math.random() * 200;
}

/** 哪些状态码值得重试 */
export function isRetryableStatus(status: number | undefined): boolean {
  if (!status) return true;
  return status === 408 || status === 429 || (status >= 500 && status < 600);
}
