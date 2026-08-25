# Launchset v1.4.0 — Final QA

## Functional
- [x] File upload remains available.
- [x] URL source mode exists.
- [x] Desktop/Mobile profiles exist.
- [x] Successful capture is converted into existing SourceImage.
- [x] Existing Visual Pack can consume URL-captured source.
- [x] Korean loading/error/success states exist.
- [x] v1.3.4 intentional Korean headline wrapping retained.

## Capture API
- [x] POST-only API.
- [x] HTTP/HTTPS normalization.
- [x] user-info URL rejection.
- [x] obvious local/private literal address blocking.
- [x] remote-browser request interception.
- [x] 28s bounded upstream request.
- [x] 12MB response limit.
- [x] no-store + nosniff response headers.
- [x] local burst rate protection.
- [x] Browserless token stays server-side.

## Accessibility / UI
- [x] no intentional text under 12px.
- [x] capture button exposes busy state.
- [x] capture errors use alert semantics.
- [x] success uses polite live status.
- [x] generic error color is not the reference trading red.
- [x] existing near-black + yellow token direction retained.

## Code / Config
- [x] `api/capture.ts` strict TypeScript compile PASS.
- [x] compiled capture-handler runtime mock PASS.
- [x] embedded Browserless function runtime syntax PASS.
- [x] private request interception mock PASS.
- [x] rate-limit mock PASS.
- [x] package / tsconfig / vercel JSON PASS.
- [x] `/studio` rewrite does not intentionally mask `/api/*`.

## Deployment Gates
- [ ] `npm install` with registry access.
- [ ] `npm run typecheck` with actual React/Vite dependencies installed.
- [ ] `npm run build` production PASS.
- [ ] Vercel `BROWSERLESS_API_TOKEN` configured.
- [ ] Live Desktop URL capture.
- [ ] Live Mobile URL capture.
- [ ] Live capture → Visual Pack PNG/ZIP smoke test.

## Final assessment
**9.6 / 10 before live deployment gate.**

Do not label v1.4.0 production-verified until the unchecked deployment gates pass on GitHub Actions/Vercel.
