import { readFileSync } from 'node:fs';
/**
 * 验证 dist/ 产物类型解析正确性
 * 替代 npm 上失效的 `attw` 占位包
 */
import { checkPackage, createPackageFromTarballData } from '@arethetypeswrong/core';
import { globSync } from 'tinyglobby';

const tarballName = globSync('*.tgz', { cwd: '.' })[0];
if (!tarballName) {
  console.error('❌ 未找到 tarball(请先运行 pnpm pack)');
  process.exit(1);
}

const tarballData = readFileSync(tarballName);
const pkg = await createPackageFromTarballData(tarballData, '*');
const result = await checkPackage(pkg);

const problems = result.problems ?? [];
if (problems.length === 0) {
  console.log('✅ arethetypeswrong: 类型产物配置正确');
  process.exit(0);
}

for (const problem of problems) {
  console.error(`❌ ${problem.kind ?? 'unknown'}: ${problem.message}`);
}
process.exit(1);
