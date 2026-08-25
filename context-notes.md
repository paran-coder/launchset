# Launchset v1.4.3 — Context Notes

## 목적
v1.4.2 Production에서 `example.com`까지 URL Capture가 실패하는 문제를 수정하는 Capture Hotfix입니다.

## 확인된 현상
- Vercel Production 배포 정상
- `BROWSERLESS_API_TOKEN` Production + Preview 등록 완료
- URL Capture 요청은 실행됨
- `wavesstay.sixshop.site` 실패
- 대조군 `https://example.com`도 실패
- 따라서 대상 사이트 단독 문제가 아니라 Launchset ↔ Browserless 연동 계층을 우선 수정해야 함

## 승인된 변경 범위
1. Browserless `/function` 중심 캡처를 `/screenshot` REST API 중심으로 단순화
2. 인증 실패 / 사용량 제한 / 대상 사이트·캡처 실패 / Browserless 서버 오류 / 네트워크·타임아웃을 구분
3. Studio에서 오류 유형별 한국어 메시지 제공
4. URL 탭 선택 시 source 상태 문구를 실제 상태와 맞게 수정
5. `example.com` Desktop 성공을 v1.4.3의 핵심 Production Gate로 고정
6. 이후 Mobile → Sixshop → Visual Pack → PNG → ZIP 순서로 검증
7. 이 Gate가 끝나기 전 v1.5.0 Brand System은 시작하지 않음

## 보안 원칙
- Browserless token은 Vercel server environment에서만 사용
- 클라이언트에 token 노출 금지
- HTTP/HTTPS 외 URL 차단
- localhost / private literal IP 차단 유지
- 캡처 결과 최대 크기 제한 유지
- rate limit 유지
- 에러 상세 원문은 사용자에게 노출하지 않음

## 프로젝트 규칙
- 단일 프로젝트 루트: `Launchset-v1.4.3`
- GitHub 배포 산출물: `release/github/`
- GitHub ZIP: `release/Launchset-v1.4.3-github.zip`
- 전체 ZIP: `release/Launchset-v1.4.3-full.zip`

## 기술 기준
- Node.js 24.x
- React 19
- Vite 7.1.3
- Tailwind CSS 4.3.3
- TypeScript 5.8.3
- GitHub → Vercel
- URL Capture: Vercel Function → Browserless `/screenshot`

## 완료 조건
v1.4.3은 실제 Vercel Production에서 `https://example.com` 캡처가 성공하기 전까지 Production Verified로 표시하지 않습니다.
