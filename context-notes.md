# Launchset v1.4.4 — Context Notes

## 목적
Production에서 URL Capture 결과가 파일 업로드 대비 뿌옇게 보이는 문제를 수정하는 품질 패치입니다.

## 확인된 원인
- URL Capture viewport는 Desktop 1440×900 / Mobile 390×844
- Browserless 캡처가 1× pixel density로 생성됨
- Launchset Hero 안에서 다시 축소됨
- Studio Preview Canvas도 CSS 크기로 축소되어 고해상도 디스플레이에서 추가적인 softening이 보일 수 있음
- 작은 웹사이트 텍스트와 thin UI line에서 차이가 가장 크게 보임

## 승인된 변경 범위
1. URL Capture를 기본 2× HiDPI로 변경
   - Desktop CSS viewport 1440×900 → PNG 2880×1800
   - Mobile CSS viewport 390×844 → PNG 780×1688
2. Canvas image smoothing을 명시적으로 high quality로 설정
3. Studio Preview를 devicePixelRatio-aware backing store로 개선
4. Export 논리 해상도는 기존 1440×900 등 output spec을 유지
5. 동일 Sixshop URL로 전/후 선명도 비교가 가능하도록 QA 기준 문서화
6. Visual Pack / 개별 PNG / ZIP 회귀 테스트
7. 이 품질 Gate 통과 후 v1.5.0 Brand System으로 진행

## 비범위
- Brand System
- Motion
- 신규 preset
- Export 규격 변경
- 사용자 계정/저장 기능

## 프로젝트 규칙
- 단일 프로젝트 루트: `Launchset-v1.4.4`
- GitHub 배포 산출물: `release/github/`
- GitHub ZIP: `release/Launchset-v1.4.4-github.zip`
- 전체 ZIP: `release/Launchset-v1.4.4-full.zip`

## 기술 기준
- Node.js 24.x
- React 19
- Vite 7.1.3
- Tailwind CSS 4.3.3
- TypeScript 5.8.3
- Browserless `/screenshot`
- GitHub → Vercel

## 완료 조건
- Production에서 Sixshop URL이 Desktop/Mobile 모두 성공
- Preview가 이전보다 선명함
- Export output dimension 유지
- PNG/ZIP 회귀 없음
- 이후에만 v1.5.0 시작


## 구현 중 추가 확인
- Vercel Function 응답 payload 한도 때문에 2× PNG를 그대로 프록시하지 않습니다.
- Browserless → Vercel → Browser 구간은 WebP 92 품질을 기본으로 사용합니다.
- 4,000,000 bytes를 넘으면 WebP 82로 한 번 재시도합니다.
- 재시도 후에도 한도를 넘으면 사용자에게 고해상도 캡처 용량 오류를 반환합니다.
- 최종 Launchset Visual Pack Export는 기존대로 PNG입니다.
