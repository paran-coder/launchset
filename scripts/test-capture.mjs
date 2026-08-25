import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(new URL('..', import.meta.url).pathname);
const temp = mkdtempSync(join(tmpdir(), 'launchset-capture-'));
const tsc = process.platform === 'win32' ? 'tsc.cmd' : 'tsc';

try {
  execFileSync(tsc, [
    join(root, 'api/capture.ts'),
    '--strict', '--target', 'ES2022', '--module', 'ESNext', '--moduleResolution', 'Bundler',
    '--lib', 'ES2022,DOM', '--skipLibCheck', '--outDir', temp,
  ], { stdio: 'inherit' });

  const modulePath = join(temp, 'capture.js');
  readFileSync(modulePath, 'utf8');
  const { default: handler } = await import(`${pathToFileURL(modulePath).href}?t=${Date.now()}`);

  process.env.BROWSERLESS_API_TOKEN = 'test-token';
  delete process.env.BROWSERLESS_API_URL;

  const originalFetch = globalThis.fetch;
  const webp = new Uint8Array([82, 73, 70, 70, 12, 0, 0, 0, 87, 69, 66, 80]);
  const huge = new Uint8Array(4_000_001);

  const request = (ip, body = { url: 'https://example.com', viewport: 'desktop' }) => new Request('https://launchset.test/api/capture', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });

  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const bodyJson = async (response) => response.json();

  const run = async (name, mockFactory, check, ip, body) => {
    const calls = [];
    globalThis.fetch = async (url, init) => {
      calls.push({ url: String(url), init });
      const mock = typeof mockFactory === 'function' ? mockFactory(calls.length, url, init) : mockFactory;
      if (mock instanceof Error) throw mock;
      return mock;
    };
    const response = await handler.fetch(request(ip, body));
    await check(response, calls);
    console.log(`PASS ${name}`);
  };

  await run('200 WebP desktop 2x', new Response(webp, {
    status: 200,
    headers: { 'content-type': 'image/webp', 'x-response-code': '200' },
  }), async (response, calls) => {
    assert(response.status === 200, `status ${response.status}`);
    assert(calls.length === 1, 'single request expected');
    assert(calls[0].url.includes('/screenshot?') && !calls[0].url.includes('/function'), 'Browserless /screenshot endpoint required');
    const payload = JSON.parse(calls[0].init.body);
    assert(payload.viewport.width === 1440 && payload.viewport.height === 900, 'desktop viewport mismatch');
    assert(payload.viewport.deviceScaleFactor === 2, 'desktop capture scale must be 2');
    assert(payload.options.type === 'webp' && payload.options.quality === 92, 'primary WebP quality mismatch');
    assert(response.headers.get('x-launchset-capture-scale') === '2', 'capture scale header missing');
    assert(response.headers.get('x-launchset-capture-viewport-width') === '1440', 'logical width header missing');
    assert(response.headers.get('content-type') === 'image/webp', 'WebP response required');
  }, '198.51.100.1');

  await run('large primary falls back to quality 82', (callNumber) => {
    if (callNumber === 1) return new Response(huge, { status: 200, headers: { 'content-type': 'image/webp', 'x-response-code': '200' } });
    return new Response(webp, { status: 200, headers: { 'content-type': 'image/webp', 'x-response-code': '200' } });
  }, async (response, calls) => {
    assert(response.status === 200, `status ${response.status}`);
    assert(calls.length === 2, `expected 2 Browserless calls, got ${calls.length}`);
    const first = JSON.parse(calls[0].init.body);
    const second = JSON.parse(calls[1].init.body);
    assert(first.options.quality === 92, 'first quality must be 92');
    assert(second.options.quality === 82, 'fallback quality must be 82');
    assert(response.headers.get('x-launchset-capture-quality') === '82', 'fallback quality header missing');
  }, '198.51.100.2');

  await run('oversized fallback rejected', () => new Response(huge, {
    status: 200,
    headers: { 'content-type': 'image/webp', 'x-response-code': '200' },
  }), async (response, calls) => {
    const payload = await bodyJson(response);
    assert(response.status === 413 && payload.code === 'CAPTURE_IMAGE_TOO_LARGE', 'oversized response mapping');
    assert(calls.length === 2, 'oversized case should try fallback once');
  }, '198.51.100.3');

  await run('401 auth', new Response('Invalid token', { status: 401 }), async (response) => {
    assert((await bodyJson(response)).code === 'CAPTURE_AUTH_FAILED', '401 mapping');
  }, '198.51.100.4');

  await run('403 provider destination', new Response('Destination is not allowed', { status: 403 }), async (response) => {
    assert((await bodyJson(response)).code === 'CAPTURE_DESTINATION_BLOCKED', '403 destination mapping');
  }, '198.51.100.5');

  await run('429 provider limit', new Response('Too many', { status: 429 }), async (response) => {
    const payload = await bodyJson(response);
    assert(response.status === 429 && payload.code === 'CAPTURE_PROVIDER_RATE_LIMITED', 'provider 429 mapping');
  }, '198.51.100.6');

  await run('target 403', new Response(webp, { status: 200, headers: { 'content-type': 'image/webp', 'x-response-code': '403' } }), async (response) => {
    assert((await bodyJson(response)).code === 'CAPTURE_TARGET_ACCESS_BLOCKED', 'target 403 mapping');
  }, '198.51.100.7');

  await run('target 404', new Response(webp, { status: 200, headers: { 'content-type': 'image/webp', 'x-response-code': '404' } }), async (response) => {
    assert((await bodyJson(response)).code === 'CAPTURE_TARGET_NOT_FOUND', 'target 404 mapping');
  }, '198.51.100.8');

  await run('target 429', new Response(webp, { status: 200, headers: { 'content-type': 'image/webp', 'x-response-code': '429' } }), async (response) => {
    assert((await bodyJson(response)).code === 'CAPTURE_TARGET_RATE_LIMITED', 'target 429 mapping');
  }, '198.51.100.9');

  await run('target 500', new Response(webp, { status: 200, headers: { 'content-type': 'image/webp', 'x-response-code': '500' } }), async (response) => {
    assert((await bodyJson(response)).code === 'CAPTURE_TARGET_SERVER_ERROR', 'target 500 mapping');
  }, '198.51.100.10');

  await run('provider 500', new Response('internal', { status: 500 }), async (response) => {
    assert((await bodyJson(response)).code === 'CAPTURE_PROVIDER_ERROR', 'provider 500 mapping');
  }, '198.51.100.11');

  await run('invalid content type', new Response('{}', { status: 200, headers: { 'content-type': 'application/json', 'x-response-code': '200' } }), async (response) => {
    assert((await bodyJson(response)).code === 'CAPTURE_INVALID_RESPONSE', 'content-type mapping');
  }, '198.51.100.12');

  await run('timeout', new DOMException('timed out', 'TimeoutError'), async (response) => {
    const payload = await bodyJson(response);
    assert(response.status === 504 && payload.code === 'CAPTURE_TIMEOUT', 'timeout mapping');
  }, '198.51.100.13');

  await run('mobile viewport 2x', new Response(webp, { status: 200, headers: { 'content-type': 'image/webp', 'x-response-code': '200' } }), async (response, calls) => {
    assert(response.status === 200, `status ${response.status}`);
    const payload = JSON.parse(calls[0].init.body);
    assert(payload.viewport.width === 390 && payload.viewport.height === 844, 'mobile viewport mismatch');
    assert(payload.viewport.deviceScaleFactor === 2, 'mobile capture scale must be 2');
    assert(payload.viewport.isMobile === true && payload.viewport.hasTouch === true, 'mobile emulation mismatch');
    assert(response.headers.get('x-launchset-capture-viewport-height') === '844', 'mobile logical height header missing');
  }, '198.51.100.14', { url: 'https://example.com', viewport: 'mobile' });

  globalThis.fetch = async () => { throw new Error('upstream must not be called'); };
  const localResponse = await handler.fetch(request('198.51.100.15', { url: 'http://127.0.0.1:3000', viewport: 'desktop' }));
  assert(localResponse.status === 400, 'private literal URL must be rejected');
  console.log('PASS private literal URL rejected');

  delete process.env.BROWSERLESS_API_TOKEN;
  const missingTokenResponse = await handler.fetch(request('198.51.100.16'));
  const missingTokenPayload = await bodyJson(missingTokenResponse);
  assert(missingTokenResponse.status === 503 && missingTokenPayload.code === 'CAPTURE_NOT_CONFIGURED', 'missing token mapping');
  console.log('PASS missing token');

  globalThis.fetch = originalFetch;
  console.log('Capture API regression: PASS (16 checks)');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
