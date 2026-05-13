# MASTER MOBILE OPTIMIZATION PROMPT
## Complete Guide for Making a Website Fully Mobile Responsive

---

## CRITICAL RULES BEFORE YOU START

- **DO NOT change** any text content, copy, headings, or messaging.
- **DO NOT change** the overall design language, color palette, or typography style.
- **DO NOT remove** any sections or elements — only adapt how they display on smaller screens.
- **DO NOT add** new sections, pages, or features.
- Your job is purely **responsive adaptation** — same content, optimized for every screen size.
- Test every breakpoint after each change. Never assume — verify in browser DevTools.

---

## BREAKPOINT SYSTEM

Use this standard breakpoint map for everything. Never invent custom values.

```css
/* Mobile first approach — always write mobile default, then scale UP */

/* xs — tiny phones */
@media (max-width: 375px) { }

/* sm — most phones */
@media (max-width: 480px) { }

/* md — large phones / small tablets */
@media (max-width: 768px) { }

/* lg — tablets / small laptops */
@media (max-width: 1024px) { }

/* xl — standard desktop */
@media (max-width: 1280px) { }

/* Never use magic numbers like 667px, 812px etc. */
```

---

## SECTION 1 — VIEWPORT & BASE SETUP

### Step 1.1 — Viewport Meta Tag (MANDATORY — Do first)
Make sure this exact tag is in `<head>`. If it already exists, verify it matches exactly:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```
- Do NOT use `user-scalable=no` — it breaks accessibility.
- Do NOT use `maximum-scale=1.0` — it prevents pinch-zoom for visually impaired users.

### Step 1.2 — Global Box Sizing
Add to the top of your CSS:
```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

### Step 1.3 — Prevent Horizontal Overflow
```css
html, body {
  overflow-x: hidden;
  max-width: 100%;
}
```

### Step 1.4 — Base Font Size
```css
html {
  font-size: 16px; /* base — never go below 16px base */
}
@media (max-width: 480px) {
  html { font-size: 15px; }
}
```

---

## SECTION 2 — TYPOGRAPHY SCALING

### Rules
- Minimum body text on mobile: **15px**. Never smaller.
- Minimum tap-target-adjacent labels: **13px** (never use for body content).
- Headings must scale DOWN on mobile — large desktop headings look broken on small screens.
- Use `clamp()` for fluid type whenever possible.

### Implementation
```css
/* Desktop → Mobile scaling for all heading levels */

h1 {
  font-size: clamp(2rem, 8vw, 6rem);    /* fluid: min 32px, max 96px */
}
h2 {
  font-size: clamp(1.5rem, 5vw, 3rem);  /* fluid: min 24px, max 48px */
}
h3 {
  font-size: clamp(1.2rem, 4vw, 2rem);  /* fluid: min 19px, max 32px */
}
h4 {
  font-size: clamp(1rem, 3vw, 1.5rem);
}
p, li, td {
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
}

/* For very large display headings (hero text, huge numbers) */
.display-heading {
  font-size: clamp(2.5rem, 12vw, 10rem);
  line-height: 1.05;
}
```

### Letter Spacing
- Desktop may use wide `letter-spacing` for dramatic effect — on mobile this causes overflow. Cap it:
```css
@media (max-width: 480px) {
  h1, h2, .display-heading {
    letter-spacing: -0.01em; /* tighten on mobile */
  }
}
```

### Line Height
```css
@media (max-width: 768px) {
  body { line-height: 1.6; }
  h1, h2 { line-height: 1.1; }
}
```

---

## SECTION 3 — LAYOUT & GRID

### Rule: All Multi-Column Layouts → Single Column on Mobile

Every grid, flex row, or multi-column layout must collapse on mobile.

```css
/* Desktop grid */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

/* Tablet */
@media (max-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}
```

### Flexbox Rows → Columns
```css
.flex-row {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: center;
}

@media (max-width: 768px) {
  .flex-row {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start; /* or center if design demands */
  }
}
```

### Widths: Never Use Fixed px Widths on Key Layout Containers
```css
/* BAD */
.container { width: 1200px; }

/* GOOD */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 5vw, 3rem); /* responsive padding */
}
```

