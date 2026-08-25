# Launchset v1.4.0 — GitHub → Vercel Deployment

## 1. GitHub
`release/Launchset-v1.4.0-github.zip`의 압축을 풀고 그 **내용물**을 저장소 루트에 올린다.

저장소 루트에는 최소 다음이 바로 보여야 한다.

```text
.github/
api/
src/
.env.example
.gitignore
.nvmrc
README.md
User manual.md
checklist.md
context-notes.md
index.html
package.json
tsconfig.json
vercel.json
vite.config.ts
```

## 2. GitHub Actions
Push 후 `CI` workflow에서 다음 순서를 확인한다.

```text
npm install
npm run typecheck
npm run build
```

세 단계가 모두 통과하기 전에는 production-ready로 판정하지 않는다.

## 3. Vercel Project
- Framework Preset: Vite
- Node.js: package.json의 `22.x`
- Build Command: `npm run build`
- Output Directory: `dist`

`vercel.json`이 `/studio`와 `/studio/:path*`만 SPA index로 rewrite한다. `/api/capture`는 Vercel Function으로 남아야 한다.

## 4. Environment Variables
Vercel Project Settings → Environment Variables에 추가한다.

Required:
```text
BROWSERLESS_API_TOKEN=<Browserless token>
```

Optional:
```text
BROWSERLESS_API_URL=https://production-sfo.browserless.io
```

권장 적용 범위:
- Preview
- Production

토큰 이름에 `VITE_`를 붙이지 않는다. 이 값은 브라우저 번들로 노출되면 안 된다.

## 5. Preview Smoke Test
1. `/` 랜딩 정상 표시.
2. `/studio` 직접 접근 정상.
3. 파일 업로드 → Hero PNG 정상.
4. 파일 업로드 → 5-output ZIP 정상.
5. URL → Desktop 캡처 정상.
6. URL → Mobile 캡처 정상.
7. URL 캡처 결과 → Hero PNG 정상.
8. URL 캡처 결과 → ZIP 정상.
9. 잘못된 URL은 한국어 오류 상태 표시.
10. 반복 요청 시 429 상태가 UI에서 안전하게 표시되는지 확인.

## 6. Public Release Guardrail
v1.4.0에는 함수 인스턴스 기준 burst protection이 있지만 전역 quota는 아니다. 사용자가 늘기 전 다음 단계에서 계정 기반 quota 또는 Vercel Firewall rate limit을 추가한다.
