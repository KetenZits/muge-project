# MU Connect V6 — implementation record

## Audit and implementation checklist

- [x] Inspect every route, store, authentication/session initialization, forms, domain cards, persistence, motion, and `/ref` images.
- [x] Unify app tokens, page headers, controls, navigation, and loading states.
- [x] Replace ten primary destinations with Home, Discover, Teams, Messages, Profile; preserve secondary routes.
- [x] Add six dashboard shortcuts and real local recommendations; preserve the feed.
- [x] Make Discover people-first with progressive filters and concise profile cards.
- [x] Add Teams browsing / led teams / requests with real filtering and recruitment.
- [x] Improve profiles, editing, activity, messages, notifications, saved items, events, competitions, communities, and details.
- [x] Redesign login using existing React Bits typography and a bounded entrance.
- [x] Measure and optimize Welcome CTA; retain expanding geometry, Drift Wall, and headline motion.
- [x] Verify types, lint, build, persistence, interactions, responsive layouts, motion, and CTA metrics.

## Audit findings

1. Ten equally weighted sidebar links plus a separate People link make discovery and personal activity hard to distinguish. Mobile adds a separate More hierarchy.
2. Home is a 60-post feed with an extra rail; there is no explanation of available tasks or central starting point.
3. Discover gives seven scopes equal priority and starts with mixed results. Profile cards devote more space to match explanations and three actions than to the person.
4. Teams has useful real filters, but no directory view for led teams or requests. The primary action says recruitment without explaining that it creates a team and post together.
5. Profile tabs, saved tabs, event categories, and segmented controls use inconsistent treatments. Activity repeats numerous full-size empty states.
6. Profile editing lacks a storage-failure catch and pending guard. Login has two equal entry paths, no visibility toggle, and three prominent demo roles ahead of the form.
7. The shared page shell is consistent but motion layers and a Home rail add rendering work without supporting the new dashboard.
8. CTA timeline mutates top/left/width/height every scrubbed frame, forcing layout in its children. A 22px backdrop blur grows to nearly the viewport. Drift Wall observes the animated container height and regenerates repeated image tracks; it writes the 3D plane transform every RAF even with no pointer changes and loops in reduced motion and hidden tabs. A separate scroll listener reads marker geometry and schedules React state.

## Existing functionality and boundaries

Next.js 16.3.6 App Router, React 19, Tailwind 4, Radix shadcn components, Motion, GSAP, local fonts, Zustand, MSW, Dexie. Routes: `/`, `/login`, `/onboarding`, `/home`, `/discover`, `/people`, `/teams`, `/teams/[id]`, `/messages`, `/profile/[username]`, `/me`, `/saved`, `/notifications`, `/competitions`, `/competitions/[id]`, `/events`, `/communities`, `/communities/[slug]`, `/posts/[id]`.

This is a frontend-only prototype. No real auth provider, protected routes, logout, account settings, membership approval, or team management backend exists. Preserve local session restoration, role previews, onboarding redirect, all persistence and security boundaries. Do not invent production authentication. Recommendations use existing local matching heuristics. Member identities are shown only when the data lists them.

## Direction

Preserve University Blue / Gold and local Inter / Kanit. Calm off-white canvas, white functional surfaces, compact navy headings, clear 44px controls. Six coordinated tinted shortcut tiles are the dashboard's distinctive navigation device. All other color has a semantic role. Five stable mobile bottom destinations, full secondary navigation in an accessible Sheet. Desktop uses the official shadcn Radix Sidebar with icon collapse and tooltips. Login echoes the Welcome Page's navy, photography, and gold serif emphasis, with no background rendering loop.

## Implemented navigation and dashboard

Primary navigation is **Home · Discover · Teams · Messages · Profile**. Desktop uses the official Radix shadcn Sidebar with icon collapse, active checks, a keyboard shortcut, and icon-mode tooltips. Mobile/tablet below 1024px use five bottom destinations and an accessible Explore campus Sheet. Secondary links retain the people directory, campus conversations, communities, competitions, events, saved items, activity, notifications, and return to login. No existing route was deleted.

| Dashboard action | Destination / operation                                                            |
| ---------------- | ---------------------------------------------------------------------------------- |
| Discover People  | `/discover?scope=People`                                                           |
| Find Teams       | `/teams`                                                                           |
| Create a Team    | Existing composer opened in Team mode, preserving draft restoration and validation |
| My Teams         | `/teams?view=mine`; teams led and a neighboring Join requests view                 |
| Messages         | `/messages`                                                                        |
| My Profile       | `/profile/[current username]`                                                      |

