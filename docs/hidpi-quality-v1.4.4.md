# Launchset v1.4.4 — HiDPI Quality Architecture

## 문제
v1.4.3의 URL Capture는 CSS viewport와 실제 source pixel이 1:1이어서, Hero 내부 축소와 Studio Preview 축소를 거치면 작은 텍스트와 thin line이 파일 업로드 source보다 부드럽게 보일 수 있었습니다.

## 해결
### Capture
- Desktop logical viewport: 1440×900
- Desktop source scale: 2×
- Mobile logical viewport: 390×844
- Mobile source scale: 2×

웹사이트 responsive layout 기준은 기존 viewport를 유지하면서 source pixel density만 2배로 높입니다.

### Transport
2× PNG는 사진이 많은 사이트에서 Vercel Function response payload 한도를 넘을 수 있습니다.
따라서 Browserless screenshot transport는 WebP 92를 사용하고 4,000,000 bytes 초과 시 WebP 82로 한 번 재시도합니다.
최종 Visual Pack은 여전히 PNG로 Export됩니다.

### Renderer
`renderComposition`은 optional pixelRatio를 지원하며:
- preview: devicePixelRatio 기준 최대 2×
- export: 1× logical output dimensions

를 사용합니다.

`imageSmoothingEnabled = true`
`imageSmoothingQuality = high`

를 명시합니다.

## Export 규격
- Website Hero: 1440×900
- Open Graph: 1200×630
- Product Hunt: 1270×760
- Social Square: 1080×1080
- Story: 1080×1920

## Production 비교 기준
동일한 `wavesstay.sixshop.site` URL을 캡처해 다음을 비교합니다.
- 사이트 Hero 내부 작은 글자
- 메뉴 및 버튼 텍스트
- thin border
- 사진과 텍스트 경계
- 브라우저 frame edge
- Studio Preview와 실제 Hero PNG

## 완료 Gate
Production에서 Desktop/Mobile 캡처, Preview 선명도, Hero PNG, Visual Pack, ZIP을 모두 확인한 뒤 v1.5.0으로 진행합니다.