---

## SECTION 4 — NAVIGATION

This is the most complex mobile scenario. Handle every case:

### Case A — Simple Top Navigation Bar
```css
/* Hide desktop nav links on mobile */
@media (max-width: 768px) {
  .nav-links {
    display: none; /* hidden by default on mobile */
  }
  .hamburger-btn {
    display: flex; /* show hamburger */
  }
}

/* Desktop — hide hamburger */
.hamburger-btn {
  display: none;
}
```

### Case B — Mobile Menu (Hamburger Drawer)
```html
<!-- Add this structure -->
<button class="hamburger-btn" aria-label="Open menu" aria-expanded="false">
  <span></span><span></span><span></span> <!-- 3 lines -->
</button>

<nav class="mobile-menu" aria-hidden="true">
  <!-- same nav links here -->
</nav>
```
```css
.mobile-menu {
  position: fixed;
  top: 0; right: 0;
  width: min(320px, 85vw);
  height: 100vh;
  background: #000; /* match your site bg */
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10000;
  padding: 5rem 2rem 2rem;
  overflow-y: auto;
}
.mobile-menu.open {
  transform: translateX(0);
}
/* Backdrop */
.menu-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 9999;
}
.menu-backdrop.visible { display: block; }
```
```javascript
// Toggle logic
const hamburger = document.querySelector('.hamburger-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const backdrop = document.querySelector('.menu-backdrop');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  backdrop.classList.toggle('visible', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : ''; // prevent background scroll
});
backdrop.addEventListener('click', closeMenu);
function closeMenu() {
  mobileMenu.classList.remove('open');
  backdrop.classList.remove('visible');
  hamburger.setAttribute('aria-expanded', false);
  mobileMenu.setAttribute('aria-hidden', true);
  document.body.style.overflow = '';
}
```

### Case C — Sticky Navigation on Mobile
```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  /* If your navbar has a glass/blur effect, disable it on mobile for performance */
}
@media (max-width: 768px) {
  .navbar {
    backdrop-filter: none; /* disable blur on mobile — GPU expensive */
    -webkit-backdrop-filter: none;
    background: rgba(0,0,0,0.95); /* use solid bg instead */
  }
}
```

### Case D — Logo Scaling in Navbar
```css
.navbar-logo {
  height: auto;
  max-height: 40px;
}
@media (max-width: 480px) {
  .navbar-logo {
    max-height: 32px;
  }
}
```

---

## SECTION 5 — HERO / LANDING SECTION

### Scenario A — Full Viewport Hero
```css
.hero {
  height: 100vh;
  display: flex;
  align-items: center;
}
@media (max-width: 768px) {
  .hero {
    height: 100svh; /* svh = small viewport height (accounts for mobile browser bars) */
    min-height: 500px;
    padding: 5rem 1.25rem 3rem;
    text-align: center; /* center text on mobile */
  }
}
```

### Scenario B — Hero with Background Video
```css
/* Disable autoplay video on mobile — use poster image instead */
@media (max-width: 768px) {
  .hero-video {
    display: none;
  }
  .hero {
    background-image: var(--hero-poster); /* set via JS or inline style */
    background-size: cover;
    background-position: center;
  }
}
```
```javascript
// JS approach — pause video on mobile
if (window.innerWidth <= 768) {
  const video = document.querySelector('.hero-video');
  if (video) {
    video.pause();
    video.removeAttribute('autoplay');
    video.style.display = 'none';
  }
}
```

### Scenario C — Hero with Text + Image Side by Side
```css
.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}
@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  /* Put image AFTER text on mobile, even if it's first in DOM */
  .hero-image { order: 2; }
  .hero-text  { order: 1; }
}
```

### Scenario D — Hero Scroll-Triggered Animations
```javascript
// Disable heavy scroll animations on mobile
const isMobile = window.innerWidth <= 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!isMobile && !prefersReducedMotion) {
  // Initialize GSAP ScrollTrigger / Locomotive Scroll / etc.
  initScrollAnimations();
} else {
  // Just show elements immediately, no animation
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}
```

---

