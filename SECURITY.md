# Security Policy

## 🔑 密钥管理

**严禁**把任何敏感凭据(API Key / Token / 私钥 / 数据库密码等)写进任何会被 git 跟踪的文件。

本项目使用多层防护:

| 层 | 工具 | 触发时机 |
|---|---|---|
| 本地 pre-commit | [secretlint](https://github.com/secretlint/secretlint) | `git commit` 时 |
| 本地 pre-commit | lefthook 钩子 | `git commit` / `git push` 时 |
| 远程 CI | [gitleaks](https://github.com/gitleaks/gitleaks) | push / PR |
| `.gitignore` | `.env` / `*.pem` / `*.key` / `secrets/` | 全局 |

## 🚨 如果泄露了和风 API Key

1. **立刻到和风控制台撤销该 key**:<https://console.qweather.com/>
2. 重新生成新 key
3. 在所有受影响的环境(本地 `.env`、CI secret、服务器环境变量)替换为新 key
4. 如果曾经推送到 GitHub,使用 [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) 或 `git filter-repo` 清理历史
5. 联系 GitHub Support 处理 fork / cached view

## Reporting a Vulnerability

如发现本 SDK 自身的安全问题,请通过 GitHub Security Advisories 报告,**不要**在公开 issue 里贴 PoC。
