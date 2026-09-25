# MU Connect

A frontend-only university community prototype for meeting students, recruiting teammates, sharing ideas, and finding competitions and campus events. It is an independent concept, not an official university product. There is no backend or real authentication.

## Tech stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Radix UI primitives, Lucide, Motion, Zustand, Faker, MSW, React Hook Form, Zod, Dexie/IndexedDB, and Sonner. Inter and Kanit are bundled locally for English and Thai text.

## Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000. Enter through the landing page or visit /home directly. The login screen accepts the sample credentials shown there or a demo role button; no credentials are sent to a server.

```bash
npm run typecheck
npm run lint
npm run build
```

With the dev server running, `npm run test:smoke` checks primary routes, browser errors, and responsive overflow on key routes at 375, 430, 768, 1024, and 1440 pixels. `npm run test:interactions` checks posts, comments, recruitment, event announcements, bookmarks, join requests, follows, messages, drafts, and profile edits across refreshes in an isolated Chrome session. These scripts use the installed Chrome executable on Windows.

## Main routes

- `/`, `/login`, `/onboarding`: introduction and demo entry
- `/home`, `/posts/[id]`: feed, publishing, comments, likes, and saves
- `/discover`, `/people`, `/profile/[username]`: filtered discovery and student profiles
- `/teams`, `/teams/[id]`: recruitment board and join requests
- `/competitions`, `/competitions/[id]`, `/events`: opportunities and event calendar
- `/communities`, `/communities/[slug]`: interest spaces
- `/saved`, `/notifications`, `/messages`, `/me`: personal activity

The app uses a desktop sidebar, a tablet/mobile top bar, and mobile bottom navigation. Cmd/Ctrl+K opens global search.

## Folder structure

```text
src/app/                 App Router route files and layouts
src/components/layout/   Responsive shell, navigation, search, route loading states
src/components/events/   Calendar view
src/components/people/   Profile editing dialog
src/components/posts/    Post creation dialog
src/components/shared/   Reusable domain cards
src/components/ui/       Radix-based interface primitives
src/features/            Feature-specific route views
src/lib/api/             Fetch client and typed service methods
src/lib/db/              Dexie schema for persistent local demo records
src/lib/mock/            Deterministic seed data grouped by domain
src/lib/validation/      Zod form schemas and parsing
src/lib/discovery.ts     Recommendation scores and discovery filters
src/mocks/handlers/      MSW HTTP request handlers
src/stores/              Zustand application state and actions
src/types/               Domain types with a barrel export
scripts/                 Browser smoke tests
```

## Mock API

`src/components/providers.tsx` starts the MSW browser worker before loading application data. Components use typed services in `src/lib/api/client.ts`; the services call relative `/api/*` URLs. MSW intercepts these requests in the browser. There are no Next.js API route handlers.

Handlers cover posts, comments, users, teams, competitions, events, communities, notifications, messages, conversations, bookmarks, and interactions. The worker file is in `public/mockServiceWorker.js`.
Event announcements created as posts are exposed on the Events board through the mock events endpoint.

## Mock data

`src/lib/mock/data.ts` is a barrel for domain seed files. Faker uses fixed seeds for students, competitions, and teams, alongside hand-written campus examples. The data provides 40 students, 60 posts, 15 teams, 12 competitions, 15 events, 9 communities, 30 notifications, and 10 conversations. The default student is Thanapon Chaiyasit. Seed content is stable; relative timestamps are calculated for the current date.

## Persistence

Dexie stores created posts and teams, bookmarks, follows, notification read status, drafts, conversations, messages, comments, and interactions in IndexedDB. Those actions survive refresh in the same browser. Interaction and message changes go through typed services and MSW handlers; the local draft service uses Dexie directly. `localStorage` holds only the demo user profile/session and onboarding completion. Seed data stays in code and is combined with local records by the MSW handlers.

Browser storage is per device and can be cleared in DevTools. There is no synchronization between users or devices.

## Add a feature

1. Add or update the relevant file in `src/types/` and export new public types from `src/types/index.ts`.
2. Add realistic seed records in the appropriate `src/lib/mock/` domain file, if useful, and export them from `data.ts`.
3. Add MSW endpoints in `src/mocks/handlers/index.ts`.
4. Add methods to a typed service in `src/lib/api/client.ts`.
5. Persist local mutations through Dexie and a Zustand action where needed.
6. Put form validation in `src/lib/validation/`, build reusable UI under `src/components/`, and add a view in `src/features/` and route in `src/app/`.
7. Run type checking, lint, build, and the smoke tests.

## Replace MSW with a real backend

Keep the service method signatures in `src/lib/api/client.ts` and point the shared request helper to a real API base URL. Remove the MSW startup from `src/components/providers.tsx` and replace local-only mutation handlers with server endpoints. Migrate Dexie records only if you want to preserve existing demo data. Real identity, authorization, privacy, moderation, and multi-user messaging are outside this prototype.

## Design notes

The interface uses university blue `#17468C`, gold `#A5812D`, and accent yellow `#FAC334` on mostly neutral surfaces. No university logo asset was present, so the brand uses a replaceable text mark. Motion handles restrained transitions; GSAP was unnecessary for this layout.
