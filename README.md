# Launchset v1.4.0

Launchset은 제품 URL 또는 스크린샷 하나에서 출시·마케팅용 비주얼 팩을 만드는 Product Visual Studio입니다.

## v1.4.0 핵심
스크린샷 파일을 직접 준비하지 않아도 URL을 입력해 Desktop 또는 Mobile 화면을 캡처하고, 기존 Visual Pack 파이프라인의 소스로 바로 사용할 수 있습니다.

## Source modes
- 파일 업로드 — 브라우저 로컬 처리
- URL 캡처 — Vercel Function + Browserless 원격 브라우저 처리

## Visual Pack
- Website Hero — 1440 × 900
- Open Graph — 1200 × 630
- Product Hunt — 1270 × 760
- Social Square — 1080 × 1080
- Story — 1080 × 1920

## Stack
- React 19
- TypeScript 5.8
- Tailwind CSS v4
- Vite 7
- Vercel Functions
- Browserless Function API

## Required environment variable
```text
BROWSERLESS_API_TOKEN
```

Optional:
```text
BROWSERLESS_API_URL=https://production-sfo.browserless.io
```

The token is server-only. Never prefix it with `VITE_`.

## Commands
```bash
npm install
npm run typecheck
npm run build
npm run dev
```

## Deployment
GitHub-ready files are generated under `release/github/`. Import that repository into Vercel, add the capture environment variable, then use the first Vercel Preview as the production build and live-capture gate.

## Product roadmap discipline
v1.4.0 adds URL Capture only. Brand System, assisted art direction, and Motion remain later roadmap stages in the previously approved order.
