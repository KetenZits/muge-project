---
name: "MU Connect"
description: "The Campus Commons: the V6 application system with preserved University Blue and Gold."
colors:
  "primary": "#17468C"
  "primary-hover": "#0F3672"
  "gold": "#A5812D"
  "yellow": "#FAC334"
  "yellow-hover": "#EEB622"
  "on-yellow": "#4C390C"
  "canvas": "#F6F8FB"
  "soft": "#F5F8FC"
  "surface": "#FFFFFF"
  "surface-soft": "#F8FAFD"
  "ink": "#17263C"
  "muted-text": "#617187"
  "border": "#E5EBF2"
  "input-border": "#8091A5"
  "input-placeholder": "#617187"
  "primary-tint": "#EAF1FC"
  "gold-tint": "#FBF3DA"
  "gold-ink": "#765514"
  "chip-surface": "#F0F4F9"
  "chip-ink": "#53647C"
  "success": "#19694B"
  "success-tint": "#E8F6EF"
  "rose": "#9B443E"
  "rose-tint": "#FDF0EF"
  "error": "oklch(0.577 0.245 27.325)"
  "discover": "#4845A5"
  "discover-tint": "#EFEFFB"
  "teams": "#75409A"
  "teams-tint": "#F5EEF9"
  "competitions": "#805D15"
  "competitions-tint": "#FBF3DA"
  "communities": "#146D67"
  "communities-tint": "#E8F5F2"
  "events": "#A34337"
  "events-tint": "#FDF0EC"
  "messages": "#146A91"
  "messages-tint": "#EAF5FC"
  "shortcut-blue": "#214C8A"
  "shortcut-blue-tint": "#E8EFFB"
  "shortcut-purple": "#63458B"
  "shortcut-purple-tint": "#EFEAFA"
  "shortcut-green": "#266047"
  "shortcut-green-tint": "#E5F2EA"
  "shortcut-orange": "#845526"
  "shortcut-orange-tint": "#FBEFDF"
  "shortcut-pink": "#904A68"
  "shortcut-pink-tint": "#F8EAF0"
  "shortcut-cyan": "#2C6573"
  "shortcut-cyan-tint": "#E4F1F4"
  "welcome-navy": "#071E40"
  "welcome-ink": "#102B52"
  "welcome-gold-light": "#F6D184"
typography:
  "headline":
    fontFamily: "Inter, Kanit, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  "headline-compact":
    fontFamily: "Inter, Kanit, Arial, sans-serif"
    fontSize: "25px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  "title":
    fontFamily: "Inter, Kanit, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    letterSpacing: "-0.025em"
  "body":
    fontFamily: "Inter, Kanit, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  "body-small":
    fontFamily: "Inter, Kanit, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  "body-relaxed":
    fontFamily: "Inter, Kanit, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "24px"
  "label":
    fontFamily: "Inter, Kanit, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  "caption":
    fontFamily: "Inter, Kanit, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  "thai":
    fontFamily: "Kanit, Inter, sans-serif"
  "welcome-display":
    fontFamily: "Inter, Kanit, Arial, sans-serif"
    fontSize: "clamp(48px, 7.2vw, 116px)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.075em"
  "welcome-emphasis":
    fontFamily: "Georgia, Times New Roman, serif"
    fontWeight: 400
    letterSpacing: "-0.06em"
rounded:
  "md": "0.72rem"
  "lg": "0.9rem"
  "xl": "1.26rem"
  "2xl": "1.62rem"
  "card": "16px"
  "legacy-card": "20px"
  "soft-card": "16px"
  "nav": "12px"
  "tab": "10px"
  "dialog": "22px"
  "full": "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "7": "28px"
  "8": "32px"
  "9": "36px"
