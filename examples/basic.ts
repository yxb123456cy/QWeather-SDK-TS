import { createClient } from '../src';

const client = createClient({ key: process.env['QWEATHER_KEY'] ?? 'demo-key' });

const now = await client.weather.now({ location: '101010100' }); // 北京
console.log(`${now.now.text}  ${now.now.temp}°C  体感 ${now.now.feelsLike}°C`);

const forecast = await client.weather.forecast({ location: '101010100', duration: '3d' });
for (const day of forecast.daily) {
  console.log(`${day.fxDate}  ${day.textDay}  ${day.tempMin}°~${day.tempMax}°`);
}
