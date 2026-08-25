# Changelog

## v1.3.3 — Korean Localization Patch

### Added
- 한국어 기본 UI
- `src/i18n/ko.ts` 중앙 문자열 사전
- `src/i18n/index.ts` locale registry
- 한국어 Canvas Export 문구
- `<html lang="ko">` 및 한국어 title/description

### Changed
- Hero 최대 글자 크기 64px → 60px 수준으로 조정
- 한국어 제목 음수 자간 완화
- 한국어 본문 행간 확대
- section kicker 자간 `.10em` → `.02em`
- 한국어 시스템 폰트 fallback 추가
- Canvas/Modal shadow 강도 완화
- light muted 계열을 `#5E6673` 기준으로 통일
- 패키지 버전 `1.3.2` → `1.3.3`

### Preserved
- Multi-Artboard 5종
- Visual Pack ZIP Export
- `Uint8Array<ArrayBuffer>` Vercel BlobPart 패치
- GitHub Actions CI
- Vercel Vite + SPA rewrite 구조
