import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createClient } from '../../src';

const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('geo.lookup', () => {
  it('hits geoapi.qweather.com and parses city list', async () => {
    const mock = vi.fn(async (url: string | URL | Request) => {
      const u = String(url);
      expect(u).toContain('geoapi.qweather.com/v2/city/lookup');
      expect(u).toContain('location=beijing');
      return new Response(
        JSON.stringify({
          code: '200',
          location: [
            {
              name: '北京',
              id: '101010100',
              lat: '39.90499',
              lon: '116.40529',
              adm2: '北京',
              adm1: '北京市',
              country: '中国',
              tz: 'Asia/Shanghai',
              utcOffset: '+08:00',
              isDst: '0',
              type: 'city',
              rank: '10',
              fxLink: 'https://www.qweather.com/weather/beijing-101010100.html',
            },
          ],
          refer: { sources: ['qweather.com'], license: ['commercial'] },
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      );
    });
    globalThis.fetch = mock as unknown as typeof globalThis.fetch;

    const client = createClient({ key: 'k' });
    const res = await client.geo.lookup({ location: 'beijing' });
    expect(res.code).toBe('200');
    expect(res.location[0]?.id).toBe('101010100');
  });
});