All six tiles are full-area semantic links or a real action button. A short, bounded React Bits entrance runs once. Supporting recommendations use the existing local matching heuristic; available recruiting teams use real capacity, deadline, and role data. Campus opportunities remain one click away. The complete feed remains at `/home?view=feed`, including sorting, search, post creation, comments, attachments, and draft workflows.

## Discover and Find Teams

Discover defaults to People. People, Teams, and All are prominent; More retains posts, competitions, events, and communities. Search and existing URL-backed refinements remain functional, including Back/Forward and contextual return links. Filters wrap at narrow widths and use a Sheet on phones. Applied filters can be removed individually. Results remain bounded with loading controls; filtering does not replay result entrances while typing.

People cards lead with identity, a primary skill, a short bio, skills, and availability. View profile is the primary action. Follow stays beside it; messaging, invitations, and the local match explanation remain available through a disclosure. The separate people directory now has bounded results and removable filters.

Teams provides Find teams, My teams (teams led), and Join requests views. Existing role, skill, faculty, work mode, competition, deadline, and sorting filters are preserved. Structured two-column cards show recruitment status, project purpose, open roles, places filled, deadline, skills, and the actual leader. View team leads; join/withdraw and bookmarking retain their original persistence and authorization rules. Team details have Overview / Skills needed / Members anchors, a concise status header, and less duplicated copy. No unsupported management or approval workflow was introduced.

## Other reviewed and improved pages

- Profiles: consistent summary, keyboard-operable shadcn tabs, section counts, and a next step for an empty personal team list.
- Profile editing: clearer validation, save/cancel actions, pending state, storage-error feedback, retained edits, and a tested successful retry.
- Messages: clear new-conversation entry, consistent layout and empty states, preserved per-conversation drafts and sending feedback; only the thread scrolls when it updates.
- Notifications: added Unread only, a useful caught-up state, and preserved mark-read, mark-all-read, and contextual navigation.
- Saved: accessible tabs with counts and a correct link back to campus posts in the relocated feed.
- Activity: more compact empty states and a two-column desktop section layout; links point to actual personal teams and profiles.
- Events, competitions, communities: shared search surfaces, page hierarchy, responsive shell, and existing category/detail handoffs preserved.
- Onboarding: main landmark added; original minimum selections, saved choices, role preview, and redirect behavior preserved.
- Post, competition, and community details: reviewed existing actions and content hierarchy; retained their working workflows and applied the shared shell, typography, surfaces, controls, and card system.

## Design foundations and motion

University Blue / Gold, locally bundled Inter / Kanit, and the independent prototype identity remain. App headings use a compact 28px / 25px hierarchy, bounded 1200px content, 16px application card corners, coordinated tinted shortcuts, and consistent 44px controls. Updated normative tokens and responsive conventions are recorded in `DESIGN.md` and `.impeccable/design.json`.

