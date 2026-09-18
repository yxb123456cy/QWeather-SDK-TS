import { z } from 'zod';

const LocationItemSchema = z.object({
  name: z.string(),
  id: z.string(),
  lat: z.string(),
  lon: z.string(),
  adm2: z.string(),
  adm1: z.string(),
  country: z.string(),
  tz: z.string(),
  utcOffset: z.string(),
  isDst: z.string(),
  type: z.string(),
  rank: z.string(),
  fxLink: z.string(),
});

const ReferSchema = z
  .object({
    sources: z.array(z.string()).optional(),
    license: z.array(z.string()).optional(),
  })
  .partial();

export const GeoLookupResponseSchema = z.object({
  code: z.string(),
  location: z.array(LocationItemSchema),
  refer: ReferSchema,
});

export const GeoTopResponseSchema = z.object({
  code: z.string(),
  topCityList: z.array(LocationItemSchema),
  refer: ReferSchema,
});

export type GeoLookupResponseZ = z.infer<typeof GeoLookupResponseSchema>;
export type GeoTopResponseZ = z.infer<typeof GeoTopResponseSchema>;
