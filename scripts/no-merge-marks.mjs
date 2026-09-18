#!/usr/bin/env node
// 拦截冲突标记入库(<<<<<<< / ======= / >>>>>>>)
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MARKERS = [/^<<<<<<< /m, /^=======$/m, /^>>>>>>> /m];
const files = process.argv.slice(2).filter((f) => /\.(ts|tsx|js|jsx|json|md|ya?ml)$/.test(f));
let failed = false;

for (const f of files) {
  try {
    const text = readFileSync(resolve(f), 'utf8');
    const hits = MARKERS.filter((re) => re.test(text));
    if (hits.length) {
      console.error(`❌ ${f} 含 merge 冲突标记 (${hits.length} 处),请先解决冲突再提交`);
      failed = true;
    }
  } catch {
    // skip
  }
}

process.exit(failed ? 1 : 0);
