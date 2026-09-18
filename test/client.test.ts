import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QWeatherError, createClient } from '../src';

const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function mockJsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

describe('QWeatherClient', () => {
  it('throws when no API key is provided', () => {
    vi.stubEnv('QWEATHER_KEY', '');
    expect(() => createClient({})).toThrow(/API key is required/);
    vi.unstubAllEnvs();
  });

  it('reads API key from QWEATHER_KEY env', () => {
    process.env.QWEATHER_KEY = 'env-key';
    const client = createClient({});
    expect(client.version).toBeTruthy();
  });

  it('calls weather/now endpoint and parses response', async () => {
    process.env.QWEATHER_KEY = 'test-key';
    const mock = vi.fn(async (url: string | URL | Request) => {
      const u = String(url);
      expect(u).toContain('api.qweather.com/v7/weather/now');
      expect(u).toContain('key=test-key');
      expect(u).toContain('location=101010100');
      return mockJsonResponse({
        code: '200',
        updateTime: '2026-09-18T10:00+08:00',
        now: {
          obsTime: '2026-09-18T09:50+08:00',
          temp: '25',
          feelsLike: '26',
          icon: '100',
          text: '晴',
          wind360: '180',
          windDir: '南风',
          windScale: '2',
          windSpeed: '8',
          humidity: '50',
          precip: '0.0',
          pressure: '1013',
          vis: '20',
        },
        refer: { sources: ['qweather.com'], license: ['commercial'] },
      });
    });
    globalThis.fetch = mock as unknown as typeof globalThis.fetch;

    const client = createClient({ key: 'test-key' });
    const result = await client.weather.now({ location: '101010100' });
    expect(result.code).toBe('200');
    expect(result.now.temp).toBe('25');
    expect(result.now.text).toBe('晴');
  });

  it('throws QuotaError-like subclass when API returns business error code', async () => {
    process.env.QWEATHER_KEY = 'test-key';
    const mock = vi.fn(async () =>
      mockJsonResponse({
        code: '429',
        message: 'rate limit',
      }),
    );
    globalThis.fetch = mock as unknown as typeof globalThis.fetch;

    const client = createClient({ key: 'test-key', retry: { maxRetries: 0 } });
    await expect(client.weather.now({ location: '101010100' })).rejects.toBeInstanceOf(
      QWeatherError,
    );
  });
});
