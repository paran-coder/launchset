declare const process: { env: Record<string, string | undefined> };

type CaptureViewport = 'desktop' | 'mobile';

type CaptureRequest = {
  url?: unknown;
  viewport?: unknown;
};

type CaptureErrorCode =
  | 'CAPTURE_NOT_CONFIGURED'
  | 'CAPTURE_RATE_LIMITED'
  | 'CAPTURE_AUTH_FAILED'
  | 'CAPTURE_PROVIDER_RATE_LIMITED'
  | 'CAPTURE_DESTINATION_BLOCKED'
  | 'CAPTURE_REQUEST_REJECTED'
  | 'CAPTURE_TARGET_ACCESS_BLOCKED'
  | 'CAPTURE_TARGET_NOT_FOUND'
  | 'CAPTURE_TARGET_RATE_LIMITED'
  | 'CAPTURE_TARGET_SERVER_ERROR'
  | 'CAPTURE_PROVIDER_ERROR'
  | 'CAPTURE_INVALID_RESPONSE'
  | 'CAPTURE_IMAGE_TOO_LARGE'
  | 'CAPTURE_TIMEOUT'
  | 'CAPTURE_NETWORK_ERROR';

const VIEWPORTS: Record<CaptureViewport, { width: number; height: number; mobile: boolean; hasTouch: boolean }> = {
  desktop: { width: 1440, height: 900, mobile: false, hasTouch: false },
  mobile: { width: 390, height: 844, mobile: true, hasTouch: true },
};

const CAPTURE_SCALE = 2;
const MAX_RESPONSE_BYTES = 4_000_000;
const MAX_UPSTREAM_BYTES = 16 * 1024 * 1024;
const PRIMARY_WEBP_QUALITY = 92;
const FALLBACK_WEBP_QUALITY = 82;
const UPSTREAM_TIMEOUT_MS = 26_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 6;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function json(body: unknown, status = 200, extraHeaders?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

function captureError(error: string, code: CaptureErrorCode, status: number, extraHeaders?: Record<string, string>) {
  return json({ error, code }, status, extraHeaders);
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
    for (const [bucketKey, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) rateBuckets.delete(bucketKey);
    }
  }
  return { allowed: true, retryAfter: 0 };
}

function browserlessEndpoint(token: string) {
  const rawBaseUrl = (process.env.BROWSERLESS_API_URL || 'https://production-sfo.browserless.io').trim().replace(/\/$/, '');
  const baseUrl = new URL(rawBaseUrl);
  if (baseUrl.protocol !== 'https:' && baseUrl.hostname !== 'localhost') {
    throw new Error('Browserless API URL은 HTTPS여야 합니다.');
  }

  const params = new URLSearchParams({
    token,
    timeout: '24000',
  });

  return `${baseUrl.toString().replace(/\/$/, '')}/screenshot?${params.toString()}`;
}

function browserlessRequestBody(targetUrl: string, viewport: CaptureViewport, quality: number) {
  const spec = VIEWPORTS[viewport];
  return {
    url: targetUrl,
    viewport: {
      width: spec.width,
      height: spec.height,
      deviceScaleFactor: CAPTURE_SCALE,
      isMobile: spec.mobile,
      hasTouch: spec.hasTouch,
    },
    gotoOptions: {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    },
    waitForTimeout: 800,
    bestAttempt: true,
    options: {
      type: 'webp',
      quality,
      fullPage: false,
      captureBeyondViewport: false,
    },
  };
}

async function readUpstreamDetail(upstream: Response) {
  try {
    return (await upstream.text()).slice(0, 1000);
  } catch {
    return '';
  }
}

function mapBrowserlessFailure(status: number, _detail: string) {
  if (status === 401) {
    return captureError('Browserless 인증에 실패했습니다. Vercel의 BROWSERLESS_API_TOKEN을 확인해 주세요.', 'CAPTURE_AUTH_FAILED', 502);
  }
  if (status === 403) {
    return captureError('Browserless가 해당 캡처 대상을 허용하지 않았습니다. 주소 또는 Browserless 계정 정책을 확인해 주세요.', 'CAPTURE_DESTINATION_BLOCKED', 502);
  }
  if (status === 429) {
    return captureError('Browserless 사용량 또는 동시 실행 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.', 'CAPTURE_PROVIDER_RATE_LIMITED', 429);
  }
  if (status === 408) {
    return captureError('원격 브라우저의 페이지 로딩 시간이 초과되었습니다. 다시 시도해 주세요.', 'CAPTURE_TIMEOUT', 504);
  }
  if (status === 400) {
    return captureError('Browserless가 캡처 요청 형식을 거부했습니다. Launchset 캡처 설정을 확인해야 합니다.', 'CAPTURE_REQUEST_REJECTED', 502);
  }
  if (status === 404) {
    return captureError('Browserless Screenshot API 엔드포인트를 찾지 못했습니다. API URL 설정을 확인해 주세요.', 'CAPTURE_PROVIDER_ERROR', 502);
  }
  return captureError('Browserless 캡처 서비스에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', 'CAPTURE_PROVIDER_ERROR', 502);
}