Existing shadcn Button, Card, Badge, Avatar, Dialog, Input styling, and Skeleton foundations remain. Added the official [Sidebar](https://ui.shadcn.com/docs/components/radix/sidebar), Sheet, Tooltip, Separator, and Tabs sources, adapted to the existing Radix architecture and project lint rules. No new dependency was necessary.

Added official React Bits [Animated Content](https://reactbits.dev/animations/animated-content) for short dashboard, directory, and login entrances. Reused Split Text and Blur Text on login and preserved the Welcome typography effects and Drift Wall. Blur Text now settles immediately under reduced motion. No continuous effects were added to authenticated pages.

## Login

Desktop now pairs a navy and gold brand panel, restrained animated headline, and an existing local illustrative photograph with a focused login form. Mobile prioritizes the form. Role previews remain available in a compact row. Password visibility, autocomplete, invalid-field states, a pending indicator, and an immediate duplicate-entry guard were added. Validation, session restoration, local profile handling, and onboarding/returning-user redirects are preserved. Returning to login does not falsely claim to invalidate a production session.

## Welcome CTA diagnosis and implementation

The previous timeline repeatedly animated top, left, width, height, corner radius, background color, a large shadow, and content blur. Its expanding child caused ResizeObserver-driven Drift Wall reconciliation and image-track duplication. A separate scroll listener read marker geometry and updated React state. Full-surface backdrop blur grew with the container, while decorative wall RAFs rewrote the plane and tracks even when pointer interaction was unnecessary.

The new CTA keeps final dimensions stable and animates an inset rounded clip, independent brand transforms, and opacity. Geometry is read during setup/refresh rather than each scroll frame. The frosted pill is a small independent layer with a stable 22px blur; its fade ends in `visibility:hidden` so the inactive filter is excluded. Entrance layers are released after their one-time animation. The expanding rounded shape, photographic wall, typography, Start button, and reversible scrub remain.

Decorative Drift Wall keeps the eight existing photographs and 3D arrangement. It uses CSS compositor tracks, shared image URLs, bounded repetitions, stable dimensions, and capability-aware density. Motion pauses outside the active CTA, in a hidden document, and under reduced motion. The original interactive React Bits variant is retained for any other callers. There is no new global scroll loop or per-frame React state.

The source and timeline evidence support layout/DOM churn as verified bottlenecks. Full-surface blur was also a rendering risk; these tools do not isolate physical GPU saturation. A later regression check caught the cost of an opacity-zero glass layer; the delivered version hides it after fading.

## Verification

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed, including TypeScript and all route generation.
- `npm run test:auth` — passed local entry, onboarding, refresh, Back/Forward, storage failures, blocked database upgrade, MSW failure, retry, and startup races.
- `npm run test:discovery` — passed filter capabilities, stable relevance order, deadline boundaries, source immutability, and cross-category results.
- `npm run test:persistence` — passed stable identity, non-destructive migration, custom profiles, draft restoration, and onboarding minimums.
- `npm run test:interactions` — passed publishing, comments, recruitment, bookmarks, join/withdraw requests, follows, messages, event announcements, drafts, and profile edits across refreshes.
- `npm run test:images` — passed migration, 1–5 images, ordering, drag/drop, drafts, original bytes, lightbox keyboard/swipe/focus, multiple pages, responsive layouts, quota rollback/retry, missing/corrupt images, and object-URL cleanup.
- `npm run test:ui` — passed URL state, contextual returns, validation, message drafts, requests, tabs, event handoffs, notifications, global search, tested contrast, mobile Sheet focus return, and responsive composer.
- `npm run test:smoke` — passed route rendering and responsive checks, with no browser errors.
- Full Welcome suite — passed 1440, 1024, 768, 425, 390, 375, 360, 320px; forward/reverse scenes, all talents, navbar expansion/collapse, Start navigation, reduced motion, and WebGL fallback. Desktop/phone/reduced checks were repeated after the inactive-layer correction.
- `npm run test:v6` — passed 20 views × 6 requested widths (120 combinations), named controls, no horizontal overflow, all six task targets, real Team composer, five destinations, sidebar collapse, mobile filter/campus Sheets, and profile storage failure recovery/persistence.

A fresh finish review found one material issue: shortcut caption opacity reduced three contrast ratios below 4.5:1. Removing it produced measured ratios of 5.35–7.37:1. The reviewer scored that finding resolved and returned **ship** for the caption fix; this verdict is scoped to that fix. The wider review found the supplied navigation, functional composition, material, typography, and brand direction consistent. The optional detector could not run because its local engine was not installed; source checks, screenshots, browser checks, and a separate review were used.

## Limitations

This remains a local, frontend-only demo. There is no production authentication provider, protected-route system, logout endpoint, account-settings backend, multi-user delivery, or team approval service to verify. Existing local behavior was preserved rather than inventing those capabilities. Returning to login retains local data.

Responsive emulation and CPU throttling cannot validate physical mobile GPUs, browser chrome, touch keyboards, VoiceOver/TalkBack, or sustained thermals. This is not a formal accessibility conformance audit or a Core Web Vitals certification. No heap-memory or physical GPU benchmark was available. Reduced DOM image instances are measured; memory savings in MB are not claimed. Residual animation spikes and the exact measured limits are retained below.

## Measured CTA results

Final comparison uses three 2.4-second expansion runs per viewport in headless Linux Chromium on the local development server, DPR 1. Phone/tablet emulate touch and use 4× CPU throttling; desktop uses 1×. The delivered-source run was repeated in isolation after all validation browsers and the build finished. A concurrent caption-audit run was excluded from the final comparison. These are means of per-run measurements, not physical-device FPS or a production benchmark.

| Viewport / CPU | Mean FPS, before → after | Mean run p95 frame, ms | Mean long tasks / expansion | Image instances |
| -------------- | ------------------------ | ---------------------- | --------------------------- | --------------- |
| 390×844 / 4×   | 23.9 → **54.3**          | 138.9 → 16.8           | 13.3 → 2                    | 48 → 26         |
| 768×1024 / 4×  | 22.4 → **46.9**          | 161.1 → 38.9           | 14.3 → 3.3                  | 56 → 46         |
| 1440×900 / 1×  | 43.9 → **51.7**          | 50.0 → 33.4            | 0.7 → 0                     | 48 → 46         |

| Viewport | Layout events, before → after | Layout ms   | Paint ms      | Style-update ms | Worst observed frame ms |
| -------- | ----------------------------- | ----------- | ------------- | --------------- | ----------------------- |
| 390px    | 46.3 → 15                     | 45.9 → 14.8 | 105.9 → 196.5 | 172.2 → 469.9   | 200 → 166.7             |
| 768px    | 49.7 → 14                     | 51.6 → 16.2 | 132.3 → 144.8 | 215.3 → 425.7   | 300 → 216.6             |
| 1440px   | 58.3 → 16.3                   | 17.4 → 3.6  | 40.8 → 29.1   | 97.6 → 95.6     | 283.3 → 116.7           |

Phone FPS rose about 2.3×; tablet about 2.1×. Layout and long-task work declined substantially. Paint and style-update totals increased on throttled phone/tablet runs: this is a shift in rendering work, not a universal reduction in every cost. Desktop paint cost declined. Compositor-friendly tracks and clipping provide more consistent frame pacing while retaining visible motion, but the measurements do not establish sustained 60 FPS. Occasional 150–217ms spikes remain under 4× throttling. No frozen-frame-free or physical-device guarantee is claimed.

Raw evidence: [before](verification/cta-before.json), [after](verification/cta-after.json), [120 responsive combinations](verification/v6-validation.json), [caption contrast](verification/shortcut-contrast.json). Long-task totals, paint counts, per-run frame spikes, and all nine before/after samples are retained there. Layout, paint, and style event durations are category totals and should not be added as if they were disjoint wall-clock measurements.

## All modified and added files

### Application source

- [`src/app/globals.css`](../src/app/globals.css)
- [`src/components/AnimatedContent.tsx`](../src/components/AnimatedContent.tsx)
- [`src/components/BlurText.tsx`](../src/components/BlurText.tsx)
- [`src/components/DriftWall.tsx`](../src/components/DriftWall.tsx)
- [`src/components/layout/app-shell.tsx`](../src/components/layout/app-shell.tsx)
- [`src/components/layout/navigation.tsx`](../src/components/layout/navigation.tsx)
- [`src/components/layout/page-loading.tsx`](../src/components/layout/page-loading.tsx)
- [`src/components/people/edit-profile-dialog.tsx`](../src/components/people/edit-profile-dialog.tsx)
- [`src/components/shared/cards/person-card.tsx`](../src/components/shared/cards/person-card.tsx)
- [`src/components/shared/cards/team-card.tsx`](../src/components/shared/cards/team-card.tsx)
- [`src/components/ui/index.tsx`](../src/components/ui/index.tsx)
- [`src/components/ui/separator.tsx`](../src/components/ui/separator.tsx)
- [`src/components/ui/sheet.tsx`](../src/components/ui/sheet.tsx)
- [`src/components/ui/sidebar.tsx`](../src/components/ui/sidebar.tsx)
- [`src/components/ui/tabs.tsx`](../src/components/ui/tabs.tsx)
- [`src/components/ui/tooltip.tsx`](../src/components/ui/tooltip.tsx)
- [`src/components/welcome/welcome-navbar.tsx`](../src/components/welcome/welcome-navbar.tsx)
- [`src/components/welcome/welcome.css`](../src/components/welcome/welcome.css)
- [`src/features/auth-views.tsx`](../src/features/auth-views.tsx)
- [`src/features/communities-view.tsx`](../src/features/communities-view.tsx)
- [`src/features/competitions-view.tsx`](../src/features/competitions-view.tsx)
- [`src/features/discover-view.tsx`](../src/features/discover-view.tsx)
- [`src/features/events-view.tsx`](../src/features/events-view.tsx)
- [`src/features/home-feed.tsx`](../src/features/home-feed.tsx)
- [`src/features/home-view.tsx`](../src/features/home-view.tsx)
- [`src/features/me-view.tsx`](../src/features/me-view.tsx)
- [`src/features/messages-view.tsx`](../src/features/messages-view.tsx)
- [`src/features/notifications-view.tsx`](../src/features/notifications-view.tsx)
- [`src/features/people-view.tsx`](../src/features/people-view.tsx)
- [`src/features/profile-view.tsx`](../src/features/profile-view.tsx)
- [`src/features/saved-view.tsx`](../src/features/saved-view.tsx)
- [`src/features/shared-controls.tsx`](../src/features/shared-controls.tsx)
- [`src/features/team-detail-view.tsx`](../src/features/team-detail-view.tsx)
- [`src/features/teams-view.tsx`](../src/features/teams-view.tsx)
- [`src/hooks/use-mobile.ts`](../src/hooks/use-mobile.ts)

### Verification and configuration

- [`.gitignore`](../.gitignore)
- [`package.json`](../package.json)
- [`scripts/auth-regressions.mjs`](../scripts/auth-regressions.mjs)
- [`scripts/browser.mjs`](../scripts/browser.mjs)
- [`scripts/cta-performance.mjs`](../scripts/cta-performance.mjs)
- [`scripts/image-attachments.mjs`](../scripts/image-attachments.mjs)
- [`scripts/interaction-smoke.mjs`](../scripts/interaction-smoke.mjs)
- [`scripts/persistence-regressions.mjs`](../scripts/persistence-regressions.mjs)
- [`scripts/smoke.mjs`](../scripts/smoke.mjs)
- [`scripts/ui-regressions.mjs`](../scripts/ui-regressions.mjs)
- [`scripts/v6-verify.mjs`](../scripts/v6-verify.mjs)
- [`scripts/welcome-smoke.mjs`](../scripts/welcome-smoke.mjs)

### Updated recorded UI captures and validation

- [`.impeccable/implementation/screenshots/communities-1440.png`](../.impeccable/implementation/screenshots/communities-1440.png)
- [`.impeccable/implementation/screenshots/communities-375.png`](../.impeccable/implementation/screenshots/communities-375.png)
- [`.impeccable/implementation/screenshots/competitions-1440.png`](../.impeccable/implementation/screenshots/competitions-1440.png)
- [`.impeccable/implementation/screenshots/competitions-375.png`](../.impeccable/implementation/screenshots/competitions-375.png)
- [`.impeccable/implementation/screenshots/composer-1440.png`](../.impeccable/implementation/screenshots/composer-1440.png)
- [`.impeccable/implementation/screenshots/composer-375.png`](../.impeccable/implementation/screenshots/composer-375.png)
- [`.impeccable/implementation/screenshots/discover-1440.png`](../.impeccable/implementation/screenshots/discover-1440.png)
- [`.impeccable/implementation/screenshots/discover-375.png`](../.impeccable/implementation/screenshots/discover-375.png)
- [`.impeccable/implementation/screenshots/home-1440.png`](../.impeccable/implementation/screenshots/home-1440.png)
- [`.impeccable/implementation/screenshots/home-375.png`](../.impeccable/implementation/screenshots/home-375.png)
- [`.impeccable/implementation/screenshots/messages-1440.png`](../.impeccable/implementation/screenshots/messages-1440.png)
- [`.impeccable/implementation/screenshots/messages-375.png`](../.impeccable/implementation/screenshots/messages-375.png)
- [`.impeccable/implementation/screenshots/profile-tester-1440.png`](../.impeccable/implementation/screenshots/profile-tester-1440.png)
- [`.impeccable/implementation/screenshots/profile-tester-375.png`](../.impeccable/implementation/screenshots/profile-tester-375.png)
- [`.impeccable/implementation/screenshots/teams-1440.png`](../.impeccable/implementation/screenshots/teams-1440.png)
- [`.impeccable/implementation/screenshots/teams-375.png`](../.impeccable/implementation/screenshots/teams-375.png)
- [`.impeccable/implementation/ui-validation.json`](../.impeccable/implementation/ui-validation.json)

### Documentation and evidence

- [`.impeccable/design.json`](../.impeccable/design.json)
- [`DESIGN.md`](../DESIGN.md)
- [`README.md`](../README.md)
- [`docs/MU-CONNECT-V6.md`](../docs/MU-CONNECT-V6.md)
- [`docs/verification/cta-after.json`](../docs/verification/cta-after.json)
- [`docs/verification/cta-before.json`](../docs/verification/cta-before.json)
- [`docs/verification/cta-summary.json`](../docs/verification/cta-summary.json)
- [`docs/verification/design-review.md`](../docs/verification/design-review.md)
- [`docs/verification/shortcut-contrast.json`](../docs/verification/shortcut-contrast.json)
- [`docs/verification/v6-validation.json`](../docs/verification/v6-validation.json)
