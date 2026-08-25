# Launchset v1.4.3 — User Manual

## 파일로 시작하기
1. Studio에서 `파일`을 선택합니다.
2. PNG / JPEG / WebP 이미지를 업로드합니다.
3. 비주얼 스타일과 세부 설정을 조정합니다.
4. Visual Pack에서 결과물을 선택하고 PNG 또는 ZIP으로 내보냅니다.

## URL로 시작하기
1. Studio에서 `URL`을 선택합니다.
2. 공개 HTTP/HTTPS 주소를 입력합니다.
3. `데스크톱` 또는 `모바일`을 선택합니다.
4. `URL 캡처`를 누릅니다.
5. 캡처가 성공하면 해당 PNG가 Launchset source로 자동 적용됩니다.
6. 이후 편집과 Visual Pack Export는 파일 업로드와 동일합니다.

## URL Capture 오류 안내
- 인증 설정 오류: Browserless API token 설정을 확인합니다.
- 사용량 제한: 잠시 뒤 다시 시도하거나 Browserless 사용량을 확인합니다.
- 대상 사이트 / 캡처 실패: 해당 사이트가 자동 브라우저 접근을 제한했거나 페이지 로딩에 실패한 경우입니다.
- Browserless 서버 오류: 잠시 후 다시 시도합니다.
- 시간 초과 / 네트워크 오류: 대상 사이트나 원격 브라우저 연결 상태를 확인합니다.

## Vercel 환경변수
`BROWSERLESS_API_TOKEN`은 Production과 Preview에 Secret으로 저장합니다.

## Production 테스트 순서
1. `https://example.com` Desktop
2. `https://example.com` Mobile
3. 실제 제품 사이트
4. Visual Pack
5. 개별 PNG
6. ZIP

## Version
`1.4.3`

## 오류 범주 표시
Studio는 URL Capture 오류를 한 문장으로 합치지 않고 다음 범주를 표시합니다.
- Browserless 인증
- Browserless 사용량 제한
- Browserless 접근 정책
- 대상 사이트 접근 제한
- 대상 페이지 없음
- 대상 사이트 요청 제한
- 대상 사이트 서버 오류
- Browserless 서버 오류
- 캡처 시간 초과
- 캡처 네트워크 오류
