declare const process: { env: Record<string, string | undefined> };

type CaptureViewport = 'desktop' | 'mobile';

type CaptureRequest = {
  url?: unknown;
  viewport?: unknown;
};

const VIEWPORTS: Record<CaptureViewport, { width: number; height: number; mobile: boolean; hasTouch: boolean }> = {
  desktop: { width: 1440, height: 900, mobile: false, hasTouch: false },
  mobile: { width: 390, height: 844, mobile: true, hasTouch: true },
};

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const UPSTREAM_TIMEOUT_MS = 28_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 6;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

const CAPTURE_CODE = `export default async ({ page, context }) => {
  const blockedHost = (rawHostname) => {
    const hostname = rawHostname.toLowerCase().replace(/^\\[|\\]$/g, '').replace(/\\.$/, '');
    if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname.endsWith('.internal') || hostname.endsWith('.lan') || hostname.endsWith('.home')) return true;
    const ipv4 = hostname.match(/^(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})$/);
    if (ipv4) {
      const parts = ipv4.slice(1).map(Number);
      if (parts.some((value) => value < 0 || value > 255)) return true;
      const [a, b] = parts;
      if (a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19)) || a >= 224) return true;
    }
    if (hostname.includes(':')) {
      if (hostname === '::' || hostname === '::1' || hostname.startsWith('fc') || hostname.startsWith('fd') || /^fe[89ab]/.test(hostname) || hostname.startsWith('::ffff:127.') || hostname.startsWith('::ffff:10.') || hostname.startsWith('::ffff:192.168.') || hostname.startsWith('::ffff:169.254.') || /^::ffff:172\\.(1[6-9]|2\\d|3[01])\\./.test(hostname)) return true;
    }
    return false;
  };
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    try {
      const requestUrl = new URL(request.url());
      if ((requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:') && blockedHost(requestUrl.hostname)) return request.abort('blockedbyclient');
      if (!['http:', 'https:', 'data:', 'blob:'].includes(requestUrl.protocol)) return request.abort('blockedbyclient');
    } catch (_) {}
    return request.continue();
  });
  await page.setViewport({
    width: context.width,
    height: context.height,
    deviceScaleFactor: 1,
    isMobile: context.mobile,
    hasTouch: context.hasTouch,
  });
  await page.goto(context.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  try { await page.waitForNetworkIdle({ idleTime: 500, timeout: 6000 }); } catch (_) {}
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}html{scroll-behavior:auto!important}::-webkit-scrollbar{display:none!important}' });
  await page.evaluate(async () => {
    try { if (document.fonts?.ready) await document.fonts.ready; } catch (_) {}
    const pending = Array.from(document.images).filter((image) => !image.complete).map((image) => new Promise((resolve) => {
      const done = () => resolve(undefined);
      image.addEventListener('load', done, { once: true });
      image.addEventListener('error', done, { once: true });
    }));
    if (pending.length) await Promise.race([Promise.all(pending), new Promise((resolve) => setTimeout(resolve, 2500))]);
  });
  await new Promise((resolve) => setTimeout(resolve, 200));
  const image = await page.screenshot({ type: 'png', fullPage: false, captureBeyondViewport: false });
  return { data: image, type: 'image/png' };
};`;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('URL을 입력해 주세요.');
  if (trimmed.length > 4096) throw new Error('URL이 너무 깁니다.');
  const withProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new Error('올바른 URL 형식이 아닙니다.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('HTTP 또는 HTTPS 주소만 캡처할 수 있습니다.');
  if (parsed.username || parsed.password) throw new Error('사용자 정보가 포함된 URL은 캡처할 수 없습니다.');
  if (!parsed.hostname) throw new Error('호스트 이름을 확인해 주세요.');
  assertPublicHostname(parsed.hostname);
  parsed.hash = '';
  return parsed.toString();
}

function assertPublicHostname(rawHostname: string) {
  const hostname = rawHostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.home')
  ) {
    throw new Error('로컬 또는 내부 네트워크 주소는 캡처할 수 없습니다.');
  }

  if (isBlockedIpv4(hostname) || isBlockedIpv6(hostname)) {
    throw new Error('사설 또는 로컬 네트워크 주소는 캡처할 수 없습니다.');
  }
}