## SECTION 6 — IMAGES & MEDIA

### Rule: Every Image Must Be Responsive
```css
img, video, canvas, svg {
  max-width: 100%;
  height: auto;
  display: block;
}
```

### Scenario A — Art Direction (Different Crop Per Device)
```html
<picture>
  <source media="(max-width: 480px)"  srcset="image-portrait-mobile.jpg">
  <source media="(max-width: 1024px)" srcset="image-square-tablet.jpg">
  <img src="image-landscape-desktop.jpg" alt="Description" loading="lazy">
</picture>
```

### Scenario B — Responsive Image Sizes for Performance
```html
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 800px"
  alt="Description"
  loading="lazy"
>
```

### Scenario C — Background Images
```css
.section-bg {
  background-image: url('bg-desktop.jpg');
  background-size: cover;
  background-position: center;
}
@media (max-width: 768px) {
  .section-bg {
    background-image: url('bg-mobile.jpg'); /* smaller, portrait crop */
    background-attachment: fixed; /* DISABLE parallax on mobile */
    background-attachment: scroll; /* use scroll instead */
  }
}
```

### Scenario D — Disable Parallax on Mobile
```javascript
// Parallax is a major performance killer on mobile
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
if (isMobile) {
  // Disable Rellax, Jarallax, or any parallax library
  if (typeof rellax !== 'undefined') rellax.destroy();
  document.querySelectorAll('[data-parallax]').forEach(el => {
    el.style.transform = 'none';
  });
}
```

---

## SECTION 7 — TOUCH & TAP TARGETS

### Rule: Every Interactive Element Must Be At Least 44×44px (Apple) / 48×48px (Google)
```css
/* Buttons */
button, .btn, [role="button"] {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  touch-action: manipulation; /* eliminates 300ms tap delay */
}

/* Links in navigation */
nav a {
  display: block;
  padding: 0.75rem 0;
  min-height: 44px;
  line-height: 44px;
}

/* Form inputs */
input, select, textarea {
  min-height: 44px;
  font-size: 16px !important; /* CRITICAL — below 16px triggers iOS zoom on focus */
}
```

### Scenario — Remove Hover-Only Interactions
```css
/* Hover states are fine on desktop but invisible on touch */
/* Always provide a visible resting state for touch devices */
@media (hover: none) {
  .hover-reveal {
    opacity: 1; /* show things that are hidden until hover */
    transform: none;
  }
  .hover-underline::after {
    width: 100%; /* always show underline on touch */
  }
}
```

---

## SECTION 8 — FORMS

### Every Input Must Have These on Mobile
```css
input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"],
input[type="search"],
select,
textarea {
  font-size: 16px;       /* MANDATORY — prevents iOS zoom */
  width: 100%;
  padding: 0.75rem 1rem;
  min-height: 44px;
  border-radius: 8px;
  -webkit-appearance: none; /* remove iOS default styling */
  appearance: none;
}
```

### Correct `inputmode` for Each Field
```html
<!-- These trigger the correct mobile keyboard -->
<input type="email"  inputmode="email">
<input type="tel"    inputmode="tel">
<input type="number" inputmode="numeric">
<input type="text"   inputmode="search">  <!-- for search fields -->
<input type="text"   autocomplete="name"> <!-- triggers name autofill -->
```

### Mobile-Only Form Layout
```css
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr; /* stack on mobile */
  }
}
```

---

## SECTION 9 — TABLES

Tables are the hardest element to make responsive. Use the right pattern for each case.

### Pattern A — Horizontal Scroll (for data tables, simple grids)
```css
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
}
.table-wrapper table {
  min-width: 600px; /* force minimum width, let wrapper scroll */
  width: 100%;
}
```

### Pattern B — Stacked Cards (for comparison/feature tables)
```css
@media (max-width: 600px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }
  thead tr {
    display: none; /* hide header row */
  }
  tr {
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 1rem;
    padding: 0.75rem;
  }
  td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  td::before {
    content: attr(data-label); /* add data-label="Column Name" to each <td> in HTML */
    font-weight: 600;
    color: rgba(255,255,255,0.5);
  }
}
```

---

