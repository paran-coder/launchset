# Launchset v1.4.0 — Context Notes

## Goal
Add URL Capture while preserving the v1.3.4 Korean UI polish and GitHub → Vercel deployment model.

## User-approved sequence
1. v1.3.4 Korean UI Polish
2. v1.4.0 URL Capture
3. Motion remains in the originally planned later phase

## URL Capture architecture
- Frontend: URL input in Studio source panel
- Backend: Vercel Function at `/api/capture`
- Remote browser: Browserless REST `/function` API
- API token: server-side environment variable only
- Frontend receives PNG binary and converts it to existing `SourceImage`

## Environment variables
- `BROWSERLESS_API_TOKEN` — required for URL capture
- `BROWSERLESS_API_URL` — optional, defaults to `https://production-sfo.browserless.io`

## Security rules
- Accept only `http:` and `https:` URLs
- Reject credentials embedded in URLs
- Reject localhost, `.local`, `.internal`, loopback, link-local, private IPv4 literals and obvious IPv6 local forms
- Do not expose Browserless token to the browser
- Enforce capture timeout and image-size ceiling
- No arbitrary script input from the client

## Capture presets
- Desktop: 1440 × 900
- Mobile: 390 × 844
- Capture viewport only, not full page
- Animations/transitions suppressed before capture

## UI principles
- File upload remains available
- URL Capture is a second source method, not a separate product mode
- Capture state must expose: idle / validating / capturing / success / error
- User should understand that URL Capture is server-assisted while file upload remains local

## Versioning and release
Single project root: `Launchset-v1.4.0`
GitHub deployment files: `release/github/`
