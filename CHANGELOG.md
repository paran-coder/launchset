# Changelog

## v1.4.4 — HiDPI Capture & Preview
- URL Capture `deviceScaleFactor` 1 → 2
- Desktop 1440×900 CSS viewport에서 2880×1800급 source 확보
- Mobile 390×844 CSS viewport에서 780×1688급 source 확보
- Browserless transport를 WebP 92로 최적화
- Vercel response payload 안전 한도 4,000,000 bytes 적용
- 큰 캡처는 WebP 82로 1회 fallback
- Canvas `imageSmoothingQuality = high`
- Studio Preview를 devicePixelRatio-aware backing store로 변경
- Preview backing store와 Hero PNG Export 경로 분리
- Hero / OG / Product Hunt / Square / Story 출력 규격 유지
- HiDPI regression test를 GitHub Actions에 추가
- v1.4.3 URL Capture 오류 분류와 보안 규칙 유지

## v1.4.3 — Capture Hotfix
- Browserless `/screenshot` API 적용
- 오류 유형 세분화
- URL source 상태 표시 개선
