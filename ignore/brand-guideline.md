---
name: rhodium-studio-brand-guidelines
description: Defines the visual identity and brand standards for Rhodium Studio, focusing on premium dark-mode aesthetics, glassmorphism, and sophisticated typography.
---

# Rhodium Studio Brand Styling

## Overview

Rhodium Studio's brand identity is built on a "Premium Dark" aesthetic. It utilizes a monochromatic palette with heavy emphasis on depth, subtle glows, and glassmorphic elements to create a state-of-the-art digital feel.

**Keywords**: premium, dark mode, minimalist, glassmorphism, rhodium, luxury, digital agency, high-end, monochrome

## Brand Guidelines

### Colors

**Primary Palette:**

- **Background (BG)**: `#000000` — Pure black for maximum depth.
- **Surface**: `#050505` — Slightly elevated surfaces for depth separation.
- **Text**: `#FFFFFF` — High-contrast white for clarity.
- **Muted**: `#A1A1AA` — Zinc/Gray for secondary information and labels.
- **Accent**: `#FFFFFF` — White is used as the primary accent for a minimalist look.

**Decorative Elements:**

- **Border**: `rgba(255, 255, 255, 0.08)` — Subtle glass borders.
- **Grid**: `rgba(255, 255, 255, 0.04)` — Ultra-subtle background grid (120px size).
- **Glow**: `rgba(255, 255, 255, 0.08)` — Soft radial glows for focal points.

### Typography

- **Display (Headings)**: `Geist`, `Inter Tight`, `sans-serif`
    - **Weight**: 800 (Extra Bold)
    - **Letter Spacing**: `-0.08em` for H1, `-0.06em` for H2.
- **Body Text**: `Inter`, `sans-serif`
    - **Weight**: 400 (Regular)
- **UI/System**: `Inter`, `Geist Mono`, `monospace`
    - **Usage**: Labels, navigation, and technical data.

### Philosophy & Voice

- **Core Motto**: "Simplicity is sophistication."
- **Brand Voice**: Professional, surgical, cinematic, and engineering-focused.
- **Targeting**: Modern tech brands and high-performance products.

### Spacing System

- Sections use generous cinematic spacing.
- Default vertical spacing: 120px–160px.
- Components should never feel cramped.
- Negative space is a core part of the aesthetic.

### Motion

- Motion should feel smooth, subtle, and intentional.
- Avoid aggressive spring animations.
- Use slow fades, blur reveals, and soft parallax.
- Animation should enhance depth, not distract from content.

### Shape and Visual Style

- **Glassmorphism**: Components should use `backdrop-blur-[20px]` and `bg-black/65`.
- **Corners**: Large corner radii for buttons (`rounded-2xl`) and cards.
- **Elevation**: Use `box-shadow: 0 0 40px rgba(255, 255, 255, 0.04)` instead of heavy traditional shadows.
- **Cursor**: The interface uses a custom cursor system (no standard pointer).
- **Selection**: `bg-white`, `text-black` (inverted selection).

## Technical Implementation

### Tailwind Theme Configuration

```css
@theme {
  --font-display: "Geist", "Inter Tight", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-ui: "Inter", "Geist Mono", monospace;

  --color-bg: #000000;
  --color-surface: #050505;
  --color-text: #FFFFFF;
  --color-muted: #A1A1AA;
  --color-accent: #FFFFFF;
  --color-border: rgba(255, 255, 255, 0.08);
}
```

### Components

- **Fluid H1**: `text-[clamp(4rem,10vw,8.5rem)] font-extrabold tracking-[-0.08em] leading-[0.85]`
- **Primary Button**: `bg-[#050505] border border-white/10 rounded-2xl px-10 py-5 transition-all`
- **Label**: `font-ui text-[13px] uppercase tracking-[0.2em] text-muted` (Note: Updated to 13px per Home.tsx)
