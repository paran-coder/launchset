# Launchset v1.3.3 — GitHub → Vercel Deployment

## GitHub
`release/Launchset-v1.3.3-github.zip`의 압축을 풀고 내용물을 GitHub 저장소 루트에 올린다.

저장소 루트에는 다음이 직접 보여야 한다.
- `src/`
- `.github/`
- `package.json`
- `vite.config.ts`
- `vercel.json`
- `tsconfig.json`
- `index.html`

## Vercel
- Framework: Vite
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node: `22.x`

## SPA Routing
`vercel.json`의 catch-all rewrite로 `/studio` 직접 접속 시 `/index.html`을 제공한다.

## Production Gate
1. GitHub Actions: `npm install`
2. `npm run typecheck`
3. `npm run build`
4. Vercel Preview 성공
5. `/` 정상
6. `/studio` 직접 접속 정상
7. 이미지 업로드 정상
8. 개별 PNG 정상
9. Visual Pack ZIP 정상
