import { readFile } from 'node:fs/promises';

const EXPECTED_MAJOR = '24';

async function read(path) {
  return (await readFile(new URL(`../${path}`, import.meta.url), 'utf8')).trim();
}

const pkg = JSON.parse(await read('package.json'));
const nvmrc = await read('.nvmrc');
const ci = await read('.github/workflows/ci.yml');

const failures = [];

if (pkg.engines?.node !== `${EXPECTED_MAJOR}.x`) {
  failures.push(`package.json engines.node: expected ${EXPECTED_MAJOR}.x, got ${pkg.engines?.node ?? 'missing'}`);
}

if (nvmrc !== EXPECTED_MAJOR) {
  failures.push(`.nvmrc: expected ${EXPECTED_MAJOR}, got ${nvmrc || 'missing'}`);
}

const ciVersion = ci.match(/node-version:\s*['\"]?([0-9]+)/)?.[1];
if (ciVersion !== EXPECTED_MAJOR) {
  failures.push(`GitHub Actions node-version: expected ${EXPECTED_MAJOR}, got ${ciVersion ?? 'missing'}`);
}

if (failures.length) {
  console.error('Runtime Version Consistency Gate: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Runtime Version Consistency Gate: PASS (Node ${EXPECTED_MAJOR})`);
