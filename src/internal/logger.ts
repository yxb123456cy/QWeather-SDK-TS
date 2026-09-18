/** 可插拔 logger 接口:默认静默,用户可传入任意日志函数 */
export type LoggerFn = (msg: string, meta?: unknown) => void;

export const noopLogger: LoggerFn = () => {};
