# Launchset v1.4.5 — User Manual

## URL Capture
1. Studio에서 `URL`을 선택합니다.
2. 공개 URL을 입력합니다.
3. 데스크톱 또는 모바일을 선택합니다.
4. `URL 캡처`를 누릅니다.
5. Launchset은 2× source를 우선 PNG로 받아오고, 너무 큰 경우에만 WebP로 최적화합니다.

## 화면 맞춤
### 전체 보기
웹사이트 화면 전체를 제품 frame 안에 맞춥니다.

### 집중 보기
제품 frame은 유지하면서 source 내부를 확대해 중요한 UI를 더 크게 보여줍니다.

## 집중 보기 확대
집중 보기에서 확대 조절을 사용해 source 내부 크기를 조정할 수 있습니다.
기본 확대값과 허용 범위는 결과물 가독성과 crop 안정성을 기준으로 제한됩니다.

## 결과물
- Website Hero: 1440×900
- Open Graph: 1200×630
- Product Hunt: 1270×760
- Social Square: 1080×1080
- Story: 1080×1920

v1.4.5는 source 품질과 composition 가독성을 개선하지만 output 규격 자체는 변경하지 않습니다.

## Production 테스트 순서
1. Sixshop Desktop
2. Sixshop Mobile
3. 전체 보기
4. 집중 보기 + zoom
5. Hero PNG
6. Visual Pack
7. ZIP

## Version
`1.4.5`
