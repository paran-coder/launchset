# Launchset v1.4.4 — Checklist

## 개발 지침 준수 Gate
- [x] 실행 전 계획 설명
- [x] 사용자 승인 확인
- [x] 코드 작업 전 context-notes.md 생성
- [x] 코드 작업 전 checklist.md 생성
- [x] 코드 작업 전 README.md 생성
- [x] 코드 작업 전 User manual.md 생성
- [x] SemVer `v1.4.4` 확정
- [x] 단일 프로젝트 루트 규칙 확인
- [x] GitHub → Vercel 배포 전제 확인
- [x] 기능 추가 없는 quality patch 범위 확인

## Runtime Version Consistency Gate
- [x] package.json engines.node = 24.x
- [x] .nvmrc = 24
- [x] GitHub Actions Node = 24
- [x] Node 22.x 잔존 0건

## Phase 1 — Source Integration
- [x] v1.4.3 소스 통합
- [x] 버전 문자열 1.4.4 정렬
- [x] 기능/UI 회귀 없는지 확인
- [x] 자체 점검 및 10점 평가

## Phase 2 — HiDPI Capture
- [x] Desktop 2× capture
- [x] Mobile 2× capture
- [x] CSS viewport는 기존 크기 유지
- [x] capture result size guard 재검토
- [x] Browserless 오류 처리 유지
- [x] 자체 점검 및 10점 평가

## Phase 3 — HiDPI Preview & Rendering
- [x] imageSmoothingEnabled = true
- [x] imageSmoothingQuality = high
- [x] Studio Preview DPR-aware backing store
- [x] Export output logical dimensions 유지
- [x] resize 시 preview 재렌더 안정성
- [x] reduced motion/accessibility 영향 없음
- [x] 자체 점검 및 10점 평가

## Phase 4 — Regression Verification
- [x] TypeScript strict compile
- [x] TS/TSX syntax 검사
- [x] 상대 import 검사
- [x] Runtime consistency 검사
- [x] Capture request 2× payload 검사
- [x] renderer output dimensions 검사
- [x] ZIP writer regression
- [x] 기존 URL Capture error mapping 회귀 검사
- [x] 자체 점검 및 10점 평가

## Phase 5 — Release
- [x] CHANGELOG 갱신
- [x] README / User manual 최종 갱신
- [x] QA 문서 생성
- [x] release/github 생성
- [x] GitHub ZIP 생성
- [x] Full ZIP 생성
- [x] SHA256SUMS 생성
- [x] unzip -t PASS
- [x] 최종 자체평가

## Production Gate
- [ ] example.com Desktop
- [ ] example.com Mobile
- [ ] wavesstay.sixshop.site Desktop
- [ ] wavesstay.sixshop.site Mobile
- [ ] Studio Preview 선명도 비교
- [ ] Hero PNG
- [ ] Visual Pack
- [ ] ZIP
- [ ] PASS 후 v1.5.0 시작
