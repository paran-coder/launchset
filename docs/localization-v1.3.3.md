# Launchset v1.3.3 — Korean Localization

## 목표
영문 기반 UI를 한국어 기본 경험으로 바꾸되 단순 직역이 아니라 한국어 타이포그래피와 정보 밀도에 맞게 재설계한다.

## 번역 원칙
- `Launchset` 브랜드명은 유지한다.
- `Product Hunt`, `Open Graph`, `PNG`, `ZIP`, `URL`, `Canvas 2D`처럼 고유명사 또는 표준 포맷은 필요한 범위에서 영문을 유지한다.
- 행동 문구는 한국어 동사 중심으로 쓴다.
- 전문 용어보다 결과를 먼저 이해할 수 있는 표현을 우선한다.

## 문자열 구조
`src/i18n/ko.ts`가 현재 사용자 노출 문자열의 단일 소스다.

`src/i18n/index.ts`의 locale registry는 현재 `ko`만 등록되어 있다. 이후 `en.ts`를 추가하고 registry에 연결하면 언어 전환 구조로 확장할 수 있다.

## 타이포그래피 변경
- Hero: 최대 60px, line-height 1.12, letter-spacing -0.012em
- Section heading: 32–48px, line-height 1.22, letter-spacing -0.012em
- Marketing body: 15–17px, line-height 1.70 전후
- UI body: 13–14px, line-height 1.55–1.65
- Caption: 12px, line-height 1.50 이상
- Kicker: 12px / 18px / letter-spacing 0.02em
- 의도적 UI 최소 크기: 12px

## 한국어 줄바꿈
`body`, `.kr-heading`, `.kr-body`에 `word-break: keep-all`을 적용하고 `overflow-wrap: break-word`를 보조로 사용한다.

## Canvas Export
렌더링 결과 내부의 label, headline, subcopy, placeholder, signature도 한국어로 전환했다. Canvas 폰트는 OS의 한국어 시스템 폰트로 fallback하도록 구성한다.
