# Launchset v1.3.3 — Context Notes

## 목표
Launchset v1.3.2의 기능과 GitHub → Vercel 배포 구조를 유지하면서, 사용자에게 노출되는 UI를 한국어 중심으로 현지화한다.

## 승인된 결정
- 브랜드명: `Launchset` 유지
- 한국어 슬로건: `하나의 제품으로, 출시 비주얼을 한 번에.`
- 사용자 노출 UI: 한국어 기본
- 고유명사/표준 포맷: Launchset, Product Hunt, Open Graph, PNG, ZIP, URL 등은 필요한 경우 영문 유지
- 문자열 구조: 향후 한국어/영어 전환을 추가하기 쉽도록 중앙화
- 배포: GitHub 저장소 → Vercel

## UI 기준
첨부된 `ui-polish` 원칙을 UI 설계/검수 기준으로 사용한다.
- 구조 우선
- 명확한 시각 계층
- 재사용 가능한 UI 패턴
- 현실적인 구현
- 절제된 모션
- 그림자/블러는 계층을 강화할 때만 사용
- 접근성 및 reduced motion 지원

## 디자인 토큰 기준
첨부된 디자인 토큰의 색상 체계를 Launchset에 맞게 유지한다.
- Canvas: `#0B0E11`
- Surface: `#1E2329`
- Elevated / Hairline: `#2B3139`
- Primary: `#FCD535`
- Primary active: `#F0B90B`
- On primary: `#181A20`
- Body on dark: `#EAECEF`
- Launchset muted: `#84909F`
- Light muted: `#5E6673`

## 타이포그래피 현지화 기준
한국어는 영어보다 음수 자간을 약하게 사용하고 충분한 행간을 확보한다.
- Hero: 56–64px / 1.10–1.14 / -0.015em 이하
- Section heading: 32–48px / 1.18–1.25 / -0.012em 이하
- Editor title: 20px / 1.4
- Marketing body: 15–17px / 1.65–1.75
- UI body: 13–14px / 1.55–1.65
- Caption: 12px / 1.5–1.6
- Button: 14px / 1.2
- 의도적 UI 텍스트 최소 크기: 12px

## 버전/파일 규칙
- 프로젝트 루트: `Launchset-v1.3.3`
- 배포 산출물: `Launchset-v1.3.3/release/`
- GitHub 업로드용 ZIP: `Launchset-v1.3.3-github.zip`
- 전체 프로젝트 ZIP: `Launchset-v1.3.3-full.zip`

## 현재 단계
1. 기준 문서 4종 생성
2. v1.3.2 코드 통합 및 버전 갱신
3. UI 문자열 중앙화 + 한국어 현지화
4. 한국어 타이포/레이아웃 QA
5. GitHub/Vercel 배포 구조 재생성
6. 검증/자체평가/패키징
