# Launchset v1.4.2

Launchset v1.4.2는 Node.js 런타임을 **24.x**로 통일하는 배포 호환성 패치입니다.

## 이번 버전의 목적
Vercel Project Settings의 Node 24.x와 저장소 설정을 일치시켜 경고와 런타임 불일치를 제거합니다.

## 기능
v1.4.1과 동일합니다.
- 스크린샷 업로드
- URL Capture
- Desktop / Mobile Capture
- Canvas 렌더링
- Direction preset
- 5종 Visual Pack
- PNG / ZIP Export
- 한국어 UI

## Runtime
- Node.js: `24.x`
- React: 19
- Vite: 7.1.3
- Tailwind CSS: 4.3.3
- TypeScript: 5.8

## 배포
GitHub 저장소를 Vercel에 연결하는 구조를 전제로 합니다.
Vercel Project Settings에서도 Node.js를 `24.x`로 유지합니다.

## Version
`1.4.2`

## Runtime Consistency Gate

```bash
npm run check:runtime
```

이 명령은 `package.json`, `.nvmrc`, GitHub Actions의 Node major가 모두 24인지 검사합니다. Vercel Project Settings는 Node.js 24.x로 유지합니다.

## Production Verification
GitHub Actions와 Vercel Preview에서 Node 24 기반 `typecheck`와 `build`를 통과한 뒤 실제 URL Capture를 검증합니다.
