---
name: "MU Connect"
description: "The Campus Commons: clear, welcoming, and purposeful."
colors:
  "primary": "#17468C"
  "primary-hover": "#0F3672"
  "gold": "#A5812D"
  "yellow": "#FAC334"
  "yellow-hover": "#EEB622"
  "on-yellow": "#4C390C"
  "canvas": "#F5F8FC"
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
typography:
  "headline":
    fontFamily: "Inter, Kanit, Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  "headline-compact":
    fontFamily: "Inter, Kanit, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.04em"
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
rounded:
  "md": "0.72rem"
  "lg": "0.9rem"
  "xl": "1.26rem"
  "2xl": "1.62rem"
  "card": "20px"
  "soft-card": "16px"
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
    rounded: "{rounded.xl}"
    padding: "0 12px"
    height: "44px"
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

Components are approachable and restrained: soft corners, clear states, and quiet surfaces. Depth comes from tonal layers with selective soft lift. Dense information belongs inside a readable hierarchy, with spacing and alignment doing the organizing before another container is added. These descriptions name the existing interface; they do not authorize a replacement visual world.

This record describes the existing light interface. It is based on the application styles and reusable components, with your confirmed language and brand constraints. It records the incumbent system rather than the untouched defaults of its component generator.

**Key Characteristics:**

- University Blue and Gold remain the identity anchors.
- White content surfaces sit on a cool, pale canvas.
- Rounded controls and fine borders provide a consistent, approachable form language.
- Semantic tints and explicit labels distinguish categories and states.
- Short transitions, reduced-motion alternatives, and responsive navigation support everyday use.

**Evidence and limits:** The primary sources are [global styles](src/app/globals.css), [application primitives](src/components/ui/index.tsx), [navigation](src/components/layout/navigation.tsx), [app shell](src/components/layout/app-shell.tsx), [shared controls](src/features/shared-controls.tsx), [domain cards](src/components/shared/cards/), and [motion configuration](src/lib/motion/config.ts). Saved desktop and mobile feed/composer captures in .next/image-test-artifacts/ dated 2026-10-15 corroborate the sampled styles and postdate the relevant source changes. Browser inspection was unavailable, so this pass did not sample live computed styles or run an accessibility audit. Loading-state captures and full-page capture gaps are not visual design authority.

**Implementation refinement, 15 October 2026:** The authorized critique fixes preserve this visual world. Supporting text and placeholders now use stronger slate, fields have a clearer boundary, shared actions target 44px, and route accents distinguish sections. Mobile navigation exposes Home, Discover, Teams, Messages, and More; Profile and My Activity are distinct. The inherited dialog width conflict is resolved. Headless Chrome checks and current captures supplement the original source evidence; physical devices and assistive technology remain unverified. Dark declarations still do not establish a complete dark theme.

## Colors

University Blue anchors the interface, Gold adds warmth, and pale neutrals keep the content readable. The frontmatter owns exact color values; the descriptions below explain their use.

### Primary

- **University Blue** (primary) appears in primary buttons, active navigation, links, selected filters, progress, and branded surfaces.
- **Deep University Blue** (primary-hover) is the shared primary button's hover treatment.
- **Pale University Blue** (primary-tint) supports active navigation, blue topic chips, and icon containers.

### Secondary

- **University Gold** (gold) marks supporting accents and selected opportunity details.
- **Pale Gold** and **Deep Gold Ink** (gold-tint, gold-ink) form the established gold tag pairing.

### Tertiary

- **Warm Yellow** (yellow) is distinct from University Gold. It appears on the gold button variant, unread indicators, and the global focus outline; yellow-hover and on-yellow complete the button treatment.
- **Success Green** and its pale tint support positive statuses.
- **Status Rose** and its pale tint support the existing rose tag variant. These tags are not a substitute for field validation.
- **Validation Red** (error) retains the source OKLCH value used by the destructive token and validation styling.

### Neutral

