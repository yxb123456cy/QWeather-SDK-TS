/** 和风天气支持的常用语言代码 */
export type LangCode =
  | 'zh-cn'
  | 'zh-tw'
  | 'en-us'
  | 'en-gb'
  | 'de-de'
  | 'es-es'
  | 'fr-fr'
  | 'it-it'
  | 'ja-jp'
  | 'ko-kr'
  | 'ru-ru'
  | 'th-th'
  | 'id-id';

/** 单位制:m 公制 / i 英制 */
export type Unit = 'm' | 'i';

/** LocationID(城市代码) 或 "lon,lat" 形式的经纬度 */
export type Location = string | number;

/** 和风 API 子域路由 */
export type HostKey = 'weather' | 'geo' | 'air';

/** 引用信息(数据来源/许可) */
export interface Refer {
  sources?: string[];
  license?: string[];
}
