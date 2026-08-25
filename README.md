# Launchset v1.4.3

Launchset v1.4.3은 URL Capture Production 실패를 수정하는 Capture Hotfix입니다.

## 핵심 변경
- Browserless `/function` 기반 custom Puppeteer 경로를 단순 스크린샷 용도에 맞는 `/screenshot` REST API로 변경
- Capture 오류를 인증 / 사용량 제한 / 대상 사이트·캡처 실패 / Browserless 서버 / 네트워크·타임아웃으로 구분
- URL source 상태 문구 정확화
- v1.4.2의 Node.js 24.x, Vite 7.1.3, Tailwind CSS 4.3.3 구성 유지

## 기능 범위
- 파일 업로드
- URL Capture
- Desktop / Mobile Capture
- Canvas 편집
- 4 Direction
- 5종 Visual Pack
- PNG / ZIP Export
- 한국어 UI

## Runtime
- Node.js 24.x
- React 19
- Vite 7.1.3
- Tailwind CSS 4.3.3
- TypeScript 5.8.3

## URL Capture 환경변수
- `BROWSERLESS_API_TOKEN` 필수
- `BROWSERLESS_API_URL` 선택

## Production Verification
이 버전은 Vercel Production에서 `https://example.com` Desktop Capture가 실제로 성공하기 전까지 Production Verified로 표시하지 않습니다.

## Version
`1.4.3`

## v1.4.3 Verification Status
- Capture API regression 14 checks: PASS
- focused TypeScript strict compile: PASS
- Runtime Version Consistency Gate: PASS
- Vercel Production live Capture: PENDING

Browserless의 현재 OpenAPI가 `/screenshot`을 preferred screenshot endpoint로 정의하므로 v1.4.3은 해당 경로를 사용합니다.
