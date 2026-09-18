import { createClient } from '../src';

const client = createClient({ key: process.env['QWEATHER_KEY'] ?? 'demo-key' });

const res = await client.geo.lookup({ location: '上海', number: 5 });
for (const city of res.location) {
  console.log(`${city.adm1} ${city.name}  id=${city.id}  (${city.lat}, ${city.lon})`);
}
