# Launchset v1.4.3 — Build Verification

## 로컬 검증 결과
- Runtime Version Consistency Gate: PASS (Node 24 설정 파일 정합성)
- `api/capture.ts` TypeScript 5.8 strict compile: PASS
- Capture API regression: PASS (14 checks)
- TS/TSX syntax parse: 14 files / 0 diagnostics
- relative imports: 0 missing
- UI text below 12px: 0
- `src/` 내 v1.4.2 문자열: 0
- `/function` endpoint 사용: 제거
- `/screenshot` endpoint 사용: 확인

## Capture regression cases
- 200 PNG Desktop
- Browserless 401
- Browserless 403 destination
- Browserless 429
- target 403
- target 404
- target 429
- target 500
- Browserless 500
- invalid content type
- timeout
- Mobile viewport
- private literal URL rejection
- missing token

## 아직 미검증
현재 실행 환경에서 npm registry 요청이 제한 시간 내 완료되지 않아 다음을 성공 처리하지 않았습니다.
- complete dependency install
- `npm run typecheck` 전체 프로젝트
- `npm run build` Vite production build
- 실제 Browserless cloud token을 사용한 live screenshot

위 항목은 GitHub Actions / Vercel Production에서 최종 확인합니다.

## package-lock 상태
`npm install --package-lock-only` 역시 현재 실행 환경에서 timeout되어 `package-lock.json`은 이번 패키지에 임의 생성하지 않았습니다. 불완전한 lockfile을 넣지 않고 기존 `npm install` 배포 흐름을 유지합니다.
