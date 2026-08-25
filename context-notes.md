# Launchset v1.4.2 — Context Notes

## 목적
Launchset의 Node.js 런타임을 Vercel 기본 런타임과 맞추기 위해 22.x에서 24.x로 통일하는 호환성 패치입니다.

## 승인된 변경 범위
1. `package.json`의 `engines.node`를 `24.x`로 변경
2. `.nvmrc`를 `24`로 변경
3. GitHub Actions의 Node 버전을 `24`로 변경
4. 문서의 Node 기준을 `24.x`로 통일
5. Runtime Version Consistency Gate 추가
6. 기능/UI 변경 없음
7. Vercel Preview에서 실제 빌드 및 URL Capture 검증 후 v1.5.0으로 진행

## 프로젝트 규칙
- 단일 프로젝트 루트: `Launchset-v1.4.2`
- GitHub 배포 산출물: `release/github/`
- GitHub 배포 ZIP: `release/Launchset-v1.4.2-github.zip`
- 전체 보관 ZIP: `release/Launchset-v1.4.2-full.zip`

## 기술 기준
- React 19
- Vite 7.1.3
- Tailwind CSS 4.3.3
- TypeScript 5.8
- Node.js 24.x
- GitHub → Vercel
- URL Capture: Vercel Function + Browserless

## 다음 단계
v1.4.2 배포와 실제 URL Capture 검증이 끝난 뒤 원래 계획대로 `v1.5.0 Brand System`으로 진행합니다.
