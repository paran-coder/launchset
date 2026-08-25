# Changelog

## v1.4.3 — Capture Hotfix
- Browserless custom `/function` 캡처 경로를 preferred `/screenshot` REST API로 교체
- Desktop 1440×900 / Mobile 390×844 viewport 유지
- Browserless OpenAPI에 맞춰 `viewport`, `gotoOptions`, `waitForTimeout`, `bestAttempt` 사용
- Browserless 401 인증 실패와 403 destination 차단을 분리
- Browserless 429 / 5xx, target 403 / 404 / 429 / 5xx, timeout / network 오류 분류
- Browserless의 `X-Response-Code`를 사용해 대상 사이트 응답 상태 판별
- Studio 오류 UI에 오류 범주 라벨 추가
- URL source 상태를 `캡처 준비 / 캡처 중 / 완료 / 확인 필요`로 정리
- URL 입력 또는 viewport 변경 시 이전 오류 즉시 초기화
- Capture API 자동 회귀 테스트 추가
- Node.js 24.x / Vite 7.1.3 / Tailwind CSS 4.3.3 유지

## v1.4.2 — Node 24 Alignment
- Node.js runtime 24.x 통일
- Runtime Version Consistency Gate 추가

## v1.4.1 — Vercel Dependency Hotfix
- Tailwind CSS / @tailwindcss/vite 4.3.3 정렬
- Vite 7.1.3 peer dependency 충돌 제거
