# Launchset v1.3.3

**하나의 제품으로, 출시 비주얼을 한 번에.**

Launchset은 제품 스크린샷 하나에서 웹사이트 Hero, Open Graph, Product Hunt, 소셜 정사각형, Story 등 여러 출시용 비주얼을 생성하는 웹 기반 Product Visual Studio입니다.

## 이번 버전의 목적
v1.3.3은 기능 추가보다 **한국어 현지화와 배포 안정성**에 집중하는 패치 버전입니다.

- 한국어 기본 UI
- 한국어에 맞춘 타이포그래피/줄바꿈/밀도 보정
- 사용자 노출 문자열 중앙화
- 향후 ko/en 언어 전환을 추가하기 쉬운 구조
- GitHub → Vercel 배포 구조 유지
- v1.3.2의 Multi-Artboard / Visual Pack / ZIP Export 기능 유지

## 기술 스택
- React
- TypeScript
- Vite
- Tailwind CSS 계열 유틸리티 기반 스타일링
- Canvas 2D
- Client-side PNG/ZIP export

## 배포
배포 목표는 GitHub 저장소를 Vercel에 연결하는 구조입니다.

최종 GitHub 업로드용 패키지는 `release/Launchset-v1.3.3-github.zip`으로 생성합니다.
