# Saathi – Wellness Friend

A modern, privacy-aware wellness web application built with React, TypeScript, and Vite. Saathi provides a responsive UI, secure authentication and account linking, and modular features for chat, meditation, and personal wellness tracking.

## Highlights
- React 18 + TypeScript + Vite 5 for fast DX and production builds
- Tailwind CSS + Radix UI + Lucide for accessible, consistent design
- State/data with TanStack Query and React Router
- Firebase for auth and verification flows (optional account linking)
- Clear separation of concerns: pages, components, services, hooks, and lib
- Production-minded configuration: strict TS, path aliases, ESLint, PostCSS

## Architecture
The app is structured into cohesive layers that isolate concerns and make the codebase easier to evolve and test.

```mermaid
flowchart TD
  UI[UI Components\n(Radix, Tailwind, Lucide)] --> Pages
  Pages[Pages & Routes\n(react-router-dom)] --> Hooks
  Hooks[Custom Hooks\n(state, side-effects)] --> Services
  Services[Service Layer\n(Firebase, APIs)] --> Lib
  Lib[Utilities & Config\n(helpers, constants)]
  Pages --> Components[Shared Components]
  subgraph Client (Vite + React + TS)
    UI
    Pages
    Components
    Hooks
    Services
    Lib
  end
```

Typical source layout under `saathi-wellness-friend/src/`:
- `pages/` – feature pages and route-level containers
- `components/` – reusable UI components (stateless where possible)
- `hooks/` – custom React hooks for data and side‑effects
- `services/` – integration boundaries (Firebase, HTTP clients)
- `lib/` – utilities, helpers, constants
- `config/` – runtime configuration and initialization code
- `types/` – shared TypeScript types and contracts

Path aliases are configured via `vite.config.ts` and `tsconfig.json` so imports under `src` can use `@/` (for example, `@/components/Button`).

## Prerequisites
- Node.js 18+
- pnpm, npm, or yarn (examples below use npm)
- A Firebase project if using authentication and verification

## Setup
1. Install dependencies:
   ```bash
   cd saathi-wellness-friend
   npm install
   ```
2. Environment variables:
   - Copy `.env.example` to `.env` and fill in values for Firebase and any APIs you use.
   - The repository is configured to ignore `.env` and other secrets. Do not commit them.

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – typecheck and build for production
- `npm run preview` – preview the production build locally
- `npm run lint` – run ESLint with strict settings

## Development notes
- UI: Tailwind CSS utilities with Radix primitives for accessibility. Keep components small and composable, prefer stateless components with explicit props.
- Data: Use TanStack Query for server state, cache, and request lifecycle. Co-locate hooks with features.
- Routing: Use React Router 6; lazy‑load routes where beneficial.
- Types: Keep `types/` as the shared contract surface. Enable strict TS and fix type errors at PR time.
- Imports: Prefer `@/` alias to avoid brittle relative paths.

## Firebase integration (optional)
- The codebase includes components for Firebase auth flows (debug helpers, verification, and account linking demos).
- Configure Firebase SDK keys via `.env`. Ensure keys are non‑secret client config; any admin/service credentials must never be committed and should live outside the client.

## Security and secrets
- Secrets such as service account JSON and `.env` are ignored and must not be committed.
- If you accidentally commit a secret, rotate the key and remove it from git history before pushing.

## Build and deployment
- Build:
  ```bash
  npm run build
  ```
  The production build is output to `saathi-wellness-friend/dist`. Serve that directory with any static host.

- Preview locally:
  ```bash
  npm run preview
  ```

- Static hosting options: GitHub Pages, Netlify, Vercel, Firebase Hosting, or any CDN that serves static assets.

## Troubleshooting
- Port in use: change Vite port with `vite --port 5174` or set `VITE_PORT`.
- Module resolution errors: ensure `@` alias is defined in both `vite.config.ts` and `tsconfig.json` (provided).
- TypeScript strict errors: prefer fixing types rather than disabling rules; adjust `types/` or generics in hooks/services.

## License
Proprietary — all rights reserved unless otherwise stated by the repository owner.
