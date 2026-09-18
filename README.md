# @qweather/sdk

TypeScript SDK for [QWeather](https://www.qweather.com/) (和风天气) — type-safe, zod-validated, ESM-first.

> ⚠️ 数据归属:使用本 SDK 获取的天气预报数据须遵循[和风天气数据使用条款](https://www.qweather.com/terms)，请在产品中保留来源标注。

## ⚠️ 安全提示

**永远不要把和风 API Key / 签名私钥 / Token 写进任何会被 git 跟踪的文件**(`.ts` / `.json` / `.md` 等)。

正确做法:
- 把 key 放在项目根目录的 `.env` 里(默认已被 `.gitignore` 忽略)
- 或通过 `createClient({ key: process.env.QWEATHER_KEY })` 注入
- 私钥走 CI secret,本地走 `~/.zshrc` / 系统 keychain

如果不小心泄露,**立即到和风控制台撤销该 key**,并清理 git 历史(参考 BFG Repo-Cleaner 或 `git filter-repo`)。

## 安装

```bash
pnpm add @qweather/sdk
# 或
npm install @qweather/sdk
```

## 快速开始

```ts
import { createClient, AuthError, QuotaError } from '@qweather/sdk';

// 通过环境变量 QWEATHER_KEY 注入,或显式传入 key
const client = createClient({ key: process.env.QWEATHER_KEY! });

const now = await client.weather.now({ location: '101010100' }); // 北京 LocationID
console.log(now.now.temp, now.now.text);
```

## 鉴权

支持两种鉴权方式:

1. **API Key**(开发者控制台获取,适合免费用户 / 简单场景):
   ```ts
   const client = createClient({ key: 'your-api-key' });
   ```

2. **Token + 私钥签名鉴权**(订阅用户,ED25519):
   ```ts
   const client = createClient({
     credential: {
       token: 'your-jwt-token',
       privateKey: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----',
     },
   });
   ```

## 错误处理

```ts
import { QWeatherError, AuthError, QuotaError, NotFoundError } from '@qweather/sdk';

try {
  await client.weather.now({ location: 'invalid' });
} catch (err) {
  if (err instanceof AuthError) { /* key/token 无效 */ }
  else if (err instanceof QuotaError) { /* 配额耗尽 */ }
  else if (err instanceof NotFoundError) { /* 城市未找到 */ }
  else if (err instanceof QWeatherError) { /* 其他 API 错误 */ }
  throw err;
}
```

## License

MIT
