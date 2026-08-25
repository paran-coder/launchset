# Launchset v1.4.2 — User Manual

## 기본 사용
1. Launchset Studio를 엽니다.
2. 파일 또는 URL을 소스로 선택합니다.
3. URL 사용 시 Desktop 또는 Mobile 캡처를 선택합니다.
4. 비주얼 스타일을 선택하고 필요한 세부 설정을 조정합니다.
5. Visual Pack에서 필요한 결과물을 선택합니다.
6. PNG 또는 ZIP으로 다운로드합니다.

## URL Capture 배포 조건
Vercel 환경변수:
- `BROWSERLESS_API_TOKEN` 필수
- `BROWSERLESS_API_URL` 선택

## Runtime
GitHub Actions, 로컬 `.nvmrc`, `package.json`, Vercel Project Settings 모두 Node.js `24.x`를 사용합니다.

## GitHub 배포
`release/Launchset-v1.4.2-github.zip`의 압축을 풀고 내부 파일을 GitHub 저장소 루트에 배치합니다.

## v1.4.2 변경점
사용자 기능은 그대로이며 Node.js 런타임 정합성만 수정합니다.
