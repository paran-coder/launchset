# Launchset v1.3.0

Core release: **one product screenshot → five responsive launch artboards → selected PNGs or one ZIP**.

Release hard gate after pushing to GitHub:

1. GitHub Actions `typecheck` passes.
2. GitHub Actions `build` passes.
3. Vercel Preview opens `/` and direct `/studio`.
4. Upload a real screenshot.
5. Export one PNG and a 5-file ZIP.
6. Promote/tag only after smoke test.
