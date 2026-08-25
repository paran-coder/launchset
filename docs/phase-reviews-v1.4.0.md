# Launchset v1.4.0 — Phase Reviews

## Phase 0 — Development Instruction Gate
**Score: 10.0 / 10**

### Verified
- User-approved sequence preserved: v1.3.4 Polish → v1.4.0 URL Capture.
- Motion was not pulled forward.
- `context-notes.md`, `checklist.md`, `README.md`, `User manual.md` created before v1.4 code changes.
- SemVer and single-root naming rules preserved.

## Phase 1 — Capture API
**Initial score: 9.3 / 10**

### Initial implementation
- `/api/capture` Vercel Function.
- server-only Browserless token.
- Desktop/Mobile viewport profiles.
- URL normalization and obvious local/private URL blocking.
- timeout, image-size limit, Korean-safe error mapping.

### Self-review findings and corrections
1. Browserless binary response typing was made explicit as `image/png`.
2. Only validating the initial URL was insufficient for redirects/subresources. Remote-browser request interception was added for obvious private/local literal destinations.
3. A public capture endpoint can consume paid capture quota. Instance-local 6/min/IP burst protection was added.
4. Runtime tests were expanded from syntax-only checks to a compiled handler mock and an embedded-browser-function mock.

### Final score
**9.6 / 10**

Remaining gap: live Browserless execution and full egress/DNS-rebinding protection require deployed infrastructure and provider credentials.

## Phase 2 — Studio URL Capture UI
**Initial score: 9.4 / 10**

### Implemented
- File / URL source selector.
- URL field.
- Desktop / Mobile capture selector.
- Loading, success, error states.
- Captured PNG flows into the existing `SourceImage` and Visual Pack pipeline.
- file-upload flow preserved.
- local-vs-server processing copy corrected across landing and Studio.

### Self-review findings and corrections
1. Added `aria-busy` to capture action.
2. Added polite live status to capture success.
3. Added alert semantics to errors.
4. Removed use of the reference trading-red token for generic errors; introduced `#F95A70` with better contrast and correct semantics.
5. All user-facing fallback messages were centralized in Korean i18n.

### Final score
**9.7 / 10**

Remaining gap: final font metrics, wrapping, and network-state perception need Vercel Preview browser QA.

## Phase 3 — GitHub / Vercel Readiness
**Score: 9.4 / 10**

### Verified
- Vite project structure retained.
- Node 22 retained.
- `/studio` SPA rewrite no longer catches `/api/capture`.
- `api/` included in TypeScript project.
- exact dependency versions.
- `.env.example` contains server-only capture configuration.
- CI retains install → typecheck → build.

### Validation performed locally
- `api/capture.ts` TypeScript 5.8 strict compile: PASS.
- compiled capture-handler runtime mock: PASS.
- embedded Browserless function runtime syntax: PASS.
- private-literal request interception mock: PASS.
- rate-limit runtime mock: PASS.
- JSON configuration parsing: PASS.
- sub-12px text scan: 0.
- legacy purple scan: 0.
- trading red reuse scan: 0.

### Hard gate not claimed
The local environment has no installed React/Vite dependencies. `tsc -b` therefore fails on missing `react` / `react/jsx-runtime`, not on a verified application type error. A full `npm run build` is deliberately left for GitHub Actions and Vercel Preview.

## Overall v1.4.0
**9.6 / 10**

The product has moved from screenshot-only Static Pack generation to two-source ingestion: local screenshots or server-assisted website URL capture. Production acceptance still requires a real Browserless token and first Vercel Preview smoke test.
