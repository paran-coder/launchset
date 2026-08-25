# Launchset v1.4.4

Launchset v1.4.4는 URL Capture와 Studio Preview의 선명도를 개선하는 **HiDPI Quality Patch**입니다.

## 핵심 변경
- URL Capture 기본 2× pixel density
- Browserless 전송은 고품질 WebP로 제한하고 최종 Export는 PNG 유지
- Desktop: 1440×900 viewport → 2880×1800 source PNG
- Mobile: 390×844 viewport → 780×1688 source PNG
- Canvas 고품질 image smoothing
- Studio Preview devicePixelRatio-aware rendering
- 최종 Export 규격은 기존 논리 크기 유지
- v1.4.3 Browserless 오류 분류와 URL Capture 구조 유지

## Runtime
- Node.js 24.x
- React 19
- Vite 7.1.3
- Tailwind CSS 4.3.3
- TypeScript 5.8.3

## Production Verification
동일한 Sixshop URL을 v1.4.3과 v1.4.4에서 비교하여 작은 텍스트와 thin UI line의 선명도를 확인합니다.

## Version
`1.4.4`
