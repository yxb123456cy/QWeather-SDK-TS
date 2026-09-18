/**
 * QWeather SDK 错误层级
 * 所有错误最终继承自 QWeatherError,便于用户统一捕获
 */
export class QWeatherError extends Error {
  /** 和风业务错误码,例如 "40101" */
  readonly code: string;
  /** HTTP 状态码(若有) */
  readonly status?: number | undefined;
  /** 触发错误的 endpoint 路径 */
  readonly endpoint?: string | undefined;
  /** 链路追踪 ID(若有) */
  readonly requestId?: string | undefined;

  constructor(
    message: string,
    init: {
      code: string;
      status?: number | undefined;
      endpoint?: string | undefined;
      requestId?: string | undefined;
      cause?: unknown;
    },
  ) {
    super(message);
    this.name = new.target.name;
    this.code = init.code;
    if (init.status !== undefined) this.status = init.status;
    if (init.endpoint !== undefined) this.endpoint = init.endpoint;
    if (init.requestId !== undefined) this.requestId = init.requestId;
    if (init.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = init.cause;
    }
  }
}

/** 鉴权失败:key/token 无效、过期、签名错误 */
export class AuthError extends QWeatherError {}

/** 配额耗尽 / 计费限制 */
export class QuotaError extends QWeatherError {}

/** 资源未找到(LocationID 无效等) */
export class NotFoundError extends QWeatherError {}

/** 请求参数错误 */
export class BadRequestError extends QWeatherError {}

/** 服务器内部错误 */
export class ServerError extends QWeatherError {}

/** 网络/超时等其他错误 */
export class NetworkError extends QWeatherError {}

export interface MapApiErrorInput {
  message: string;
  code: string;
  status?: number | undefined;
  endpoint?: string | undefined;
  requestId?: string | undefined;
}

/** 根据和风业务错误码映射到具体子类 */
export function mapApiError(input: MapApiErrorInput): QWeatherError {
  const code = input.code;
  let cls: typeof QWeatherError;
  if (code === '401' || code === '402' || code === '403') cls = AuthError;
  else if (code === '429') cls = QuotaError;
  else if (code === '40401') cls = NotFoundError;
  else if (code.startsWith('4')) cls = BadRequestError;
  else if (code.startsWith('5')) cls = ServerError;
  else cls = QWeatherError;

  return new cls(input.message, {
    code,
    status: input.status,
    endpoint: input.endpoint,
    requestId: input.requestId,
  });
}