## SECTION 10 — ANIMATIONS & PERFORMANCE

### What to Disable on Mobile

```javascript
const isMobile = window.innerWidth <= 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const shouldReduceMotion = isMobile || prefersReducedMotion;

// Rules:
// DISABLE on mobile: parallax, particle systems, canvas animations,
//                    3D transforms, scroll-triggered stagger animations,
//                    video backgrounds, WebGL
// KEEP on mobile:    fade-ins, simple translateY entrances,
//                    CSS transitions on interaction (hover/tap),
//                    loading animations, progress indicators
```

### CSS Animation Controls
```css
/* Respect user preference globally */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Disable expensive effects on mobile */
@media (max-width: 768px) {
  .parallax-element {
    transform: none !important;
    will-change: auto !important;
  }
  .blur-background {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  canvas#particles {
    display: none;
  }
}
```

### Performance: Use `will-change` Sparingly
```css
/* Only add will-change to elements that are ACTUALLY animating */
.animated-element {
  will-change: transform, opacity;
}
/* Remove it after animation completes in JS */
element.addEventListener('animationend', () => {
  element.style.willChange = 'auto';
});
```

---

## SECTION 11 — CUSTOM CURSOR

Custom cursors are a desktop-only feature. They must be completely disabled on touch devices.

```css
/* Disable custom cursor on touch */
@media (hover: none), (pointer: coarse) {
  * { cursor: auto !important; }
  .custom-cursor { display: none !important; }
}
```
```javascript
// Also disable via JS for reliability
const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
if (isTouch) {
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) cursor.style.display = 'none';
  // If using cursor library (e.g. Kursor, MagicMouse):
  // Do not initialize it at all
}
```

---

## SECTION 12 — INTRO / LOADING ANIMATION (SPECIFIC TO THIS SITE)

If the site has a fullscreen intro/loader animation:

```javascript
const isMobile = window.innerWidth <= 768;

if (isMobile) {
  // OPTION A — Skip animation entirely, show page immediately
  const overlay = document.getElementById('intro-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    // trigger page entry animations directly
    triggerPageEntryAnimations();
  }

  // OPTION B — Show simplified version (recommended)
  // Show just the logo + ENTER button, skip the counter/arc animation
  skipLoaderPhases(); // implement this to jump straight to ENTER state
}
```

### On Mobile: Disable the Panel Split Exit
The left/right panel wipe uses translateX which can cause flicker on iOS.
Replace with a simple fade-out:
```javascript
function exitOverlay() {
  const overlay = document.getElementById('intro-overlay');
  if (window.innerWidth <= 768) {
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 500);
  } else {
    // full desktop panel split animation here
    runPanelSplitExit();
  }
}
```

---

## SECTION 13 — SPACING & PADDING SYSTEM

All section padding, margins, and gaps must scale down on mobile.

```css
/* Use clamp() for all major spacing */

section {
  padding: clamp(3rem, 8vw, 8rem) clamp(1rem, 5vw, 3rem);
}

.section-gap {
  margin-bottom: clamp(2rem, 6vw, 6rem);
}

/* Specific common cases */
@media (max-width: 768px) {
  section           { padding: 3rem 1.25rem; }
  .container        { padding: 0 1.25rem; }
  .card             { padding: 1.25rem; }
  .card-lg          { padding: 1.5rem; }
  h1 + p            { margin-top: 1rem; } /* reduce gap between hero headline and subtext */
}

@media (max-width: 480px) {
  section           { padding: 2.5rem 1rem; }
  .container        { padding: 0 1rem; }
}
```

---

## SECTION 14 — SPECIFIC ELEMENT SCENARIOS

### Scenario: Side-by-Side Text + Image → Stack on Mobile
```css
.text-image-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}
@media (max-width: 768px) {
  .text-image-block {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .text-image-block .image { width: 100%; }
}
```

### Scenario: Horizontal Scrolling Sections (project reels, carousels)
```css
.horizontal-scroll {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 1rem;
  padding-bottom: 1rem; /* space for scrollbar if visible */
}
.horizontal-scroll > * {
  flex: 0 0 80vw; /* each card takes 80% of viewport width */
  max-width: 320px;
  scroll-snap-align: start;
}
/* Hide scrollbar visually but keep functionality */
.horizontal-scroll::-webkit-scrollbar { display: none; }
.horizontal-scroll { scrollbar-width: none; }
```

