# Contributing

## 开发流程

```bash
pnpm install           # 安装依赖,自动注册 lefthook 钩子
pnpm dev               # tsc + tsup watch
pnpm test              # vitest
pnpm typecheck         # tsc --noEmit
pnpm lint              # biome check
pnpm lint:fix          # biome --write
pnpm verify            # 全量校验(typecheck + lint + test + build + size + attw + publint)
```

## Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` 新功能
- `fix:` 修复 bug
- `chore:` 杂项(配置、CI 等)
- `docs:` 文档
- `refactor:` 重构
- `test:` 测试
- `perf:` 性能

## 发布流程

1. `pnpm changeset` 写变更说明
2. `pnpm version` 生成 CHANGELOG + 升版本号
3. `pnpm release` 构建 + 发布到 npm

## PR Checklist

- [ ] 通过 `pnpm verify`
- [ ] 新功能附带测试
- [ ] 公共 API 改动附带 changeset
- [ ] 没有把密钥 / 内部信息写进代码
