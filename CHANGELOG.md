# Changelog

## v1.4.0 — URL Capture

### Added
- URL source mode in Studio alongside local screenshot upload.
- Vercel Function endpoint at `/api/capture`.
- Desktop capture viewport: 1440 × 900.
- Mobile capture viewport: 390 × 844.
- Browserless `/function` integration with the API token kept server-side.
- URL normalization and validation for HTTP/HTTPS only.
- Private/local literal hostname and IP blocking before upstream capture.
- Remote-browser request interception to block obvious local/private redirect and subresource destinations.
- 28-second upstream timeout and 12MB response limit.
- Instance-local capture rate protection: 6 requests / minute / client IP.
- Korean capture loading, success, error, and accessibility states.
- `BROWSERLESS_API_TOKEN` and optional `BROWSERLESS_API_URL` environment template.

### Changed
- Landing copy now accurately describes URL capture + local file upload.
- Privacy copy distinguishes local file processing from server-assisted URL capture.
- SPA rewrites now target `/studio` only so `/api/*` remains available to Vercel Functions.
- TypeScript project includes `api/` in type checking.
- Package versions are pinned exactly for more deterministic GitHub/Vercel installs.
- Generic UI error color changed to `#F95A70`; the reference trading-red token is no longer repurposed as a generic error color.

### Preserved from v1.3.4
- Intentional Korean semantic line breaks for the product-principle headline and final CTA.
- Korean heading balance, line-height, letter-spacing, and mobile wrapping polish.

### Validation
- `api/capture.ts` TypeScript 5.8 strict compile: PASS.
- Compiled capture-handler runtime mock: PASS.
- Browserless embedded function runtime syntax: PASS.
- Remote-browser private-literal request interception mock: PASS.
- Rate-limit runtime mock: PASS.
- 12px minimum intentional UI-text scan: PASS.
- Legacy purple-accent scan: PASS.
- Reference trading-red reuse scan: PASS.

### Deployment gate
A full Vite production build and a live Browserless capture require installed npm dependencies and a real `BROWSERLESS_API_TOKEN`. GitHub Actions and the first Vercel Preview remain the final production gates.
