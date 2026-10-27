# MU Connect

A frontend-only university community prototype for meeting students, recruiting teammates, sharing ideas, and finding competitions and campus events. It is an independent concept, not an official university product. There is no backend or real authentication.

## Tech stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Radix UI primitives, Lucide, Motion, GSAP, React Bits, Three.js, React Three Fiber, Zustand, Faker, MSW, React Hook Form, Zod, Dexie/IndexedDB, and Sonner. Inter and Kanit are bundled locally for English and Thai text.

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

`npm run test:motion` checks the welcome page at 1440, 1024, 768, 425, 390, 375, 360, and 320 pixels. It verifies the GLB request, animated Galaxy, Light Rays, and emblem canvases, the 6/5/3 responsive collage and clear wordmark, pinned hero fade and reverse, folder interaction, all six talent categories, a stationary desktop profile frame with crossfading content, mobile switching without document movement, navbar expansion and collapse, reduced motion, WebGL fallback, and navigation through the final Start button. Screenshots are written to the system temporary directory.

`npm run test:auth` checks profile restoration and startup states, Strict Mode replay, blocked database upgrades, storage and MSW failures, Retry, entering before data loads, onboarding completion, and browser navigation. It uses isolated storage and never opens an existing browser profile. Set `BASE_URL` to test a different local server.

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
src/components/motion/   Reusable entrance and reveal component
src/components/welcome/  Welcome hero, emblem, folders, talent showcase, and transforming navbar
src/components/         Installed React Bits source: Galaxy, LightRays, Folder, DriftWall, SplitText, GradientText, ScrollReveal, BlurText
src/data/               Editable welcome talent/benefit data and Drift Wall JSON
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
src/lib/motion/         Shared motion timing and card behavior
src/mocks/handlers/      MSW HTTP request handlers
src/stores/              Zustand application state and actions
src/types/               Domain types with a barrel export
scripts/                 Browser smoke tests
```

## Mock API

`src/components/providers.tsx` restores the local demo profile independently of campus data. Profile restoration has explicit initializing, ready, and error states, with Retry when browser storage cannot be accessed. The store shares one data startup attempt across Strict Mode effect replays: start MSW, open IndexedDB, then request campus data. Components use typed services in `src/lib/api/client.ts`; the services call relative `/api/*` URLs. MSW intercepts these requests in the browser. There are no Next.js API route handlers.

If another tab blocks a database upgrade, login remains usable and explains which tabs to close before retrying campus data. One native database open stays pending until the blocker releases it; retries do not create competing upgrades or reset data. Failed MSW startup is stopped and can be retried. A data refresh never replaces a newer profile edit.

Handlers cover posts, comments, users, teams, competitions, events, communities, notifications, messages, conversations, bookmarks, and interactions. The worker file is in `public/mockServiceWorker.js`.
Event announcements created as posts are exposed on the Events board through the mock events endpoint.

## Mock data

`src/lib/mock/data.ts` is a barrel for domain seed files. Faker uses fixed seeds for students, competitions, and teams, alongside hand-written campus examples. The data provides 40 students, 60 posts, 15 teams, 12 competitions, 15 events, 9 communities, 30 notifications, and 10 conversations. The default student is Tester (`tester`, `user@gmail.com`), a Demo Student in Information Technology, Year 1. The stable `u0` ID preserves existing authorship and conversations. Only the exact untouched former seed profile is migrated; customized profiles remain intact. Seed content is stable; relative timestamps are calculated for the current date.

## Persistence

Dexie stores created posts and teams, bookmarks, follows, notification read status, drafts, conversations, messages, comments, and interactions in IndexedDB. Those actions survive refresh in the same browser. Interaction and message changes go through typed services and MSW handlers; the local draft service uses Dexie directly. `localStorage` holds only the demo user profile/session and onboarding completion. Seed data stays in code and is combined with local records by the MSW handlers.

Browser storage is per device and can be cleared in DevTools. There is no synchronization between users or devices.

## Post image attachments

Create Post supports JPEG, PNG, and WebP files through **Add Photos**, the native multi-file picker, or drag and drop. Attach up to five photos, each original no larger than 8 MB. File signatures, MIME types, and browser decoding are checked; damaged, disguised, unsupported, empty, and oversized files are rejected individually without clearing valid selections. Images above 40 megapixels are rejected to limit decoding memory. Large photos are resized to at most 2560 pixels on the longest edge and encoded as WebP at 86% quality when this reduces their size. Smaller photos retain their original bytes. Photos can be removed or reordered using the drag grip or accessible earlier/later buttons.

Text-only publishing keeps the existing title and description requirements. General image posts may have an optional title and caption (an omitted title becomes “Photos from campus”). Recruitment and event announcements keep their existing required text and dynamic fields. Save Draft stores the complete form and photos; closing an edited composer also saves a draft. Reopening restores photo order and previews. **Discard draft** removes its stored attachments. A failed save or publish keeps the composer open with its text and photos for retry.

Dexie schema **v3** adds only the `postImages` table; existing v1/v2 data is preserved. Posts and drafts hold ordered `imageIds`. Each image record contains a Blob, stable ID, MIME type, filename, stored byte size, dimensions, creation timestamp, position, and an owner (`post:<id>` or `draft:<id>`). The image repository resolves Blobs; a shared reference-counted object URL hook creates temporary display URLs and revokes them when their last thumbnail/viewer unmounts. No binary images or `blob:` URLs are stored in localStorage or post JSON.

The post service sends attachment metadata and binary FormData to the existing **MSW-intercepted** `POST /api/posts`; it also continues to accept the original JSON post contract. No upload server, cloud storage, or Next.js API routes are involved. The handler calls the repository to atomically save the post, images, optional recruitment, and remove the consumed draft. Retries use the same post ID. Failed transactions leave existing drafts intact and no orphan photos. Draft replacements and deletion also use transactions. API responses contain serializable post metadata and image IDs only. `CreatePostOptions` and the image repository isolate binary persistence for a future backend adapter.

The shared gallery renders one to five images in the feed, details, profile posts, My Posts, saved posts, and matching community feeds. It uses bounded grids, natural image proportions, lazy decoding, and graceful missing-image placeholders. Click or keyboard-activate a photo to open the full-screen, focus-trapped Radix gallery. Use previous/next buttons, arrow keys, or a horizontal touch swipe; Escape closes it and restores focus to the photo. Reduced motion is respected.

**Local-only limitation:** photos exist solely in this browser profile for this site origin. A shared post link does not transfer its photos to another browser, device, or student. Clearing site data deletes local posts, drafts, and images. Storage quota or disabled browser storage may prevent saving; the composer reports the error and retains unsaved content. This application has no post-edit or post-delete UI; this feature does not introduce those unrelated workflows.

With the app running, `npm run test:images` exercises uploads, validation, keyboard and pointer reordering, drafts, refresh and navigation, API compatibility, gallery focus/keyboard/swipe behavior, storage rollback, v2 migration, missing/corrupt records, object URL cleanup, and layouts at 375, 430, 768, 1024, and 1440 pixels in isolated Chrome contexts. Set `BASE_URL` or `CHROME_PATH` to override the local server or Chrome location. Screenshots are saved under `.next/image-test-artifacts/`.

### Image attachment implementation files

Created:

- `src/components/posts/local-post-image.tsx`, `post-image-uploader.tsx`, `post-image-grid.tsx`, `post-image-lightbox.tsx`: local image rendering, selection/previews, gallery, viewer.
- `src/lib/images/prepare-image.ts`, `use-object-url.ts`, `use-post-images.ts`: validation/optimization and image resource lifetimes.
- `src/lib/db/image-repository.ts`, `post-repository.ts`, `storage-error.ts`: normalized binary storage, atomic publishing, readable storage errors.
- `src/lib/validation/post-images.ts`, `post-payload.ts`: attachment and serializable API schemas.
- `scripts/image-attachments.mjs`: browser acceptance and persistence tests.

Modified:

- `src/components/posts/create-post-modal.tsx`: form integration, draft recovery, save/discard, submission guards.
- `src/components/shared/cards/post-card.tsx`, `src/features/post-detail-view.tsx`: shared gallery integration across all existing post surfaces.
- `src/lib/db/index.ts`, `src/lib/db/draft-service.ts`: additive schema migration and transactional image drafts.
- `src/lib/api/client.ts`, `src/mocks/handlers/index.ts`, `src/stores/app.ts`: binary mock requests and persisted post/recruitment state.
- `src/lib/validation/create-post.ts`, `src/types/post.ts`, `src/types/index.ts`: form rules, image types, stable post/draft references.
- `package.json`, `README.md`: test command and feature documentation.

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

The interface uses university blue `#17468C`, gold `#A5812D`, and accent yellow `#FAC334` on mostly neutral surfaces. The welcome hero deepens these colors into a navy-to-royal-blue gradient. It renders the provided emblem from `public/models/mu-emblem.glb`, preserving its materials. Its entrance, gentle floating and Y rotation, desktop pointer response, soft light pulse, hemisphere fill, and slightly raised renderer exposure use separate animation and lighting layers. A frosted floating navbar expands into the final call to action. GSAP ScrollTrigger pins the desktop hero and benefits during reversible scene crossfades, scatters the collage, and selects talent categories as the reader scrolls. Meet the Makers uses a stationary two-column layout on desktop; scroll progress changes only the active profile, whose content crossfades inside a persistent card frame. The sidebar reveals while the first profile is active. The collage uses 6 larger images on desktop, 5 on tablet, and 3 on mobile, with slower independent ambient movement. Mobile keeps normal scrolling and uses a horizontally contained talent selector. The React Bits Galaxy, Light Rays, Folder, Drift Wall, Split Text, Gradient Text, Scroll Reveal, and Blur Text components live in `src/components/`. Galaxy runs only on wide screens with reduced layers and pixel density; CSS stars provide a lighter mobile atmosphere. The emblem and rays pause or reduce offscreen work. Reduced motion disables continuous effects and scroll choreography while keeping content and controls available. Browsers without WebGL keep the atmospheric hero and readable content without a blocking logo splash.

Welcome content is intentionally easy to change: edit `src/data/welcome.ts` for benefit folders, collage images, and the six fictional example talent profiles (Programming, Design, Marketing, Pitching, AI & Data, Robotics). Edit `src/data/drift-wall-images.json` for the final image wall. The Welcome Page now uses locally optimized WebP photographs under `public/images/welcome/photo-*.webp`, with original photo-page links, photographer names, and the [Unsplash License](https://unsplash.com/license) recorded in `src/data/welcome-photo-sources.json`. Use `node scripts/fetch-welcome-photos.mjs` to refresh those photographs. The photographed subjects are not the fictional profile characters or MU CONNECT members; the cards say so explicitly. Previous generated illustration files remain in the repository but are no longer referenced by the Welcome Page. This is an independent prototype and does not claim to be an official university website.