components:
  "button-primary":
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  "button-primary-hover":
    backgroundColor: "{colors.primary-hover}"
  "button-secondary":
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  "button-ghost":
    backgroundColor: "transparent"
    textColor: "#60728A"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  "button-gold":
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.on-yellow}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  "button-gold-hover":
    backgroundColor: "{colors.yellow-hover}"
  "input":
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  "directory-search":
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "0 16px 0 44px"
    height: "52px"
  "card":
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px"
  "soft-card":
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.soft-card}"
  "chip-neutral":
    backgroundColor: "{colors.chip-surface}"
    textColor: "{colors.chip-ink}"
    rounded: "{rounded.full}"
    padding: "5px 10px"
  "chip-blue":
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "5px 10px"
  "chip-gold":
    backgroundColor: "{colors.gold-tint}"
    textColor: "{colors.gold-ink}"
    rounded: "{rounded.full}"
    padding: "5px 10px"
  "chip-green":
    backgroundColor: "{colors.success-tint}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: "5px 10px"
  "chip-rose":
    backgroundColor: "{colors.rose-tint}"
    textColor: "{colors.rose}"
    rounded: "{rounded.full}"
    padding: "5px 10px"
  "nav-item-active":
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary}"
    rounded: "{rounded.nav}"
    padding: "0 14px"
    height: "48px"
  "section-tab-active":
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.tab}"
    padding: "8px 16px"
    height: "44px"
  "shortcut-blue":
    backgroundColor: "{colors.shortcut-blue-tint}"
    textColor: "{colors.shortcut-blue}"
    rounded: "{rounded.card}"
    padding: "22px"
  "shortcut-purple":
    backgroundColor: "{colors.shortcut-purple-tint}"
    textColor: "{colors.shortcut-purple}"
    rounded: "{rounded.card}"
    padding: "22px"
  "shortcut-green":
    backgroundColor: "{colors.shortcut-green-tint}"
    textColor: "{colors.shortcut-green}"
    rounded: "{rounded.card}"
    padding: "22px"
  "shortcut-orange":
    backgroundColor: "{colors.shortcut-orange-tint}"
    textColor: "{colors.shortcut-orange}"
    rounded: "{rounded.card}"
    padding: "22px"
  "shortcut-pink":
    backgroundColor: "{colors.shortcut-pink-tint}"
    textColor: "{colors.shortcut-pink}"
    rounded: "{rounded.card}"
    padding: "22px"
  "shortcut-cyan":
    backgroundColor: "{colors.shortcut-cyan-tint}"
    textColor: "{colors.shortcut-cyan}"
    rounded: "{rounded.card}"
    padding: "22px"
  "segmented-active":
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  "avatar":
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: "44px"
---

# Design System: MU Connect

## Overview

**Creative North Star: "The Campus Commons"**

The Campus Commons is clear, welcoming, and purposeful: a shared space where students can scan people, conversations, and opportunities without a competing visual spectacle. University Blue provides a stable anchor; Gold and warm yellow add warmth, while white surfaces and a cool canvas keep the interface approachable.

V6 refines this established world for everyday tasks. Five stable destinations, compact navy page headings, six coordinated shortcut tiles, and consistent directories make the application easier to scan. Components remain approachable and restrained: soft corners, clear states, and quiet surfaces. Depth comes from tonal layers with selective soft lift. Spacing and alignment organize information before another container is added.

The system preserves MU Connect's independent student concept and the constraints in [PRODUCT.md](PRODUCT.md). The text mark is not an official university logo. Sample people, opportunities, role previews, and local matching are demonstration content; visual treatments must not imply endorsement, real authentication, validated compatibility, or communication between users. Activity belongs to the current browser profile and site origin.

**Key Characteristics:**

- University Blue and Gold remain the identity anchors.
- White functional surfaces sit on the cool V6 canvas.
- Compact headings, fine borders, and consistent app card corners establish hierarchy.
- Five primary destinations and six labeled tint tiles provide predictable wayfinding.
- Short, bounded motion and accessible overlays support everyday use; Welcome retains its distinct expression.

