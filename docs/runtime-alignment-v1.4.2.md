# Launchset v1.4.2 — Runtime Alignment

## 목표
GitHub Actions, 로컬 버전 힌트, package.json, Vercel의 Node.js 기준을 24.x로 정렬한다.

## 저장소 기준
- `package.json` → `engines.node: 24.x`
- `.nvmrc` → `24`
- GitHub Actions → `node-version: 24`
- `npm run check:runtime` → 저장소 내부 설정 불일치 시 CI 실패
- Vercel Project Settings → Node.js 24.x 유지

## Runtime Version Consistency Gate
`node scripts/check-runtime.mjs`가 다음 항목을 검사한다.
1. package.json engines.node
2. .nvmrc
3. GitHub Actions node-version

Vercel Project Settings는 저장소 외부 설정이므로 배포 로그에서 Node 24.x 사용 여부를 확인한다.

## 패키지 호환성
- Vite 7.1.3
- Tailwind CSS 4.3.3
- @tailwindcss/vite 4.3.3
- TypeScript 5.8.3
- React 19.1.1

## Production Gate
GitHub push 후 다음을 통과해야 v1.4.2를 production-verified로 본다.
1. GitHub Actions setup-node 24
2. dependency install
3. typecheck
4. Vite production build
5. Vercel Preview build
6. URL Capture desktop/mobile smoke test
