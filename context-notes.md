# Launchset v1.4.5 — Context Notes

## 목적
v1.4.4에서 2× HiDPI Capture를 적용했지만 제품 화면이 Hero 내부에서 크게 축소되면서 여전히 작은 텍스트와 thin UI line이 부드럽게 보이는 문제를 개선하는 품질 패치입니다.

## 확인된 원인 우선순위
1. 제품 화면을 Hero 내부에서 과도하게 축소하는 구조
2. 큰 source 이미지를 최종 크기로 한 번에 축소하는 단일 단계 다운샘플링
3. Browserless → Vercel 전송을 항상 WebP로 처리하는 손실 압축
4. 원본 캡처 픽셀 밀도

## 승인된 변경 범위
1. PNG-first URL Capture
   - 2× PNG를 우선 요청
   - Vercel response payload 안전 한도 이내면 PNG 그대로 사용
   - 초과 시 고품질 WebP fallback
2. Progressive downsampling
   - 큰 source를 1/2 단계로 축소한 뒤 최종 크기로 렌더링
   - 작은 텍스트와 thin line의 aliasing/softening 완화
3. Source Focus
   - `전체 보기` / `집중 보기`
   - 집중 보기에서 source 내부 zoom 조절
   - focus position은 중앙을 기본으로 하고 향후 위치 이동 확장 가능
4. 4개 Direction의 제품 화면 비중 재조정
   - Minimal 포함 wide layout에서 제품 frame 존재감 상향
   - 카피와 충돌하지 않는 범위에서 frame width 확대
5. 동일 Sixshop URL로 v1.4.4와 v1.4.5 전후 비교
6. Hero PNG / Visual Pack / ZIP 회귀 테스트
7. 품질 Gate 통과 후 v1.5.0 Brand System으로 진행

## 비범위
- Brand Kit
- Motion
- Timeline
- 계정/저장
- source focus 위치 드래그
- 신규 output preset

## 프로젝트 규칙
- 단일 프로젝트 루트: `Launchset-v1.4.5`
- GitHub 배포 산출물: `release/github/`
- GitHub ZIP: `release/Launchset-v1.4.5-github.zip`
- 전체 ZIP: `release/Launchset-v1.4.5-full.zip`

## 기술 기준
- Node.js 24.x
- React 19
- Vite 7.1.3
- Tailwind CSS 4.3.3
- TypeScript 5.8.3
- Browserless `/screenshot`
- GitHub → Vercel

## 완료 조건
- Sixshop Desktop/Mobile Capture 성공
- `전체 보기` / `집중 보기` 정상
- 집중 보기 zoom이 실제 Export에도 동일 반영
- v1.4.4 대비 작은 텍스트/얇은 선 선명도 개선
- Hero PNG 및 Visual Pack/ZIP 회귀 없음
- 이후에만 v1.5.0 시작