**Evidence and limits, 29 October 2026:** This refresh merges the authorized V6 implementation into the incumbent record. Authority is the final cascade in [global styles](src/app/globals.css), [navigation](src/components/layout/navigation.tsx), [app shell](src/components/layout/app-shell.tsx), [application primitives](src/components/ui/index.tsx), [shared controls](src/features/shared-controls.tsx), [Home](src/features/home-view.tsx), [Profile](src/features/profile-view.tsx), [Saved](src/features/saved-view.tsx), the Sidebar/Sheet/Tabs/Tooltip/Separator primitives, and [Welcome styles](src/components/welcome/welcome.css). [The V6 direction and audit](docs/MU-CONNECT-V6.md) supplies context; its checklist is not evidence of completion. [Saved responsive checks](docs/verification/v6-validation.json) cover 20 application views at 320, 360, 390, 768, 1024, and 1440px, with no recorded horizontal overflow, unnamed visible controls, or runtime errors. Review screenshots use the pairs home, discover, teams, login, profile-tester, messages, me, and teams-t1 at 1440px and 390px under [.impeccable/review](.impeccable/review/); [desktop Home](.impeccable/review/home-1440.png), [mobile Home](.impeccable/review/home-390.png), and [desktop login](.impeccable/review/login-1440.png) corroborate this record. The caption-contrast finding is fixed in source and [computed evidence](docs/verification/shortcut-contrast.json); the reviewer scored it resolved and returned ship for that fix. CTA implementation and local measurements are complete; [the V6 report](docs/MU-CONNECT-V6.md) records results and limits. Physical-device performance remains unverified. Context loading and the detector were unavailable; this is a source-and-artifact documentation pass, not a new browser run or a formal accessibility audit.

**Not canonized:** Incomplete dark-theme declarations, inherited smaller metadata, and decorative uppercase kickers carried by legacy surfaces are not defaults for future screens. They remain outside this documentation-only change.

## Colors

University Blue anchors actions; Gold adds warmth; pale neutrals and semantic tints keep dense content readable. Frontmatter owns the exact palette. The final application canvas uses canvas, while soft preserves the older pale background still used for hover, onboarding, and legacy surfaces.

### Primary

- **University Blue** (primary) appears in primary buttons, links, selected controls, and active navigation.
- **Deep University Blue** (primary-hover) is the shared primary button hover.
- **Pale University Blue** (primary-tint) supports active navigation, section tabs, blue topic chips, and small icon containers.

### Secondary

- **University Gold** (gold) remains the brand's supporting accent.
- **Pale Gold** and **Deep Gold Ink** (gold-tint, gold-ink) form the established readable gold tag pairing.
- **Welcome Navy**, **Welcome Ink**, and **Light Welcome Gold** belong to Welcome and login storytelling. The light gold supports serif emphasis against navy; it does not replace University Gold.

### Tertiary

- **Warm Yellow** (yellow) is distinct from University Gold. The application gold button variant uses yellow, yellow-hover, and on-yellow; the shared focus treatment also uses yellow.
- **Success Green**, **Status Rose**, and their tints distinguish existing status tags.
- **Validation Red** (error) preserves the destructive primitive's source OKLCH value. Field error messages retain their own red text treatment.
- **Section accents** pair Discover indigo, Teams purple, Competitions amber, Communities teal, Events coral, and Messages sky blue with their existing pale tints. Home uses University Blue. Route accents support section headings and context; shared page titles are Navy Ink in the final app cascade.
- **Shortcut tones** are a separate set of six coordinated ink/tint pairs. Blue identifies Discover People, purple Find Teams, green Create a Team, orange My Teams, pink Messages, and cyan My Profile. These are task links, not success/error statuses or replacements for route accents.

### Neutral

- **Cool Canvas**, **White Surface**, **Soft Background**, and **Soft Inset Surface** establish page, content, hover, and inset layers.
- **Navy Ink** and **Slate Text** distinguish principal and supporting text.
- **Quiet Divider** and **Field Border** separate groups and controls.
- **Placeholder Slate** supplements an associated label; it does not replace one.
- **Neutral Chip Surface** and **Neutral Chip Ink** support unselected tags.

**The Brand Anchor Rule.** Use University Blue for core actions and active navigation. Keep Gold and warm yellow in their established accent roles; semantic status colors support meaning rather than replacing the brand.

**The Readable Tint Rule.** Keep shortcut titles, captions, and icons in the assigned ink at full resting opacity. Preserve the labels as well as the tint; check contrast against the actual background after any change.

