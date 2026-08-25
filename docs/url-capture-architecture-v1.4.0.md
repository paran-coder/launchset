# Launchset v1.4.0 — URL Capture Architecture

## Goal
사용자가 별도 스크린샷 파일을 준비하지 않아도 제품 URL을 입력해 Desktop 또는 Mobile 화면을 캡처하고, 캡처 결과를 기존 Visual Pack 렌더러의 `SourceImage`로 바로 사용할 수 있게 한다.

## Request Flow

```text
Studio URL input
  → POST /api/capture
  → Vercel Function
  → URL validation / rate protection
  → Browserless /function
  → Puppeteer viewport capture
  → PNG response
  → browser Object URL / HTMLImageElement
  → existing Canvas 2D renderer
  → Hero / OG / Product Hunt / Square / Story
```

## Processing Boundary
- 직접 업로드한 PNG/JPEG/WebP: 브라우저 로컬 처리.
- URL 캡처: Vercel Function + Browserless 원격 브라우저 사용.
- 캡처된 PNG를 받은 뒤의 composition 렌더링과 ZIP 생성: 다시 브라우저 로컬 처리.

## Environment Variables

Required:
```bash
BROWSERLESS_API_TOKEN=...
```

Optional:
```bash
BROWSERLESS_API_URL=https://production-sfo.browserless.io
```

토큰은 서버 전용이다. `VITE_` prefix를 붙이지 않는다. Vite 클라이언트 번들에 토큰을 넣지 않는다.

## Capture Profiles
- Desktop: 1440 × 900
- Mobile: 390 × 844
- deviceScaleFactor: 1
- viewport-only PNG
- animation / transition disabled immediately before capture
- waits for `document.fonts.ready` and pending images with a bounded wait

## Server Guardrails
- POST only.
- HTTP/HTTPS only.
- URL length max 4096.
- URL user/password rejected.
- localhost and common local suffixes rejected.
- literal private/loopback/link-local IPv4 and IPv6 rejected.
- Browserless page request interception blocks obvious private/local literal redirect and subresource destinations.
- upstream timeout: 28 seconds.
- image response limit: 12MB.
- response caching disabled.
- instance-local rate protection: 6 requests/minute/client IP.

## Security Boundary and Known Limitation
현재 차단은 URL 문자열과 원격 브라우저 request URL을 기준으로 한 방어다. DNS rebinding까지 전역적으로 보장하는 완전한 egress policy는 아니다. 공개 SaaS 단계에서는 인증/사용량 quota와 Vercel Firewall 또는 별도 capture worker의 network egress policy를 추가해야 한다.

## Error Mapping
- 400: malformed/unsafe URL.
- 405: method not allowed.
- 413: capture result too large.
- 429: local burst protection or upstream capacity limit.
- 502: capture provider/network/invalid upstream response.
- 503: Browserless token not configured.
- 504: capture timeout.

## Why Browserless /function
Launchset needs more control than a basic screenshot request: viewport profile, bounded network-idle wait, font/image settling, animation removal, request interception, and PNG response typing. The custom browser function keeps those capture rules in one server-side path.

## Not Included in v1.4.0
- user accounts or per-user quotas
- durable global rate limiting
- full-page capture
- authenticated-site capture
- cookie/session import
- region selector in UI
- persistent capture history
