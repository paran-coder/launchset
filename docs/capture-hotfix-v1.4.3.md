# Launchset v1.4.3 — Capture Hotfix Architecture

## 문제
v1.4.2 Production에서 Browserless token을 정상 등록한 뒤에도 `https://example.com` URL Capture가 실패했습니다. 특정 사이트 문제가 아니므로 Launchset ↔ Browserless 연동 계층을 수정했습니다.

## 변경 전
`Studio → /api/capture → Browserless /function → custom Puppeteer code → PNG`

## 변경 후
`Studio → /api/capture → Browserless /screenshot → PNG`

단순 screenshot 작업에 custom Puppeteer 코드를 전송하지 않고 Browserless의 전용 REST endpoint를 사용합니다.

## Browserless request
- endpoint: `/screenshot`
- auth: `?token=`
- timeout query: 24000ms
- Desktop viewport: 1440×900
- Mobile viewport: 390×844, `isMobile: true`, `hasTouch: true`
- goto: `domcontentloaded`, 15000ms
- settle wait: 800ms
- `bestAttempt: true`
- output: PNG, viewport only

## 오류 분류
- `CAPTURE_NOT_CONFIGURED`: Vercel token 미설정
- `CAPTURE_AUTH_FAILED`: Browserless 401
- `CAPTURE_DESTINATION_BLOCKED`: Browserless 403
- `CAPTURE_PROVIDER_RATE_LIMITED`: Browserless 429
- `CAPTURE_REQUEST_REJECTED`: Browserless 400
- `CAPTURE_PROVIDER_ERROR`: Browserless endpoint / 5xx
- `CAPTURE_TARGET_ACCESS_BLOCKED`: target 401/403 via X-Response-Code
- `CAPTURE_TARGET_NOT_FOUND`: target 404
- `CAPTURE_TARGET_RATE_LIMITED`: target 429
- `CAPTURE_TARGET_SERVER_ERROR`: target 5xx
- `CAPTURE_INVALID_RESPONSE`: image가 아닌 응답
- `CAPTURE_TIMEOUT`: timeout
- `CAPTURE_NETWORK_ERROR`: network

## 보안
- token은 Vercel server environment에서만 읽음
- browser bundle로 token 전달하지 않음
- HTTP/HTTPS만 허용
- localhost / local suffix / private literal IPv4 / private literal IPv6 차단
- URL credential 차단
- 12MB response limit
- instance-local burst rate limit 유지
- Browserless upstream raw error body는 사용자 UI에 노출하지 않음

## 공식 근거
- https://docs.browserless.io/rest-apis/screenshot-api
- https://docs.browserless.io/open-api/screenshot
- https://docs.browserless.io/rest-apis/request-configuration
- https://docs.browserless.io/openapi.json

## Production Gate
1. `https://example.com` Desktop
2. `https://example.com` Mobile
3. `https://wavesstay.sixshop.site/`
4. Visual Pack
5. 개별 PNG
6. ZIP

이 Gate가 완료되기 전에는 v1.5.0 Brand System을 시작하지 않습니다.