function mapTargetFailure(targetStatus: number) {
  if (targetStatus === 401 || targetStatus === 403) {
    return captureError('대상 웹사이트가 원격 브라우저 접근을 거부했습니다.', 'CAPTURE_TARGET_ACCESS_BLOCKED', 422);
  }
  if (targetStatus === 404) {
    return captureError('대상 웹페이지를 찾지 못했습니다. URL을 확인해 주세요.', 'CAPTURE_TARGET_NOT_FOUND', 422);
  }
  if (targetStatus === 429) {
    return captureError('대상 웹사이트가 캡처 요청을 제한했습니다. 잠시 후 다시 시도해 주세요.', 'CAPTURE_TARGET_RATE_LIMITED', 429);
  }
  if (targetStatus >= 500) {
    return captureError('대상 웹사이트 서버가 오류를 반환했습니다. 잠시 후 다시 시도해 주세요.', 'CAPTURE_TARGET_SERVER_ERROR', 422);
  }
  return null;
}

type ScreenshotResult =
  | { ok: true; buffer: ArrayBuffer; contentType: string; targetStatus: number; quality: number }
  | { ok: false; response: Response };

async function requestScreenshot(
  endpoint: string,
  targetUrl: string,
  viewport: CaptureViewport,
  quality: number,
): Promise<ScreenshotResult> {
  const upstream = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify(browserlessRequestBody(targetUrl, viewport, quality)),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  if (!upstream.ok) {
    const detail = await readUpstreamDetail(upstream);
    return { ok: false, response: mapBrowserlessFailure(upstream.status, detail) };
  }

  const targetStatus = Number(upstream.headers.get('x-response-code') || 0);
  if (Number.isFinite(targetStatus) && targetStatus >= 400) {
    const targetFailure = mapTargetFailure(targetStatus);
    if (targetFailure) return { ok: false, response: targetFailure };
  }

  const contentType = upstream.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('image/')) {
    return {
      ok: false,
      response: captureError(
        '캡처 서비스가 이미지 대신 예상하지 못한 응답을 반환했습니다.',
        'CAPTURE_INVALID_RESPONSE',
        502,
      ),
    };
  }

  const contentLength = Number(upstream.headers.get('content-length') || 0);
  if (contentLength > MAX_UPSTREAM_BYTES) {
    return {
      ok: false,
      response: captureError(
        '캡처 이미지가 지나치게 큽니다. 다른 화면 크기로 다시 시도해 주세요.',
        'CAPTURE_IMAGE_TOO_LARGE',
        413,
      ),
    };
  }

  const buffer = await upstream.arrayBuffer();
  if (buffer.byteLength > MAX_UPSTREAM_BYTES) {
    return {
      ok: false,
      response: captureError(
        '캡처 이미지가 지나치게 큽니다. 다른 화면 크기로 다시 시도해 주세요.',
        'CAPTURE_IMAGE_TOO_LARGE',
        413,
      ),
    };
  }

  return { ok: true, buffer, contentType, targetStatus, quality };
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return json({ error: 'POST 요청만 지원합니다.' }, 405);

    const token = process.env.BROWSERLESS_API_TOKEN?.trim();
    if (!token) {
      return captureError(
        'URL 캡처가 아직 설정되지 않았습니다. Vercel의 BROWSERLESS_API_TOKEN을 확인해 주세요.',
        'CAPTURE_NOT_CONFIGURED',
        503,
      );
    }

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
      return captureError(
        'Launchset의 캡처 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
        'CAPTURE_RATE_LIMITED',
        429,
        { 'Retry-After': String(rateLimit.retryAfter) },
      );
    }

    let endpoint: string;
    try {
      endpoint = browserlessEndpoint(token);
    } catch {
      return captureError('Browserless API URL 설정을 확인해 주세요.', 'CAPTURE_PROVIDER_ERROR', 503);
    }

    try {
      let capture = await requestScreenshot(endpoint, targetUrl, viewport, PRIMARY_WEBP_QUALITY);
      if (!capture.ok) return capture.response;

      if (capture.buffer.byteLength > MAX_RESPONSE_BYTES) {
        capture = await requestScreenshot(endpoint, targetUrl, viewport, FALLBACK_WEBP_QUALITY);
        if (!capture.ok) return capture.response;
      }

      if (capture.buffer.byteLength > MAX_RESPONSE_BYTES) {
        return captureError(
          '고해상도 캡처 결과가 전송 한도를 초과했습니다. 더 단순한 화면 또는 모바일 캡처를 시도해 주세요.',
          'CAPTURE_IMAGE_TOO_LARGE',
          413,
        );
      }

      const spec = VIEWPORTS[viewport];
      return new Response(capture.buffer, {
        status: 200,
        headers: {
          'Content-Type': capture.contentType.toLowerCase().includes('image/webp') ? 'image/webp' : capture.contentType,
          'Content-Length': String(capture.buffer.byteLength),
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
          'X-Launchset-Capture-Viewport': viewport,
          'X-Launchset-Capture-Viewport-Width': String(spec.width),
          'X-Launchset-Capture-Viewport-Height': String(spec.height),
          'X-Launchset-Capture-Scale': String(CAPTURE_SCALE),
          'X-Launchset-Capture-Quality': String(capture.quality),
          'X-Launchset-Capture-Provider': 'browserless-screenshot',
          ...(capture.targetStatus > 0 ? { 'X-Launchset-Target-Status': String(capture.targetStatus) } : {}),
        },
      });
    } catch (error) {
      const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
      return captureError(
        timedOut ? '캡처 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.' : 'Browserless 캡처 서버에 연결하지 못했습니다.',
        timedOut ? 'CAPTURE_TIMEOUT' : 'CAPTURE_NETWORK_ERROR',
        timedOut ? 504 : 502,
      );
    }
  },
};
