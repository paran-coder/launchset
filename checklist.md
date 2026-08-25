# Launchset v1.4.2 — Checklist

## 개발 지침 준수 Gate
- [x] 실행 전 계획 설명
- [x] 사용자 승인 확인
- [x] 코드 작업 전 context-notes.md 생성
- [x] 코드 작업 전 checklist.md 생성
- [x] 코드 작업 전 README.md 생성
- [x] 코드 작업 전 User manual.md 생성
- [x] SemVer 버전 `v1.4.2` 확정
- [x] 단일 프로젝트 루트 규칙 확인
- [x] GitHub → Vercel 배포 전제 확인
- [x] 기능/UI 변경 없는 Runtime 패치 범위 확인

## Runtime Version Consistency Gate
- [x] package.json `engines.node` = `24.x`
- [x] .nvmrc = `24`
- [x] GitHub Actions Node = `24`
- [x] Vercel Project Node = `24.x` — 사용자 Vercel 로그/설정 기준, v1.4.2 배포 로그에서 재확인 예정
- [x] README / runtime 문서 Node = `24.x`
- [x] 코드/설정 내 Node 22 런타임 지정 잔존 0건

## Phase 1 — Source Integration
- [x] v1.4.1 소스 통합
- [x] 버전 문자열 1.4.2 정렬
- [x] Node 24 전환
- [x] 자체 점검 및 10점 평가

## Phase 2 — CI / Vercel Consistency
- [x] GitHub Actions Node 24
- [x] Vercel 설정 정합성 확인 — 저장소/사용자 설정 기준, 실제 배포에서 재확인
- [x] install / build command 확인
- [x] Runtime Version Consistency Gate PASS
- [x] 자체 점검 및 10점 평가

## Phase 3 — Static Verification
- [x] TS/TSX syntax 검사
- [x] 상대 import 검사
- [x] Vite/Tailwind/TypeScript 호환성 재검사
- [x] ZIP writer regression 확인
- [x] URL Capture API regression 확인
- [x] 자체 점검 및 10점 평가

## Phase 4 — Release
- [x] release/github 생성
- [x] GitHub용 ZIP 생성
- [x] Full ZIP 생성
- [x] SHA256SUMS 생성
- [x] 최종 QA
- [x] Vercel 실제 빌드/URL Capture를 마지막 Production Gate로 명시
