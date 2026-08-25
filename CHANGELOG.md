# Changelog

## v1.4.2 — Node 24 Alignment
- Node.js runtime 기준을 22.x에서 24.x로 통일
- `package.json` engines.node → `24.x`
- `.nvmrc` → `24`
- GitHub Actions `node-version` → `24`
- Runtime Version Consistency Gate 추가
- v1.4.1의 Vite 7.1.3 / Tailwind CSS 4.3.3 dependency hotfix 유지
- 사용자 기능 및 UI 변경 없음

## v1.4.1 — Vercel dependency hotfix
- `@tailwindcss/vite` / `tailwindcss`를 4.3.3으로 정렬
- Vite 7.1.3과의 peer dependency 충돌 제거
