# Launchset v1.4.3 — Checklist

## 개발 지침 준수 Gate
- [x] 실행 전 계획 설명
- [x] 사용자 승인 확인
- [x] 코드 작업 전 context-notes.md 생성
- [x] 코드 작업 전 checklist.md 생성
- [x] 코드 작업 전 README.md 생성
- [x] 코드 작업 전 User manual.md 생성
- [x] SemVer `v1.4.3` 확정
- [x] 단일 프로젝트 루트 규칙 확인
- [x] GitHub → Vercel 배포 전제 확인
- [x] v1.5.0 진입 전 Capture Production Gate 고정

## Runtime Version Consistency Gate
- [x] package.json engines.node = 24.x
- [x] .nvmrc = 24
- [x] GitHub Actions Node = 24
- [x] 저장소 내 Node 22.x 잔존 0건

## Phase 1 — Capture API Hotfix
- [x] v1.4.2 소스 통합
- [x] `/function` 기반 custom Puppeteer 제거
- [x] `/screenshot` REST API 적용
- [x] Desktop 1440×900 / Mobile 390×844 유지
- [x] timeout / max response / rate limit 유지
- [x] upstream 오류 코드 분류
- [x] 보안 검토
- [x] 자체 점검 및 10점 평가

## Phase 2 — Studio Capture UX
- [x] 인증 실패 메시지
- [x] Browserless 사용량 제한 메시지
- [x] 대상 사이트 / 캡처 실패 메시지
- [x] Browserless 서버 오류 메시지
- [x] timeout / network 오류 메시지
- [x] URL 탭 source 상태 정확화
- [x] 접근성 상태 메시지 유지
- [x] 자체 점검 및 10점 평가

## Phase 3 — Regression Verification
- [x] `api/capture.ts` TypeScript strict compile
- [x] TS/TSX syntax 검사
- [x] 상대 import 검사
- [x] Runtime consistency 검사
- [x] API mock: 200 PNG
- [x] API mock: 401/403
- [x] API mock: 429
- [x] API mock: 4xx capture failure
- [x] API mock: 5xx
- [x] API mock: timeout
- [x] ZIP writer regression
- [x] 자체 점검 및 10점 평가

## Phase 4 — Release
- [x] README / User manual 최종 갱신
- [x] CHANGELOG 갱신
- [x] docs 검증 문서 생성
- [x] release/github 생성
- [x] GitHub ZIP 생성
- [x] Full ZIP 생성
- [x] SHA256SUMS 생성
- [x] ZIP integrity 검사
- [x] 최종 QA 및 자체평가

## Production Gate — 사용자 Vercel
- [ ] `https://example.com` Desktop Capture 성공
- [ ] `https://example.com` Mobile Capture 성공
- [ ] `wavesstay.sixshop.site` Capture 결과 확인
- [ ] Visual Pack 생성
- [ ] 개별 PNG 다운로드
- [ ] ZIP 다운로드
- [ ] PASS 후 v1.5.0 Brand System 시작