- **Cool Canvas**, **White Surface**, and **Soft Inset Surface** (canvas, surface, surface-soft) establish the page, content, and inset layers.
- **Navy Ink** and **Slate Text** (ink, muted-text) provide principal and supporting text.
- **Quiet Divider** and **Field Border** (border, input-border) separate groups and controls.
- **Placeholder Slate** is a placeholder treatment, not a substitute for a visible label.
- **Neutral Chip Surface** and **Neutral Chip Ink** provide the unselected tag pairing.

**The Brand Anchor Rule.** Use University Blue for core actions and active navigation. Keep Gold and warm yellow in their established accent roles; semantic status colors support meaning rather than replacing the brand.

No palette pairing is a blanket accessibility guarantee. Check contrast at its actual font size, weight, and background, particularly for Gold and pale metadata. The sidecar's synthesized tonal ramps are preview aids, not additional shipped palette tokens.

### Section accents

Reusable `--accent-*` and `--tint-*` pairs live in global styles. The app shell maps its route to `--section-accent` and `--section-tint`: Home uses University Blue; Discover indigo; Team Finder purple; Competitions deep amber; Communities teal; Events coral; Messages sky blue. Use these on headings, selected context, and small tonal surfaces. Core actions remain University Blue. Every destination retains a text label; color supplements navigation.

## Typography

**Primary family:** Inter, with Kanit, Arial, and sans-serif fallbacks.
**Thai family:** Kanit, with Inter and sans-serif fallbacks.

Both families are bundled locally through [the root layout](src/app/layout.tsx). Inter weights 400, 500, 600, and 700 and Kanit weights 400, 500, and 600 are imported. The shared type system is straightforward and compact; stronger weights and measured size changes establish hierarchy.

### Hierarchy

- **Headline:** page titles use the headline token; below 768px the headline-compact size applies.
- **Title:** section headings use the title token. Individual card headings vary within their existing components rather than forcing every title to the same size.
- **Body:** the root text uses body; routine controls and supporting copy commonly use body-small.
- **Relaxed body:** post descriptions use body-relaxed for longer, comfortably spaced lines.
- **Label:** action and field labels use the label role, with compact labels adapting to their existing components.
- **Caption:** use the caption role as the recorded compact text reference. Existing smaller metadata does not establish a preferred minimum.
- **Thai:** the thai role records the dedicated family override; text size continues to follow its content role.

Page subtitles have their own relaxed line-height (1.6). The existing landing headline uses larger, surface-specific display sizes (44px, rising to 64px at 640px) with tight leading (1.06); those values describe that component rather than every app title. There is no imposed modular ratio or new global line-length rule.

**The Script Support Rule.** Keep the locally bundled Inter and Kanit families available together. Preserve Thai text support whenever typography changes.

## Layout

The app uses a bounded content region with responsive navigation rather than one universal card grid.

- The main page wrapper is fluid with a maximum width (1180px), measured inside the area to the right of the desktop sidebar.
- At 1024px and above, the fixed sidebar occupies 240px and the content offsets by that amount.
- The sticky top bar is 72px high. Below 1024px, it carries the brand and the fixed bottom navigation replaces the sidebar.
- Bottom navigation is 74px high and accounts for the device safe area. The app shell reserves bottom padding (112px) below the desktop breakpoint; desktop bottom padding is 40px.
- The subordinate right rail appears on Home at 1280px and above with a fixed width (250px), separated from the main content by a gap (28px). Directories and details use the available main width.
- Shell horizontal padding progresses from 16px to 32px at 768px, then 36px at 1024px. Top padding is 28px.
- Reusable domain cards use 20px padding, increasing to 24px from 640px. Other cards retain their component-specific padding.
- The underlying spacing unit is 4px. The frontmatter records the reused steps, not a requirement to snap every dimension to one scale.
- Grids, filters, and paired content collapse or wrap according to the existing feature. Segmented controls preserve their labels and permit horizontal scrolling when necessary.

