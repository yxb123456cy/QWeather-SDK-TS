import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  splitting: false,
  treeshake: true,
  outExtension({ format }) {
    // ESM: index.js / index.d.ts
    // CJS: index.cjs / index.d.cts
    return { js: format === 'cjs' ? '.cjs' : '.js', dts: format === 'cjs' ? '.d.cts' : '.d.ts' };
  },
});
