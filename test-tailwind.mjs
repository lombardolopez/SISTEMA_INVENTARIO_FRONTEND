// Test script: run PostCSS + Tailwind directly to diagnose the issue
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const base = resolve(__dirname); // = frontend/

const css = readFileSync(resolve(__dirname, 'src/styles.css'), 'utf-8');

console.log('Base dir:', base);
console.log('Input CSS (first 200):', css.slice(0, 200));

const result = await postcss([
  tailwindcss({ base }),
]).process(css, {
  from: resolve(__dirname, 'src/styles.css'),
  to: resolve(__dirname, 'debug-output.css'),
});

const out = result.css;
const hasFlex = out.includes('.flex');
const hasGrid = out.includes('.grid');
const hasHidden = out.includes('.hidden');
const hasUtilitiesLayer = out.includes('@layer utilities');

console.log('\n=== RESULTS ===');
console.log('Output CSS size:', out.length, 'chars');
console.log('Has @layer utilities:', hasUtilitiesLayer);
console.log('Has .flex:', hasFlex);
console.log('Has .grid:', hasGrid);
console.log('Has .hidden:', hasHidden);

writeFileSync(resolve(__dirname, 'debug-output.css'), out);
console.log('\nWrote debug-output.css');

if (!hasFlex) {
  console.log('\nSample of utilities layer:');
  const idx = out.indexOf('@layer utilities');
  console.log(out.slice(idx, idx + 300));
}
