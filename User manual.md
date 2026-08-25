# Launchset v1.4.4 — User Manual

## URL Capture
1. Studio에서 `URL`을 선택합니다.
2. 공개 URL을 입력합니다.
3. `데스크톱` 또는 `모바일`을 선택합니다.
4. `URL 캡처`를 누릅니다.
5. v1.4.4부터는 내부적으로 2× 고해상도 source가 생성됩니다.
6. 서버 전송은 고품질 WebP로 최적화되며 최종 다운로드 포맷은 기존처럼 PNG입니다.
7. 사용자가 보는 viewport 기준은 기존과 동일합니다.

## 결과물
- Website Hero: 1440×900
- Open Graph: 1200×630
- Product Hunt: 1270×760
- Social Square: 1080×1080
- Story: 1080×1920

v1.4.4는 source 품질과 preview 품질을 개선하지만 위 Export 규격 자체는 변경하지 않습니다.

## 선명도 확인 방법
동일한 URL을 캡처한 뒤 작은 본문 글자, 메뉴, 얇은 border, 브라우저 frame 경계를 비교합니다.

## Production 테스트 순서
1. example.com Desktop
2. example.com Mobile
3. wavesstay.sixshop.site Desktop
4. wavesstay.sixshop.site Mobile
5. Hero PNG
6. Visual Pack
7. ZIP

## Version
`1.4.4`