The relevant breakpoints are 640px, 768px, 1024px, and 1280px. They are recorded in the sidecar, outside the frontmatter token schema. The landing has its own bounded container and section composition; it does not dictate the application shell.

## Elevation & Depth

**Tonal layers with selective soft lift:** white cards and pale inset surfaces sit on the cool canvas, usually separated by fine borders. Action shadows are restrained; overlays receive more separation because they occupy a different interaction layer. The top bar uses a translucent white surface and backdrop blur.

### Shadow Vocabulary

- **Primary action** (0 4px 12px #17468c20): the shared primary button's quiet blue shadow.
- **Landing card hover** (0 12px 30px #17468c12): fine-pointer hover on the existing landing cards.
- **Landing action hover** (0 8px 22px #17468c25): the existing landing link-button lift.
- **Popover** (0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)): the notification popover's larger layer.
- **Modal** (0 25px 50px -12px rgb(0 0 0 / 0.25)): the application modal wrapper's strongest common shadow.

**The Selective Lift Rule.** Organize ordinary content through surface tone, borders, and spacing. Reserve stronger shadows for existing action emphasis and overlays.

### Motion

Shared timings are fast (160ms), normal (280ms), and large (550ms), with the source ease-out curve. Buttons retain their existing 200ms transition. Soft and quick springs support moving selection indicators and compact feedback; their actual parameters are in the sidecar.

Page entry uses a small vertical offset (10px) and fade; optional card reveals use 12px. Domain-card hover lifts by 3px, and the shared button press scales to 0.98. These are existing interaction details, not a reason to animate every object.

Reduced motion suppresses entrance and spring movement, shortens CSS animations and transitions, and restores automatic scrolling. The landing's lazy-loaded WebGL scene is an isolated feature: it pauses when inactive and supplies a static fallback. It is not the app's general decoration model.

## Shapes

The form language is soft and continuous. Fine borders define ordinary surfaces; pills carry compact topics and statuses, and avatars remain circular.

The radius base is 0.9rem. The project's inline theme changes the meaning of the named radius utilities: md is 0.72rem, lg is 0.9rem, xl is 1.26rem, and 2xl is 1.62rem. These are not stock Tailwind values. At a 16px root, xl is approximately 20.16px.

Fixed component radii coexist intentionally with that scale: ordinary cards use the card token, inset soft cards use soft-card, and application modals use dialog. Chips use the full token. Preserve the implemented component's choice rather than replacing every curve with one generic radius.

## Components

### Buttons

*Approachable and restrained, with a clear action hierarchy.*

The application Button in src/components/ui/index.tsx wraps the lower-level primitive. Use its primary, secondary, ghost, and gold variants for existing application work.

- **Sizing:** small and medium have a minimum height of 44px and 14px text, with 12px and 16px horizontal padding respectively. Large has a minimum height of 48px and 24px horizontal padding. Compact icon actions also have 44px targets.
- **Primary:** University Blue, white text, the recorded primary hover, and the quiet action shadow.
- **Secondary:** white with a fine border, blue text, and a pale canvas hover.
- **Ghost:** transparent, slate text, and a pale blue-gray hover that turns the text blue.
- **Gold:** the source variant name maps to Warm Yellow, not University Gold; use the established dark text and yellow hover.
- **States:** preserve keyboard focus, the existing press feedback, and disabled opacity. The base primitive supplies focus rings and disabled pointer behavior.

The global focus-visible treatment uses a 3px University Blue outline, a 2px offset, and a warm-yellow inner accent. The blue perimeter remains distinguishable on light surfaces. Controls may additionally carry the existing blue focus ring.

### Chips

*Compact semantic labels, with the text carrying the meaning.*

The shared chip styling uses the recorded pill radius and padding, compact text (12px), and semibold weight (600). Neutral, blue, gold, green, and rose pairings are established. The application Tag also inherits Badge sizing, while standalone topic links use the chip class directly; do not infer a universal height from padding alone. Interactive topic chips retain their hover and focus states.

### Cards / Containers

*Quiet surfaces that group real content.*

Ordinary domain cards use a white surface, a fine divider border, the fixed card radius, and responsive padding. Soft cards use the pale inset treatment and a lighter border. Hover movement belongs to components that already use the shared card-motion hook; it does not require a heavy resting shadow.

The existing feed contains bounded recruitment or event information inside a post. Keep the information and actions intact, and use hierarchy and spacing when reducing unnecessary container nesting.

### Inputs / Fields

*Visible labels and calm, clearly bounded controls.*

The application inputClass supplies the field styling, including the frontmatter size, a fine field border, Navy Ink, and a pale placeholder. Focus shifts the border to University Blue and adds a translucent blue ring. The Field wrapper supplies a visible label and a red error message beneath the control.

The lower-level generated Input has different defaults. Its 32px base height and neutral styling are not the canonical application's 44px field treatment. Do not silently substitute those defaults when extending an existing form.

### Navigation

*Stable locations and explicit active states.*

Desktop links use a minimum 44px row, semibold 14px text, inset horizontal padding (12px), and the themed xl radius. Active links use Pale University Blue and blue text, with explicit current-page semantics. Icons are stroked SVGs with a slightly heavier active state.

On smaller screens, the top bar provides search, notifications, and profile access. Bottom navigation provides Home, Discover, Teams, Messages, and More. The accessible More popover includes communities, competitions, events, saved items, notifications, My Activity, people, the actual profile, and creation. Home retains one prominent creation action. The command search remains available through Cmd/Ctrl+K.

### Segmented Controls

*Small, direct switches between related views.*

A white bordered track surrounds compact buttons. The active button uses University Blue and white text, with the themed lg radius; inactive buttons use muted text and a subtle hover fill. Selection is exposed through aria-pressed and an animated background, with a reduced-motion alternative.

### Dialogs and Overlays

The application modal wrapper uses its fixed dialog radius, white surface, fine border, responsive padding (20px, then 32px), a maximum height (92dvh), and scrolling content. Its navy overlay is translucent (25%) with a small backdrop blur (2px).

The wrapper explicitly sets a responsive maximum width of 36rem; the post composer overrides it to 42rem on desktop. Mobile uses the viewport width minus 24px and a maximum of 92dvh. Composer completion actions stay at the bottom while scrolling. Radix focus management, Escape dismissal, visible close controls, draft/photo recovery, and focus restoration remain intact.

### Avatars and Content Imagery

Avatars use initials, a user-specific pale fill, blue text, a white border (2px), and circular clipping. The existing sizes are 36px, 44px, 52px, and 96px.

Post imagery belongs to the content: preserve the existing bounded gallery, missing-image treatment, and keyboard-accessible lightbox. Test-image swatches and placeholder community glyphs are not new brand assets or a decorative icon system.

## Do's and Don'ts

### Do:

- **Do** reuse the application wrappers and domain components before reaching for unmodified library defaults.
- **Do** retain University Blue and Gold while using semantic tints with readable text or icons.
- **Do** simplify grouping through spacing, headings, and alignment before adding another card.
- **Do** preserve keyboard focus, explicit labels, selected-state semantics, and reduced-motion behavior.
- **Do** check actual text contrast and rendering performance when refining existing screens.
- **Do** respect the customized radius scale, responsive navigation, and bottom-navigation clearance.

### Don't:

- **Don't** replace the existing interface or its brand during a documentation or narrow refinement task.
- **Don't** use color alone to communicate a category, selection, error, or status.
- **Don't** treat small, pale metadata or decorative uppercase labels as approved defaults for new content.
- **Don't** promote the inherited dialog width interaction or incomplete dark styles into system-wide rules.
- **Don't** add unnecessary nested cards, heavy resting shadows, or persistent decorative motion to ordinary app content.
