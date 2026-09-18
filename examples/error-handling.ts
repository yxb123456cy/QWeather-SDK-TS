import { AuthError, QuotaError, createClient } from '../src';

const client = createClient({ key: process.env['QWEATHER_KEY'] ?? 'demo-key' });

try {
  await client.weather.now({ location: 'invalid-location' });
} catch (err) {
  if (err instanceof AuthError) {
    console.error('鉴权失败,请检查 key 或 token');
  } else if (err instanceof QuotaError) {
    console.error('配额已耗尽,请升级套餐');
  } else {
    console.error('其它错误:',err);
  }
}
