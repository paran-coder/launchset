# Launchset v1.4.5 — Checklist

## 개발 지침 준수 Gate
- [x] 실행 전 계획 설명
- [x] 사용자 승인 확인
- [x] 코드 작업 전 context-notes.md 생성
- [x] 코드 작업 전 checklist.md 생성
- [x] 코드 작업 전 README.md 생성
- [x] 코드 작업 전 User manual.md 생성
- [x] SemVer `v1.4.5` 확정
- [x] 단일 프로젝트 루트 규칙 확인
- [x] GitHub → Vercel 배포 전제 확인
- [x] v1.5.0 진입 전 품질 Gate 고정

## Runtime Version Consistency Gate
- [x] package.json engines.node = 24.x
- [x] .nvmrc = 24
- [x] GitHub Actions Node = 24
- [x] Node 22.x 잔존 0건

## Phase 1 — Source Integration
- [x] v1.4.4 소스 통합
- [x] 버전 1.4.5 정렬
- [x] 기능/UI 회귀 확인
- [x] 자체 점검 및 10점 평가

## Phase 2 — PNG-first Capture
- [x] Browserless primary capture PNG
- [x] payload size 확인
- [x] oversize 시 WebP 92 fallback
- [x] 필요 시 WebP 82 fallback
- [x] 기존 2× viewport 유지
- [x] 기존 오류 분류 유지
- [x] 자체 점검 및 10점 평가

## Phase 3 — Progressive Downsampling
- [x] source 축소 helper 구현
- [x] 2× 이상 큰 source는 단계적으로 축소
- [x] high-quality smoothing 유지
- [x] export logical dimensions 유지
- [x] 메모리/성능 검토
- [x] 자체 점검 및 10점 평가

## Phase 4 — Source Focus UX
- [x] 전체 보기 / 집중 보기
- [x] 집중 보기 zoom control
- [x] 기본값 전체 보기
- [x] focus zoom 범위 제한
- [x] preview/export 동기화
- [x] 접근성 label
- [x] reduced motion 영향 없음
- [x] 자체 점검 및 10점 평가

## Phase 5 — Direction Layout Polish
- [x] Minimal frame 비중 확대
- [x] Editorial frame 비중 검토
- [x] Signal frame 비중 검토
- [x] Depth frame 비중 검토
- [x] 카피 충돌/overflow 없음
- [x] 자체 점검 및 10점 평가

## Phase 6 — Regression Verification
- [x] TypeScript strict compile
- [x] TS/TSX syntax 검사
- [x] 상대 import 검사
- [x] Runtime consistency 검사
- [x] Capture PNG primary mock
- [x] Capture WebP fallback mock
- [x] Focus mode renderer 검사
- [x] Hero output dimension 검사
- [x] ZIP writer regression
- [x] 기존 URL Capture error mapping 회귀
- [x] 자체 점검 및 10점 평가

## Phase 7 — Release
- [x] CHANGELOG 갱신
- [x] docs 생성
- [x] release/github 생성
- [x] GitHub ZIP 생성
- [x] Full ZIP 생성
- [x] SHA256SUMS 생성
- [x] unzip -t PASS
- [x] 최종 자체평가

## Production Gate
- [ ] wavesstay.sixshop.site Desktop
- [ ] wavesstay.sixshop.site Mobile
- [ ] 전체 보기 선명도 비교
- [ ] 집중 보기 선명도 비교
- [ ] Hero PNG
- [ ] Visual Pack
- [ ] ZIP
- [ ] PASS 후 v1.5.0 시작