### Scenario: Fixed Positioned Elements
```css
.sticky-cta {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
}
@media (max-width: 768px) {
  .sticky-cta {
    bottom: 0;
    right: 0;
    left: 0;
    border-radius: 0; /* full-width bar at bottom on mobile */
    padding: 1rem;
  }
}
```

### Scenario: Very Long Words / URLs Breaking Layout
```css
p, h1, h2, h3, td, li {
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}
```

### Scenario: Iframes (YouTube, Vimeo, Maps)
```html
<div class="video-wrapper">
  <iframe src="..." allowfullscreen></iframe>
</div>
```
```css
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 ratio */
  height: 0;
  overflow: hidden;
}
.video-wrapper iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}
```

### Scenario: SVG Icons Not Scaling
```css
svg {
  width: 100%;
  height: auto;
  max-width: 100%; /* never let SVG overflow */
}
/* For icon SVGs (fixed size desired) */
.icon-svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0; /* prevent compression in flex containers */
}
```

---

## SECTION 15 — TESTING CHECKLIST

After implementing all changes, verify each item in Chrome DevTools > Device Toolbar:

### Devices to Test
- iPhone SE (375px) — smallest common phone
- iPhone 14 (390px)
- Android average (360px)
- iPad (768px)
- iPad Pro (1024px)
- Desktop (1440px)

### Checklist Per Device
- [ ] No horizontal scroll at any breakpoint
- [ ] All text is readable without zooming (minimum 15px body)
- [ ] All buttons/links have at least 44px tap target
- [ ] Navigation opens, closes, and doesn't leave body scroll locked
- [ ] Images load and don't overflow their containers
- [ ] No text overlaps any other element
- [ ] Forms don't trigger iOS zoom (all inputs ≥ 16px font-size)
- [ ] Animations don't cause jank (check FPS in DevTools Performance)
- [ ] Custom cursor is hidden on touch
- [ ] Loader/intro animation exits cleanly
- [ ] All grid/flex layouts collapse correctly
- [ ] No element has a fixed px width wider than the viewport
- [ ] Footer is fully readable and not cut off
- [ ] Background videos are replaced with static images on mobile

---

## SECTION 16 — COMMON MISTAKES TO AVOID

| Mistake | Fix |
|---|---|
| `font-size: 14px` on inputs | Always use `font-size: 16px` on form inputs |
| `height: 100vh` on mobile | Use `height: 100svh` or `min-height: -webkit-fill-available` |
| `position: fixed` causing iOS bounce | Add `-webkit-overflow-scrolling: touch` to the scroll container |
| `overflow: hidden` on `<body>` for menu | Restore `overflow: ''` on close, not just hidden |
| Hover animations as the only UI feedback | Always pair with `:active` state for touch |
| `vw` units on font-size without `min` | Always use `clamp(minpx, Xvw, maxpx)` |
| `backdrop-filter` on mobile | Disable it — it kills performance on low-end phones |
| Forgetting `loading="lazy"` on images | Add to all images below the fold |
| Custom cursor JS running on mobile | Check for touch before initializing |

---

## SECTION 17 — FINAL IMPLEMENTATION ORDER

Follow this exact order to avoid conflicts:

1. Add viewport meta tag
2. Add global box-sizing + overflow-x hidden
3. Set responsive container widths
4. Scale typography with clamp()
5. Collapse all grid/flex layouts per breakpoint
6. Fix navigation (hamburger + drawer)
7. Fix hero section (height, alignment, video)
8. Fix all images (max-width:100%, lazy loading, picture tags)
9. Fix all form inputs (16px font, proper inputmode)
10. Disable custom cursor on touch
11. Disable parallax and heavy animations on mobile
12. Handle loader/intro animation for mobile
13. Fix padding/spacing with clamp or breakpoint overrides
14. Fix any remaining overflow issues (long words, tables, iframes)
15. Run full checklist on all breakpoints