/** SDK 版本(发布时由 changesets / 脚本注入) */
export const SDK_VERSION = '0.1.0';

/** 默认 User-Agent */
export const USER_AGENT = `@qweather/sdk/${SDK_VERSION} node/${process.version}`;

/** 默认超时(毫秒) */
export const DEFAULT_TIMEOUT = 10_000;

/** 默认重试次数(仅针对 429/5xx/网络错误) */
export const DEFAULT_MAX_RETRIES = 2;
