<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes

- This is a single Next.js App Router app (Next `16.4.5`), not a workspace. Routes and root layout are under `app/`; shared UI is under `components/`; `@/*` aliases the repository root.
- Before changing Next.js APIs or conventions, read the relevant guide under `node_modules/next/dist/docs/` from this repo; do not assume standard Next.js documentation matches this installed version.
- Use `npm run dev` to develop, `npm run build` for a production build, `npm run lint` for ESLint, and `npm run typecheck` for TypeScript. There is no test script configured. `npm run format` runs Prettier write over all `*.ts` and `*.tsx` files, so avoid it for a focused change unless that broad rewrite is intended.
- Authentication is configured in `lib/auth.ts` with Better Auth and MongoDB; the auth route is `app/api/auth/[...all]/route.ts`. It reads `MONGODB_URL`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` from the environment. Menu fetches use `NEXT_PUBLIC_API_BASE_URL`, falling back to `http://localhost:8000` (`lib/api/getMenus.ts`).
