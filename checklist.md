# Launchset v1.3.3 — Checklist

## 개발 지침 준수 Gate
- [x] 작업 실행 전 계획 설명 및 사용자 승인
- [x] 코드 수정 전에 `context-notes.md` 생성
- [x] 코드 수정 전에 `checklist.md` 생성
- [x] 코드 수정 전에 `README.md` 생성
- [x] 코드 수정 전에 `User manual.md` 생성
- [x] Semantic Versioning 적용: `v1.3.3`
- [x] 프로젝트 루트 파일명 규칙: `Launchset-v1.3.3`
- [x] GitHub/Vercel 배포 전제 기록
- [x] 첨부 `ui-polish`를 UI 검수 기준으로 사용
- [x] 첨부 디자인 토큰을 색상 기준으로 사용
- [x] 각 주요 단계 종료 후 자체 점검
- [x] 각 주요 단계 종료 후 수정/보완
- [x] 각 주요 단계 종료 후 10점 평가
- [x] 최종 QA 후 release 패키지 생성

## Phase 1 — Source Integration
- [x] v1.3.2 소스 복사
- [x] package/version 1.3.3 통일
- [x] 기존 Vercel BlobPart 패치 유지 확인
- [x] 빌드 산출물 제외 확인
- [x] 자체 점검 및 평가

## Phase 2 — Korean Localization
- [x] 사용자 노출 문자열 전수 조사
- [x] 중앙 문자열 파일 생성
- [x] 랜딩페이지 한국어화
- [x] Studio 한국어화
- [x] Visual Pack 한국어화
- [x] 모바일 Handoff 한국어화
- [x] Empty/Loading/Error 한국어화
- [x] aria-label/title/alt 한국어화
- [x] HTML lang/title/description 한국어화
- [x] 영문 잔존 문자열 검사
- [x] 자체 점검 및 평가

## Phase 3 — Korean Typography & UI Polish
- [x] 한국어 Hero 줄바꿈 검수
- [x] 자간/행간 재조정
- [x] 버튼/카드 너비 검수
- [x] 12px 미만 텍스트 검사
- [x] Dark/Light 대비 검사
- [x] 모바일 overflow/clipping 검사
- [x] motion/reduced-motion 유지 확인
- [x] 자체 점검 및 평가

## Phase 4 — GitHub / Vercel Release
- [x] release/github 재생성
- [x] GitHub CI 포함
- [x] Vercel SPA rewrite 유지
- [x] Node/Vite 설정 확인
- [x] 문서 4종 포함
- [x] 자체 점검 및 평가

## Phase 5 — Verification & Packaging
- [x] TS/TSX syntax 검사
- [x] 상대 import 검사
- [x] zip.ts TypeScript 5.8 strict 검사
- [x] ZIP integrity 검사
- [x] npm build 가능 여부 기록
- [x] 최종 QA 문서 생성
- [x] 단계별 자체평가 문서 생성
- [x] SHA-256 생성
- [x] GitHub ZIP 생성
- [x] Full ZIP 생성
