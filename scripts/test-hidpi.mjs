import { readFileSync, existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let ts;
try {
  ts = require('typescript');
} catch {
  ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js');
}
const root = resolve(new URL('..', import.meta.url).pathname);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const read = (rel) => readFileSync(join(root, rel), 'utf8');

const capture = read('api/capture.ts');
const render = read('src/lib/render.ts');
const studio = read('src/components/StudioPage.tsx');
const types = read('src/types.ts');

assert(capture.includes('const CAPTURE_SCALE = 2;'), 'Capture scale must be 2');
assert(capture.includes("type: 'webp'"), 'Capture transport must use WebP');
assert(capture.includes('PRIMARY_WEBP_QUALITY = 92'), 'Primary WebP quality mismatch');
assert(capture.includes('FALLBACK_WEBP_QUALITY = 82'), 'Fallback WebP quality mismatch');
assert(capture.includes('MAX_RESPONSE_BYTES = 4_000_000'), 'Vercel response safety limit missing');
assert(capture.includes("'X-Launchset-Capture-Scale': String(CAPTURE_SCALE)"), 'Capture scale response header missing');

assert(render.includes('pixelRatio = 1'), 'renderComposition pixelRatio parameter missing');
assert(render.includes("ctx.imageSmoothingQuality = 'high'"), 'High quality image smoothing missing');
assert(render.includes('ctx.setTransform(safePixelRatio'), 'HiDPI canvas transform missing');

assert(studio.includes('window.devicePixelRatio || 1'), 'Studio preview must read devicePixelRatio');
assert(studio.includes('renderComposition(canvasRef.current, settings, source, undefined, previewPixelRatio)'), 'Studio preview DPR render missing');
assert(studio.includes('renderPresetBlob(hero, settings, source)'), 'Hero export must render a logical output canvas');
assert(!studio.includes('await exportPng(canvasRef.current'), 'Hero export must not export HiDPI preview backing store directly');

assert(types.includes('captureScale?: number;'), 'Source capture scale metadata missing');
assert(types.includes('captureViewportWidth?: number;'), 'Source logical viewport metadata missing');

const expectedPresets = [
  "id: 'hero', name: t.outputs.hero.name, shortName: t.outputs.hero.shortName, width: 1440, height: 900",
  "id: 'og', name: t.outputs.og.name, shortName: t.outputs.og.shortName, width: 1200, height: 630",
  "id: 'productHunt', name: t.outputs.productHunt.name, shortName: t.outputs.productHunt.shortName, width: 1270, height: 760",
  "id: 'square', name: t.outputs.square.name, shortName: t.outputs.square.shortName, width: 1080, height: 1080",
  "id: 'story', name: t.outputs.story.name, shortName: t.outputs.story.shortName, width: 1080, height: 1920",
];
for (const preset of expectedPresets) assert(render.includes(preset), `Output preset changed unexpectedly: ${preset}`);

const sourceFiles = [];
function walk(dir) {
  const { readdirSync, statSync } = require('node:fs');
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
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      isolatedModules: true,
    },
    fileName: file,
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics || []).filter((d) => d.category === ts.DiagnosticCategory.Error);
  if (errors.length) {
    syntaxErrors += errors.length;
    for (const error of errors) console.error(file, ts.flattenDiagnosticMessageText(error.messageText, '\n'));
  }
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
      missingImports += 1;
      console.error(`Missing relative import: ${file} -> ${match[1]}`);
    }
  }
}
assert(missingImports === 0, `Missing relative imports: ${missingImports}`);

console.log(`HiDPI static regression: PASS`);
console.log(`TS/TSX parsed: ${sourceFiles.length}`);
console.log(`Syntax errors: ${syntaxErrors}`);
console.log(`Missing relative imports: ${missingImports}`);
console.log(`Output dimensions: unchanged`);
console.log(`Preview: DPR-aware up to 2x`);
console.log(`Hero export: logical 1440x900 path preserved`);
