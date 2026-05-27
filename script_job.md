# Script Job - Component Purposes

This document details the exact purpose of each component script that has been categorized and moved during the directory restructuring, based on the prior session scans.

## Effects Directory (`src/components/effects/`)

- **[ParticleSphere.jsx](file:///c:/Users/Anjana%20Enterprises/3D%20Objects/VSCodeProjects/Rhodium/Rhodium-Studio%20-%20Copy/src/components/effects/ParticleSphere.jsx)**
  - *Purpose*: Implements a interactive WebGL 3D particle sphere using Three.js. It responds dynamically to mouse movement, creating fluid and high-end visual physics behavior.

- **[IridescentSpheres.tsx](file:///c:/Users/Anjana%20Enterprises/3D%20Objects/VSCodeProjects/Rhodium/Rhodium-Studio%20-%20Copy/src/components/effects/IridescentSpheres.tsx)**
  - *Purpose*: Renders dynamic WebGL spheres with custom vertex/fragment shaders to achieve a high-fidelity "liquid chrome" iridescent mercury texture. Includes smooth parallax mouse tracking, orbit logic, and CSS glow highlights.

- **[CustomCursor.tsx](file:///c:/Users/Anjana%20Enterprises/3D%20Objects/VSCodeProjects/Rhodium/Rhodium-Studio%20-%20Copy/src/components/effects/CustomCursor.tsx)**
  - *Purpose*: Replaces the default browser cursor with a minimalist custom spring-physics cursor using Framer Motion (`motion/react`). Includes hover recognition for interactive HTML elements (anchors, buttons) to scale up automatically.

- **[ThreeFooter.tsx](file:///c:/Users/Anjana%20Enterprises/3D%20Objects/VSCodeProjects/Rhodium/Rhodium-Studio%20-%20Copy/src/components/effects/ThreeFooter.tsx)**
  - *Purpose*: A Three.js points/particles canvas overlay that drives a quiet, ambient vertical drifting motion in the background footer section of the website.

- **[ThreeHero.tsx](file:///c:/Users/Anjana%20Enterprises/3D%20Objects/VSCodeProjects/Rhodium/Rhodium-Studio%20-%20Copy/src/components/effects/ThreeHero.tsx)**
  - *Purpose*: Creates a floating, auto-rotating Wireframe Icosahedron canvas using Three.js with simple cursor parallax mapping to elevate the page landing.

- **[SphereWrapper.tsx](file:///c:/Users/Anjana%20Enterprises/3D%20Objects/VSCodeProjects/Rhodium/Rhodium-Studio%20-%20Copy/src/components/effects/SphereWrapper.tsx)**
  - *Purpose*: Handles responsive media queries to selectively mount/render the heavy `ParticleSphere` canvas overlay on larger displays while displaying static cover imagery on mobile screen sizes.

---

## UI Directory (`src/components/ui/`)

- **[SectionLabel.tsx](file:///c:/Users/Anjana%20Enterprises/3D%20Objects/VSCodeProjects/Rhodium/Rhodium-Studio%20-%20Copy/src/components/ui/SectionLabel.tsx)**
  - *Purpose*: A structural UI badge atom. Renders a unified upper-case section label prefixed by a minimalist solid border line for section headers.

- **[ServiceCard.tsx](file:///c:/Users/Anjana%20Enterprises/3D%20Objects/VSCodeProjects/Rhodium/Rhodium-Studio%20-%20Copy/src/components/ui/ServiceCard.tsx)**
  - *Purpose*: A reusable card component styling services. Displays an icon wrapper, a header title, a brief text description, and features glassmorphic background blurs on mouse pointer hovers.
