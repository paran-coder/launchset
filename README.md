# Launchset Studio v1.3.1

React + TypeScript + Vite + Tailwind CSS v4 implementation of Launchset's local-first Visual Pack MVP.

## Local development

```bash
npm install
npm run dev
```

## Production checks

```bash
npm run typecheck
npm run build
npm run preview
```

## GitHub → Vercel

This app is structured so the `app/` directory can be used as the repository root, or selected as Vercel's Root Directory if the full Launchset package is pushed to GitHub.

Vercel settings are encoded in `vercel.json`:

- Framework: Vite
- Build command: `npm run build`
- Output: `dist`
- SPA rewrite: direct routes such as `/studio` resolve to `index.html`

Node 22 is declared through `.nvmrc` and `package.json` engines.

## v1.3 core capability

- Upload PNG/JPEG/WebP locally
- Canvas 2D composition
- Four art directions
- Five responsive output artboards
- Individual PNG downloads
- Selected Visual Pack ZIP download with a dependency-free browser ZIP writer
- No backend required
