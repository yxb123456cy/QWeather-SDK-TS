#!/usr/bin/env node
// 拦截超过 500KB 的文件入库(SVG / 字体 / 截图等)
import { statSync } from 'node:fs';
import { resolve } from 'node:path';

const LIMIT_KB = 500;
const files = process.argv.slice(2);
let failed = false;

for (const f of files) {
  if (!f || f.startsWith('-')) continue;
  try {
    const { size } = statSync(resolve(f));
    if (size > LIMIT_KB * 1024) {
      console.error(`❌ ${f} 体积 ${(size / 1024).toFixed(1)}KB 超过 ${LIMIT_KB}KB 上限`);
      failed = true;
    }
  } catch {
    // file may have been deleted; skip
  }
}

process.exit(failed ? 1 : 0);