The six shortcut caption ratios are 7.37:1, 6.47:1, 6.40:1, 5.60:1, 5.35:1, and 5.66:1 respectively, at computed opacity 1. These measurements establish these specific pairings, not a blanket accessibility guarantee. Sidecar tonal ramps are preview aids rather than additional shipped palette tokens.

## Typography

**Primary family:** Inter, with Kanit, Arial, and sans-serif fallbacks.
**Thai family:** Kanit, with Inter and sans-serif fallbacks.
**Welcome emphasis:** Georgia and Times New Roman serif italics; login uses its existing serif utility for the same surface-specific gold emphasis.

Inter weights 400, 500, 600, and 700 and Kanit weights 400, 500, and 600 are bundled locally through [the root layout](src/app/layout.tsx). The app uses compact, direct typography. Larger promotional type belongs to Welcome and the desktop login story.

### Hierarchy

- **Headline:** shared app page titles use headline (28px, weight 700, line-height 1.2, tracking -0.035em). Below 640px, headline-compact applies (25px). The earlier global 30px/26px declarations remain legacy values outside the app shell.
- **Title:** section headings use title (18px, weight 700, tracking -0.025em). Person names in directory cards use 16px; the profile identity heading retains its local 24px treatment.
- **Body:** the base text role is 16px/1.5; routine application copy and controls commonly use body-small (14px/20px).
- **Relaxed body:** post descriptions use body-relaxed (14px/24px); page subtitles use 14px with 1.6 leading and a maximum width of 65ch.
- **Label:** field and action labels use the semibold label role (14px/20px). Expanded navigation uses weight 500, rising to 650 for the active row.
- **Caption:** supporting copy uses the caption role (12px/16px), with context-specific relaxed leading. Mobile bottom labels retain their existing 11px treatment; this does not establish a general text minimum.
- **Thai:** the dedicated family override keeps content size tied to its role.

Welcome's expanded CTA retains its large display clamp, tight leading, and italic gold serif line. Below 700px its title uses the existing clamp (44px, 11vw, 75px), with a further 11vw override at 390px and below. Desktop login uses a 48px story heading, increasing to 60px at 1280px, and 1.08 leading. Its form heading is 30px. Preserve these surface-specific expressions when extending either surface; do not apply their scale to app directories.

**The Script Support Rule.** Keep the locally bundled Inter and Kanit families available together. Preserve Thai text support whenever typography changes.

## Layout

The application uses bounded content beside responsive navigation, with a 4px spacing rhythm and feature-specific grids.

- Main content is fluid with a maximum wrapper width of 1200px inside the area remaining beside the sidebar. Shell horizontal padding is 16px, increasing to 32px at 768px. Top padding is 28px, increasing to 36px at 1024px.
- At 1024px and above, the official shadcn Sidebar is visible with icon collapse. Its expanded width is 15rem (240px at the default root); collapsed width is 4.5rem (72px). The provider's layout gap reserves the sidebar space.
- The sticky, opaque white top bar has a minimum height of 72px. Below 1024px, the compact brand and Explore trigger accompany creation, search, and notifications.
- Mobile bottom navigation contains Home, Discover, Teams, Messages, and Profile. Its minimum height is 68px plus the bottom safe area. The shell reserves 112px bottom padding on smaller screens and 40px at desktop.
- Home is the dashboard. The preserved Campus conversations feed is at /home?view=feed and is linked from Home and Explore.
- The six shortcut tiles form three columns from 1280px, two columns from 360px through 1279px, and one column below 360px. Desktop tiles have a minimum height of 176px and 22px padding; below 640px these become 145px and 18px, with a 148px minimum below 360px. Mobile gaps are 10px; larger gaps are 16px.
- Home's supporting content uses actual local profile matches and eligible recruiting teams, rendered only when available. It has no inherited feed-side rail. Secondary campus links form a wrapping row between the shortcuts and recommendations.
- Directory toolbars use a white bounded surface with 20px padding, reducing to 16px below 640px. Search fields have a minimum height of 52px. Result grids use two columns and 16px gaps, collapsing to one column below 640px.
- Profile and Saved sections use horizontally scrollable tab lists. Profile keeps an identity summary with a blue top edge; Saved counts come from local bookmarked records. Activity uses compact empty states and two columns from 1100px.
- Messages preserves a bounded workspace: min(720px, 100svh - 240px), changing below 768px to max(400px, 100svh - 320px). The feature owns conversation-list/detail switching on small screens.