function isBlockedIpv4(hostname: string) {
  const match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const octets = match.slice(1).map(Number);
  if (octets.some((value) => value < 0 || value > 255)) return true;
  const [a, b] = octets;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function isBlockedIpv6(hostname: string) {
  if (!hostname.includes(':')) return false;
  const value = hostname.toLowerCase();
  return (
    value === '::' ||
    value === '::1' ||
    value.startsWith('fc') ||
    value.startsWith('fd') ||
    /^fe[89ab]/.test(value) ||
    value.startsWith('::ffff:127.') ||
    value.startsWith('::ffff:10.') ||
    value.startsWith('::ffff:192.168.') ||
    value.startsWith('::ffff:169.254.') ||
    /^::ffff:172\.(1[6-9]|2\d|3[01])\./.test(value)
  );
}

async function readBody(request: Request): Promise<CaptureRequest> {
  try {
    return await request.json() as CaptureRequest;
  } catch {
    throw new Error('요청 본문을 읽을 수 없습니다.');
  }
}

function consumeRateLimit(request: Request) {
  const now = Date.now();
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const key = forwarded || request.headers.get('x-real-ip') || 'unknown';
  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }
  current.count += 1;
  if (rateBuckets.size > 500) {
    for (const [bucketKey, bucket] of rateBuckets) if (bucket.resetAt <= now) rateBuckets.delete(bucketKey);
  }
  return { allowed: true, retryAfter: 0 };
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return json({ error: 'POST 요청만 지원합니다.' }, 405);

    const token = process.env.BROWSERLESS_API_TOKEN;
    if (!token) return json({ error: 'URL 캡처가 아직 설정되지 않았습니다. Vercel 환경변수를 확인해 주세요.', code: 'CAPTURE_NOT_CONFIGURED' }, 503);

    let payload: CaptureRequest;
    let targetUrl: string;
    let viewport: CaptureViewport;
    try {
      payload = await readBody(request);
      if (typeof payload.url !== 'string') throw new Error('URL을 입력해 주세요.');
      targetUrl = normalizeUrl(payload.url);
      viewport = payload.viewport === 'mobile' ? 'mobile' : 'desktop';
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : 'URL을 확인해 주세요.' }, 400);
    }

    const rateLimit = consumeRateLimit(request);
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ error: '캡처 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.', code: 'CAPTURE_RATE_LIMITED' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
          'Retry-After': String(rateLimit.retryAfter),
        },
      });
    }

    const baseUrl = (process.env.BROWSERLESS_API_URL || 'https://production-sfo.browserless.io').replace(/\/$/, '');
    const params = new URLSearchParams({
      token,
      blockAds: 'true',
      blockConsentModals: 'true',
    });
    const endpoint = `${baseUrl}/function?${params.toString()}`;
    const spec = VIEWPORTS[viewport];

    try {
      const upstream = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          code: CAPTURE_CODE,
          context: {
            url: targetUrl,
            width: spec.width,
            height: spec.height,
            mobile: spec.mobile,
            hasTouch: spec.hasTouch,
          },
        }),
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });

      if (!upstream.ok) {
        const detail = (await upstream.text()).slice(0, 500);
        const status = upstream.status === 429 ? 429 : upstream.status === 401 || upstream.status === 403 ? 502 : 502;
        return json({
          error: upstream.status === 429
            ? '캡처 요청이 많습니다. 잠시 후 다시 시도해 주세요.'
            : '웹사이트 캡처에 실패했습니다. 주소 또는 대상 사이트의 접근 제한을 확인해 주세요.',
          code: 'UPSTREAM_CAPTURE_FAILED',
          detail: process.env.NODE_ENV === 'development' ? detail : undefined,
        }, status);
      }

      const contentType = upstream.headers.get('content-type') || '';
      const contentLength = Number(upstream.headers.get('content-length') || 0);
      if (contentLength > MAX_IMAGE_BYTES) return json({ error: '캡처 이미지가 너무 큽니다.' }, 413);
      if (!contentType.includes('image/')) {
        const detail = (await upstream.text()).slice(0, 500);
        return json({ error: '캡처 서비스가 이미지 대신 예상하지 못한 응답을 반환했습니다.', code: 'INVALID_UPSTREAM_RESPONSE', detail: process.env.NODE_ENV === 'development' ? detail : undefined }, 502);
      }

      const buffer = await upstream.arrayBuffer();
      if (buffer.byteLength > MAX_IMAGE_BYTES) return json({ error: '캡처 이미지가 너무 큽니다.' }, 413);

      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': String(buffer.byteLength),
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
          'X-Launchset-Capture-Viewport': viewport,
        },
      });
    } catch (error) {
      const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
      return json({
        error: timedOut ? '캡처 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.' : '캡처 서버에 연결하지 못했습니다.',
        code: timedOut ? 'CAPTURE_TIMEOUT' : 'CAPTURE_NETWORK_ERROR',
      }, timedOut ? 504 : 502);
    }
  },
};
