import type { Refer } from './common';

/** 城市信息(GeoAPI 返回) */
export interface LocationItem {
  name: string;
  id: string;
  lat: string;
  lon: string;
  adm2: string;
  adm1: string;
  country: string;
  tz: string;
  utcOffset: string;
  isDst: string;
  type: string;
  rank: string;
  fxLink: string;
}

export interface GeoLookupResponse {
  code: string;
  location: LocationItem[];
  refer: Refer;
}

export interface GeoTopResponse {
  code: string;
  topCityList: Array<{
    name: string;
    id: string;
    lat: string;
    lon: string;
    adm2: string;
    adm1: string;
    country: string;
    tz: string;
    utcOffset: string;
    isDst: string;
    type: string;
    rank: string;
    fxLink: string;
  }>;
  refer: Refer;
}
