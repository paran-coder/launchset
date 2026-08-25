# Launchset v1.3.0 — GitHub → Vercel Deployment

## Recommended repository shape

Use the contents of `Launchset-v1.3.0-github/` as the GitHub repository root.

```text
launchset/
├─ .github/workflows/ci.yml
├─ src/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ vercel.json
├─ .gitignore
├─ .env.example
└─ .nvmrc
```

## GitHub

```bash
git init
git add .
git commit -m "feat: Launchset v1.3 visual pack MVP"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

## Vercel import

1. Import the GitHub repository in Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Install command: default `npm install`.
6. No environment variables are required for v1.3.0.
7. Deploy.

`vercel.json` carries the SPA rewrite so direct navigation to `/studio` resolves to `/index.html` rather than returning a 404.

## Preview deployments

Use Vercel's Git integration normally:

- `main` → Production Deployment
- pull request branches → Preview Deployments

The included GitHub Actions workflow independently runs typecheck and production build on pushes and pull requests.

## Versioning

- `v1.3.x`: local Visual Pack fixes
- `v1.4.0`: planned URL Capture boundary

Create a Git tag after a verified production deployment:

```bash
git tag v1.3.0
git push origin v1.3.0
```

## Future server features

Do not put URL capture, browser automation, AI secrets, or private API keys into `VITE_*` variables. `VITE_*` values are client-exposed at build time. Future server functionality should live behind explicit server endpoints/worker boundaries.
