# MU Connect

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Mahidol University students who want to discover people with similar interests and find collaborators across faculties. Their primary jobs are finding teammates for competitions, hackathons, research, projects, and university activities.

Students are the primary audience. The existing organizer and admin choices are demo role previews, not evidence of implemented authorization or separate production workflows.

## Product Purpose

Help students turn shared interests and complementary skills into connections and collaborative activity at Mahidol University.

Success means a student can discover relevant people or opportunities, understand a potential collaborator or team's needs, and take a clear next step such as following, messaging, or requesting to join a team.

## Positioning

A Mahidol-focused community that connects student profiles, interests, skills, availability, team recruitment, and campus opportunities in one place. Discovery supports finding collaborators for a concrete activity as well as meeting people with shared interests.

Current recommendations use local matching heuristics. They are not validated compatibility predictions or evidence of real student outcomes.

## Operating Context

- Students use a responsive website on desktop, tablet, and mobile browsers; mobile web remains the platform.
- The main workflows are exploring the feed, discovering people and opportunities, reviewing profiles, finding or recruiting teammates, joining interest communities, and continuing conversations.
- Demo entry and onboarding establish a local profile with interests and skills. The current interface contains English and Thai content.
- Saved items, notifications, messages, drafts, and profile activity help students return to their local demo activity.

## Capabilities and Constraints

- Preserve the existing frontend-only architecture: Next.js App Router, React, TypeScript, MSW browser interception, Zustand state, and Dexie/IndexedDB persistence. There is no real backend or authentication service.
- Current capabilities include posts and photo attachments, comments, likes, bookmarks, people and team discovery, recruitment and join requests, competitions, events, communities, follows, messaging, notifications, drafts, and profile editing.
- Activity is local to a browser profile and site origin. IndexedDB holds persistent demo records and images; localStorage holds the demo session/profile and onboarding state. There is no synchronization or real communication between different users or devices.
- Preserve existing functionality and data, including compatibility with stored demo records. Future UI/UX work should refine the existing application rather than rebuild it by default.
- The long-term goal is a real multi-user university community platform. This is a future direction, not authorization to introduce a backend into the current prototype.
- Production backend, identity and permissions, moderation, privacy policies, hosting, and launch timing remain undecided in this record.

## Brand Commitments

- Retain the name **MU Connect** and its Mahidol University student focus.
- Maintain **University Blue `#17468C`** and **Gold `#A5812D`**.
- Prioritize a clean, intuitive interface with clear visual hierarchy and navigation. Reduce visual clutter and unnecessary nested cards.
- Subtle semantic accent colors may distinguish sections while preserving the blue and gold identity.
- Preserve the independent-concept status. Do not imply official university affiliation, endorsement, or approval.
- The current mark is a replaceable text mark; the repository does not contain an official university logo asset.

## Evidence on Hand

- `README.md` documents the current prototype, route map, architecture, persistence, and feature limitations.
- `src/features/` and `src/components/` contain the existing application and its user-facing workflows.
- `src/lib/discovery.ts` contains the implemented discovery filters and matching heuristics.
- `src/lib/mock/` contains seeded demonstration students, posts, teams, competitions, events, communities, notifications, and conversations. These are sample content, not verified people, live opportunities, or adoption evidence.
- `scripts/` contains browser checks for routes, interactions, image attachments, responsive behavior, and motion. These support implementation verification, not claims of a formal accessibility audit or production readiness.
- No verified testimonials, customer outcomes, adoption metrics, or official university endorsement have been established. Do not invent them or present sample records as proof.

## Product Principles

1. Help students find relevant people and take a concrete next step toward collaboration.
2. Make people, team needs, and opportunities easy to scan and navigate with minimal clutter.
3. Refine the existing experience while preserving its functionality and stored data.
4. Keep prototype behavior and claims truthful, including the limits of local demo activity.
5. Treat accessibility, smooth rendering, and frontend performance as core product quality.

## Accessibility & Inclusion

- Prioritize an accessible experience across desktop, tablet, and mobile browsers.
- Preserve and improve keyboard operation, visible focus, meaningful labels, readable contrast, and reduced-motion behavior as UI work proceeds.
- Preserve support for English and Thai text. A complete localization strategy and a formal accessibility conformance target have not been specified.