Application breakpoints are 360px, 640px, 768px, 1024px, 1100px, and 1280px. Welcome keeps its own section breakpoints and bounded composition; it does not dictate app geometry.

## Elevation & Depth

**Tonal layers with selective soft lift:** white cards and pale inset surfaces sit on the cool canvas, separated by fine borders. Ordinary app cards have no heavy resting shadow. The application top bar is opaque white. Glass belongs to the compact Welcome pill; the expanded CTA has a solid navy surface.

### Shadow Vocabulary

- **Primary action** (0 4px 12px #17468c20): the shared primary button's quiet blue shadow.
- **Shortcut hover** (0 8px 20px #183b6810): a fine-pointer shortcut hover paired with a 3px lift.
- **Landing card hover** (0 12px 30px #17468c12): the established landing card hover.
- **Landing action hover** (0 8px 22px #17468c25): the established landing link-button lift.
- **Popover / Sheet** (0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)): the current shadow-lg account menu and Sheet.
- **Modal** (0 25px 50px -12px rgb(0 0 0 / 0.25)): the application modal wrapper.
- **Welcome Start** (0 16px 40px rgba(0, 0, 0, 0.18)): the existing expanded CTA action.

**The Selective Lift Rule.** Organize ordinary content through surface tone, borders, and spacing. Reserve stronger shadows for existing action emphasis and overlays.

### Motion

Shared timings remain fast (160ms), normal (280ms), and large (550ms), with the source ease-out curve. Buttons retain their 200ms transition and 0.98 press scale. Domain-card hover lifts by 3px where the shared motion hook is used. The shell's route main starts without a translated entrance; loading/content changes use a short fade.

React Bits AnimatedContent supplies bounded mount entrances: dashboard tiles use 10px, 320ms, and 35ms stagger; result grids use 6px and 240ms; login form content uses 8px and 300ms. The login story retains existing SplitText and BlurText. Its background is static navy and local photography, with no rendering loop. Keep animated words readable in reduced motion.

Welcome retains headline motion, the expanding navbar CTA, and DriftWall. Header, CTA, and wall use stable final dimensions during scroll; expansion animates clip-path, transforms, and opacity. Geometry is read at setup/refresh. The compact glass fades out early and becomes hidden; its 22px blur never expands into viewport glass. Decorative wall tracks use CSS translate3d animation, run only while active, intersecting, and page-visible, and stop in reduced motion. Capability and visible-width bounds limit their columns. The interactive DriftWall variant remains separate.

Reduced motion shortens CSS animation/transition durations, removes AnimatedContent and shared-card entrances, disables decorative wall travel, and changes the Welcome expansion to a discrete state change. Welcome's existing dynamically loaded Galaxy/LightRays remain isolated hero effects, with their reduced-motion alternative. None of these Welcome treatments establishes a persistent decorative-motion pattern for the application.

## Shapes

Soft, continuous curves accompany fine borders. App cards, directory toolbars, and shortcut tiles use the card radius. Pills carry topics and statuses; avatars remain circular.

The theme radius base remains 0.9rem: md is 0.72rem, lg 0.9rem, xl 1.26rem, and 2xl 1.62rem. These utilities are customized rather than stock Tailwind radii. Application buttons and fields retain xl; do not silently square them when adopting generated primitives.

The final app-shell override sets ordinary card corners to 16px. Legacy cards outside that shell retain 20px; inset soft cards remain 16px. Navigation uses fixed 12px corners, section tabs 10px, and application modals 22px. Welcome retains a compact pill and an expanded rounded rectangle (30px, reducing to 26px below 640px), revealed through clipping.

## Components

### Buttons

_Approachable and restrained, with a clear action hierarchy._

Use the application Button wrapper for primary, secondary, ghost, and gold actions.

- **Sizing:** small and medium have minimum 44px heights and 14px text, with 12px and 16px horizontal padding respectively. Large has a minimum 48px height and 24px horizontal padding. Shared icon controls have 44px targets.
- **Primary:** University Blue, white text, deep-blue hover, and the quiet action shadow.
- **Secondary:** white with a fine border, blue text, and soft-background hover.
- **Ghost:** transparent with the existing slate text and pale hover that turns the text blue.
- **Gold:** the source variant name maps to Warm Yellow with dark ink and the existing yellow hover.
- **States:** retain visible keyboard focus, disabled pointer/opacity behavior, and pending-state labels.

The global focus-visible treatment uses a 3px University Blue outline, a 2px offset, and a warm-yellow inner accent. Controls can additionally carry their existing blue ring. Welcome retains its own yellow perimeter with 4px offset.

### Chips

_Compact semantic labels, with text carrying the meaning._

Shared chips retain pill corners, 5px by 10px padding, 12px semibold text, and neutral/blue/gold/green/rose pairings. Tag also inherits Badge sizing; standalone topic links do not establish a universal chip height. Applied-filter buttons are larger interactive controls with 44px targets, readable wrapping labels, individual removal, and Reset filters.

### Cards / Containers

_Quiet surfaces that group real content._

App domain cards use white, a fine divider border, and the app card radius. Team cards retain 20px padding, increasing to 24px at 640px; compact person cards use 20px throughout. Home recommendations use their lighter 16px-padded composition. Shared hover motion is selective, without a heavy resting shadow.

Person cards emphasize identity, skills, and availability, with View profile and Follow visible. Message, team invitation, and local relevance details live in a disclosure. Team cards expose recruitment status, open roles, deadline, capacity, and local request state. Preserve real counts and actions; seeded records are not adoption evidence.

### Inputs / Fields

_Associated labels and calm, clearly bounded controls._

The application field class supplies the 44px minimum height, themed xl corners, field border, Navy Ink, and Slate placeholder. Focus turns the border blue with a translucent blue ring. Field supplies a visible label and a red error message beneath the input; search uses its associated visually hidden label and leading SVG icon.

Directory search enlarges this treatment to 52px, 15px text, and a soft inset fill. Its final border uses Field Border, overriding the earlier lighter toolbar declaration. More filters uses a bottom Sheet below 640px and an inline disclosure on larger screens; selections update results and expose an applied-filter count.

The generated Input's smaller defaults are not the application's field specification. Preserve visible pending, error, and storage-retry states in forms.

### Navigation

_Five stable destinations with explicit active states._

Home, Discover, Teams, Messages, and the current user's Profile are the five primary destinations on desktop and mobile. People directory belongs to Discover. My Activity remains a separate secondary destination.

Desktop uses the official shadcn Sidebar with a visible collapse trigger, 48px rows, 20px stroked SVG icons, fixed nav corners, and a blue-tinted active row with a check and current-page semantics. Icon collapse keeps 48px targets and named tooltips; the app TooltipProvider uses a 200ms delay. Cmd/Ctrl+B toggles the sidebar. The footer retains the independent-local-demo note and account menu.

Explore campus opens a right-side Radix Sheet with creation and secondary routes: Campus conversations, People directory, Communities, Competitions, Events, Saved, and My Activity. Mobile opens the same Sheet from the top bar; Profile stays in the bottom five. The account menu exposes profile editing, activity, saved items, notifications, and Return to login. That link returns to the demo entry; it does not claim real logout.

The top bar retains creation, search, notifications, and contextual identity. Cmd/Ctrl+K opens command search. A visible-on-focus skip link targets main content.

### Tabs and Segmented Controls

_Related views share a consistent hierarchy and retain their native semantics._

Profile and Saved use Radix Tabs with a full-width, horizontally scrolling section list. Triggers have 44px minimum targets, 8px by 16px padding, 14px semibold labels, and fixed tab corners. The selected section uses Pale University Blue and blue text, without a shadow. Counts reflect the corresponding local records. Preserve arrow-key operation, tab/panel relationships, selected state, and URL-backed selection.

The existing Segmented control remains for feed and directory scopes. Its white bordered track surrounds 44px buttons; selection is solid University Blue with white text and a check. It exposes aria-pressed and retains its spring selection indicator with a reduced-motion alternative. Do not document these two controls as one identical treatment.

### Dialogs and Overlays

The application modal retains its white surface, fine border, fixed dialog corners, responsive padding (20px, then 32px), maximum height (92dvh), and scrolling content. Its navy overlay is translucent with a small blur. The wrapper maximum width is 36rem; the composer uses 42rem on desktop. Mobile width is viewport minus 24px.

Explore and filter Sheets preserve Radix focus management, Escape dismissal, and focus restoration. The bottom filter Sheet is bounded at 88svh with bottom safe-area padding; the right Explore Sheet is bounded by the viewport and its inherited desktop maximum. Sheet close controls have 44px minimum targets.

Tooltips label collapsed navigation using the existing dark surface, light text, and arrow. Separator provides a quiet 1px horizontal or vertical boundary; keep its decorative semantics unless a meaningful separator is required. Preserve dialog titles/descriptions, visible close controls, and composer draft/photo recovery.

### Home Shortcuts

_Six coordinated tint tiles offer direct entry into actual tasks._

Keep the task-to-tone mapping in Colors. Each tile is a full-surface link or a button for Create a Team, using a leading SVG, directional arrow, bold title, and full-opacity caption. The flex column aligns the content across link and button variants. Fine-pointer hover lifts 3px and advances the arrow 4px; reduced motion removes the lift and shortens transitions.

The dashboard's people section uses existing local matching; recruiting teams must have room, an open deadline, and an unfilled role, and exclude the current user's led teams. Omit unavailable supporting sections instead of inventing records.

### Avatars, Imagery, Welcome, and Login

Avatars retain initials, data-specific pale fills, blue text, a white 2px border, and circular clipping. Existing sizes are 36px, 44px, 52px, and 96px. Preserve post galleries, missing-image treatments, and keyboard-accessible lightboxes.

Welcome retains the existing wordmark/hero, photographic collage and talents, benefit interactions, large serif emphasis, and final expanding CTA. The final navbar shell is inset 16px with dimensions calc(100% - 32px) by calc(100svh - 32px); below 640px it is inset 12px with corresponding 24px deductions. The compact glass remains at most 1080px wide by 66px high; mobile glass uses viewport minus 28px by 60px. DriftWall is decorative, hidden from assistive technology, and inert within the CTA. Hidden CTA content is inert until expanded.

Login uses a two-column desktop layout from 1024px: static navy story and a white form area bounded to 400px. Below that breakpoint the story is hidden and the form leads. Reuse the local collaboration photograph and its truthful illustrative caption; the depicted people are not verified students or prototype members. Existing SplitText/BlurText and the sourced React Bits AnimatedContent supply bounded entrance motion. Demo role controls explicitly carry no real permissions. Preserve the primary form action, password visibility toggle, secondary instant-demo entry, pending guard, and storage-error recovery.

## Do's and Don'ts

### Do:

- **Do** reuse application wrappers and domain components, including the adapted Sidebar, Sheet, and Tabs.
- **Do** retain University Blue and Gold, with route accents and shortcut tones serving their distinct semantic roles.
- **Do** keep the five main destinations stable and expose secondary routes through Explore campus.
- **Do** preserve 44px action targets, visible focus, associated labels, native keyboard behavior, and reduced-motion alternatives.
- **Do** simplify grouping through spacing, headings, and alignment before adding another card.
- **Do** keep shortcut captions at full resting opacity and recheck their actual contrast after changes.
- **Do** respect app card corners, the customized control-radius scale, bounded content, and mobile safe-area clearance.
- **Do** preserve illustrative-image captions, local-demo language, actual counts, and data-backed recommendations.

### Don't:

- **Don't** replace the established Campus Commons world or promote Welcome's display scale and glass into ordinary app screens.
- **Don't** use color alone to communicate a destination, selection, error, or status.
- **Don't** turn legacy small metadata, decorative kickers, or incomplete dark declarations into reusable defaults.
- **Don't** add unnecessary nested cards, heavy resting shadows, or persistent decorative motion to ordinary app content.
- **Don't** animate the Welcome shell's layout dimensions or extend its compact backdrop blur across the viewport.
- **Don't** present role previews, sample identities, local relevance, or saved demo requests as real permissions, verified outcomes, or contact with other users.
