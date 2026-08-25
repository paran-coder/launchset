# Launchset v1.4.5 — Sharpness Architecture

## 문제
2× HiDPI source만으로는 전체 1440px 웹사이트를 Hero 내부의 작은 frame에 맞출 때 작은 텍스트의 가독성을 완전히 해결할 수 없습니다.

## 해결 구조

### 1. PNG-first Capture
Browserless는 1440×900 또는 390×844 CSS viewport를 2× pixel density로 캡처합니다.

전송 우선순위:
1. PNG
2. PNG가 4,000,000 bytes 초과 → WebP 92
3. WebP 92도 초과 → WebP 82
4. 그래도 초과 → 명시적 용량 오류

따라서 가능한 경우 URL source는 무손실 PNG를 유지합니다.

### 2. Progressive Downsampling
큰 source를 최종 frame 크기로 한 번에 축소하지 않습니다.
source가 목표 물리 픽셀의 약 2.15배보다 큰 동안 1/2 단계로 축소합니다.

예:
2880 → 1440 → 최종 frame

각 단계는 high-quality image smoothing을 사용합니다.

### 3. Source Focus
`전체 보기`는 기존처럼 전체 화면을 frame 안에 표시합니다.

`집중 보기`는 frame 자체는 유지하고 source 내부를 중앙 기준으로 crop/zoom합니다.
- 최소 115%
- 기본 135%
- 최대 160%

이 설정은 Studio Preview와 모든 Export에서 동일하게 사용됩니다.

### 4. Direction Layout
제품 화면이 결과물에서 더 큰 역할을 하도록 기본 scale과 source envelope를 조정했습니다.
- Minimal 72
- Editorial 69
- Signal 71
- Depth 70

Wide source envelope는 49%에서 52%로 확대했습니다.

## Output 규격
- Hero 1440×900
- Open Graph 1200×630
- Product Hunt 1270×760
- Square 1080×1080
- Story 1080×1920

규격 자체는 변경하지 않습니다.

## Production QA
같은 Sixshop URL로:
- 전체 보기
- 집중 보기 135%
- 집중 보기 150%
- Hero PNG

를 비교하고 작은 글자, 버튼, thin border, 사진/텍스트 경계를 확인합니다.
