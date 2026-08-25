# Launchset v1.4.0 — Checklist

## Development Instruction Gate
- [x] Plan explained and user approval already obtained
- [x] context-notes.md created before code changes
- [x] checklist.md created before code changes
- [x] README.md created before code changes
- [x] User manual.md created before code changes
- [x] SemVer v1.4.0 confirmed
- [x] Single-root naming rule confirmed
- [x] ui-polish rules confirmed
- [x] design-token rules confirmed
- [x] Each major phase self-reviewed and scored

## Phase 1 — Capture API
- [x] Add `/api/capture`
- [x] Validate request method/body
- [x] Normalize URL
- [x] Block unsafe/local destinations
- [x] Keep token server-side
- [x] Add desktop/mobile viewport
- [x] Add upstream timeout
- [x] Return PNG with no-store cache headers
- [x] Map upstream errors to Korean-safe API errors
- [x] Self-review and score

## Phase 2 — Studio URL Capture UI
- [x] Add upload / URL source selector
- [x] Add URL field
- [x] Add Desktop / Mobile capture selector
- [x] Add capture loading state
- [x] Add capture error state
- [x] Load returned PNG into existing SourceImage pipeline
- [x] Preserve file upload flow
- [x] Clarify local vs server-assisted privacy copy
- [x] Self-review and score

## Phase 3 — Vercel / Release QA
- [x] Update SPA rewrites so `/api/*` is not swallowed
- [x] Add env template
- [x] Add deployment instructions
- [x] Parse all TS/TSX
- [x] Typecheck standalone server function where possible
- [x] Verify ZIP writer strict compile
- [x] Scan text sizes / colors
- [x] Build release/github package
- [x] Generate checksums
- [x] Final score

## Live Production Gates
- [ ] GitHub Actions `npm run typecheck` PASS with installed dependencies
- [ ] GitHub Actions `npm run build` PASS
- [ ] Vercel `BROWSERLESS_API_TOKEN` configured
- [ ] Vercel Preview Desktop URL capture PASS
- [ ] Vercel Preview Mobile URL capture PASS
- [ ] URL capture → Visual Pack PNG / ZIP smoke test PASS
