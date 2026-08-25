import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let ts;
try { ts = require('typescript'); }
catch { ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js'); }

const root = resolve(new URL('..', import.meta.url).pathname);
const read = (rel) => readFileSync(join(root, rel), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const capture = read('api/capture.ts');
const render = read('src/lib/render.ts');
const studio = read('src/components/StudioPage.tsx');
const types = read('src/types.ts');

assert(capture.includes("requestScreenshot(endpoint, targetUrl, viewport, 'png')"), 'PNG-first capture missing');
assert(capture.includes("'webp', PRIMARY_WEBP_QUALITY"), 'WebP 92 fallback missing');
assert(capture.includes("'webp', FALLBACK_WEBP_QUALITY"), 'WebP 82 fallback missing');
assert(capture.includes('const CAPTURE_SCALE = 2;'), '2x capture missing');

assert(render.includes('function drawImageProgressive('), 'progressive downsampling helper missing');
assert(render.includes("stepCtx.imageSmoothingQuality = 'high'"), 'progressive high-quality smoothing missing');
assert(render.includes('while (sw > targetPixelW * 2.15 || sh > targetPixelH * 2.15)'), 'progressive threshold missing');
assert(render.includes("settings.sourceFit === 'focus'"), 'focus crop renderer missing');
assert(render.includes('Math.min(1.65, settings.sourceZoom)'), 'focus zoom clamp missing');

assert(types.includes("export type SourceFitMode = 'contain' | 'focus';"), 'SourceFitMode missing');
assert(types.includes('sourceFit: SourceFitMode;'), 'sourceFit setting missing');
assert(types.includes('sourceZoom: number;'), 'sourceZoom setting missing');

assert(studio.includes("sourceFit: 'contain'"), 'default source fit must be contain');
assert(studio.includes('sourceZoom: 1.35'), 'default focus zoom missing');
assert(studio.includes("(['contain', 'focus'] as const)"), 'focus mode UI missing');
assert(studio.includes('min={115}') && studio.includes('max={160}'), 'focus zoom UI range mismatch');
assert(studio.includes('aria-pressed={settings.sourceFit === mode}'), 'focus accessibility state missing');

for (const expected of [
  "minimal: { background: '#FAFAFA', scale: 0.72",
  "editorial: { background: '#FCD535', scale: 0.69",
  "signal: { background: '#0B0E11', scale: 0.71",
  "depth: { background: '#181A20', scale: 0.70",
]) assert(render.includes(expected), `direction layout preset missing: ${expected}`);

for (const preset of [
  "width: 1440, height: 900",
  "width: 1200, height: 630",
  "width: 1270, height: 760",
  "width: 1080, height: 1080",
  "width: 1080, height: 1920",
]) assert(render.includes(preset), `output dimension changed: ${preset}`);

const sourceFiles = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (['.ts', '.tsx'].includes(extname(full))) sourceFiles.push(full);
  }
}
walk(join(root, 'src'));
walk(join(root, 'api'));

let syntaxErrors = 0;
for (const file of sourceFiles) {
  const code = readFileSync(file, 'utf8');
  const result = ts.transpileModule(code, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, isolatedModules: true },
    fileName: file,
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics || []).filter((d) => d.category === ts.DiagnosticCategory.Error);
  syntaxErrors += errors.length;
  for (const error of errors) console.error(file, ts.flattenDiagnosticMessageText(error.messageText, '\n'));
}
assert(syntaxErrors === 0, `TS/TSX syntax errors: ${syntaxErrors}`);

const importPattern = /from\s+['"](\.[^'"]+)['"]/g;
const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
let missingImports = 0;
for (const file of sourceFiles) {
  const code = readFileSync(file, 'utf8');
  let match;
  while ((match = importPattern.exec(code))) {
    const base = resolve(dirname(file), match[1]);
    if (!extensions.some((suffix) => existsSync(base + suffix))) {
      missingImports++;
      console.error(`Missing relative import: ${file} -> ${match[1]}`);
    }
  }
}
assert(missingImports === 0, `Missing relative imports: ${missingImports}`);

console.log('Sharpness static regression: PASS');
console.log(`TS/TSX parsed: ${sourceFiles.length}`);
console.log(`Syntax errors: ${syntaxErrors}`);
console.log(`Missing relative imports: ${missingImports}`);
console.log('Capture: PNG-first + WebP fallback');
console.log('Renderer: progressive downsampling + focus crop');
console.log('Output dimensions: unchanged');
