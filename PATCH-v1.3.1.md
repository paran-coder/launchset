# Launchset v1.3.1 Patch

## Fix
- Fixed Vercel/TypeScript 5.8 build failure in `src/lib/zip.ts`.
- ZIP chunk arrays are now explicitly typed as `Uint8Array<ArrayBuffer>[]`, satisfying the DOM `BlobPart` type contract.

## Root cause
TypeScript 5.8 models typed arrays with a backing-buffer generic. The previous `Uint8Array[]` annotation widened chunks to `Uint8Array<ArrayBufferLike>`, which may include `SharedArrayBuffer` and is therefore rejected by the `Blob` constructor type.

## Verification
- Focused strict TypeScript compile for `src/lib/zip.ts`: PASS.
- Full project build status is recorded separately after dependency/build verification.
