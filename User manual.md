# Launchset v1.4.0 — User Manual

## 스크린샷 파일로 시작하기
1. Studio를 엽니다.
2. `파일`을 선택합니다.
3. PNG, JPEG 또는 WebP를 업로드합니다.
4. 비주얼 스타일과 세부 설정을 조정합니다.
5. 비주얼 팩을 내보냅니다.

## URL로 시작하기
1. Studio의 `소스`에서 `URL`을 선택합니다.
2. 제품 주소를 입력합니다. `https://`를 생략해도 자동으로 보완합니다.
3. `데스크톱` 또는 `모바일` 캡처를 선택합니다.
4. `URL 캡처`를 누릅니다.
5. 캡처가 완료되면 PNG가 자동으로 현재 Canvas source가 됩니다.
6. 스타일을 선택하고 비주얼 팩을 내보냅니다.

## URL Capture 처리 방식
URL 캡처는 브라우저 로컬 기능이 아닙니다. Launchset의 Vercel Function이 서버에 보관된 Browserless API token을 사용해 원격 브라우저 캡처를 요청하고 PNG 결과만 브라우저로 반환합니다. 이후 composition 렌더링과 ZIP 생성은 다시 브라우저에서 처리합니다.

## 배포자가 먼저 설정할 것
Vercel Project Settings → Environment Variables에 다음 값을 추가합니다.

Required:
```text
BROWSERLESS_API_TOKEN=<your token>
```

Optional:
```text
BROWSERLESS_API_URL=https://production-sfo.browserless.io
```

`BROWSERLESS_API_TOKEN`에 `VITE_` prefix를 붙이지 않습니다. 토큰을 클라이언트 코드에 넣지 않습니다.

## 지원하지 않는 URL
- localhost 및 일반적인 로컬 hostname
- 사설/loopback/link-local literal IP 주소
- `.local`, `.internal`, `.lan`, `.home` 호스트
- 사용자명/비밀번호가 URL에 포함된 주소
- HTTP/HTTPS 이외의 프로토콜

## Capture limits in v1.4.0
- Desktop: 1440 × 900
- Mobile: 390 × 844
- viewport-only capture
- upstream timeout: 약 28초
- 최대 캡처 응답: 12MB
- 동일 함수 인스턴스에서 클라이언트 IP당 1분 6회 burst protection

## 아직 지원하지 않는 기능
- Brand Kit 저장
- AI Art Direction
- Motion / video export
- 프로젝트 클라우드 저장
- 인증된 사이트의 로그인 세션 캡처
