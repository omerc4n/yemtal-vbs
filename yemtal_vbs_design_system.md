---
name: "YEMTAL-VBS Institutional"
description: "A modern, clean, institutional web dashboard design system for Turkish high school SMS & attendance notifications."
---

## Overview

YEMTAL-VBS (Yunus Emre Mesleki ve Teknik Anadolu Lisesi - Veli Bilgilendirme Sistemi) is an institutional SaaS dashboard designed for school administrators, principals, and teachers. The visual direction balances official institutional credibility with crisp, modern web software aesthetics: light slate foundations (#F8FAFC), pure white card surfaces (#FFFFFF), hairline slate borders (#E2E8F0), authoritative deep navy blue (#1E3A8A) primary accents, and vibrant emerald green (#10B981) for operational status and affirmative SMS credits.

## Colors

The color palette reflects institutional authority, trust, clarity, and status-focused school notifications.

- **Primary (Deep Navy):** Represents institutional reliability, school administration, and primary actions.
- **Secondary (Emerald Green):** Highlights affirmative operational states, Netgsm SMS balance, and e-Okul synchronization.
- **Tertiary (Teal / Cyan):** Signals integration, e-Okul Chrome extension activity, and API telemetry.
- **Surface & Background:** Soft slate-gray backdrop (#F8FAFC) paired with crisp white card containers (#FFFFFF).
- **Status Tones:** Amber and Crimson for missing contact data, missing parent phone numbers, and urgent attendance warnings.

```yaml
colors:
  navy: "#1E3A8A"
  emerald: "#10B981"
  teal: "#0D9488"
  amber: "#D97706"
  crimson: "#DC2626"
  light:
    primary: "#1E3A8A"
    on-primary: "#FFFFFF"
    secondary: "#10B981"
    on-secondary: "#393939"
    tertiary: "#0D9488"
    on-tertiary: "#1D1D1D"
    surface: "#FFFFFF"
    on-surface: "#0F172A"
    surface-variant: "#F1F5F9"
    on-surface-variant: "#475569"
    background: "#F8FAFC"
    on-background: "#0F172A"
    outline: "#E2E8F0"
    outline-variant: "#CBD5E1"
    error: "#DC2626"
    on-error: "#FFFFFF"
  dark:
    primary: "#93C5FD"
    on-primary: "#1E3A8A"
    secondary: "#6EE7B7"
    on-secondary: "#064E3B"
    tertiary: "#5EEAD4"
    on-tertiary: "#134E4A"
    surface: "#0F172A"
    on-surface: "#F8FAFC"
    surface-variant: "#1E293B"
    on-surface-variant: "#94A3B8"
    background: "#020617"
    on-background: "#F8FAFC"
    outline: "#334155"
    outline-variant: "#475569"
    error: "#F87171"
    on-error: "#450A0A"
```

## Typography

The typography system pairs **Wix Madefor Display** for bold, clean institutional headlines and numbers with **Instrument Sans** for highly legible administrative data tables, menus, and notification badges. Monospace numerals in status badges and phone metrics leverage **Red Hat Mono**.

```yaml
typography:
  display-lg:
    fontFamily: "Wix Madefor Display"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 44px
    letterSpacing: -0.5px
  display-lg-mobile:
    fontFamily: "Wix Madefor Display"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "Wix Madefor Display"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: -0.25px
  headline-md:
    fontFamily: "Wix Madefor Display"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 30px
    letterSpacing: -0.15px
  headline-sm:
    fontFamily: "Wix Madefor Display"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 26px
  title-lg:
    fontFamily: "Instrument Sans"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 26px
  title-md:
    fontFamily: "Instrument Sans"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  title-sm:
    fontFamily: "Instrument Sans"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  body-lg:
    fontFamily: "Instrument Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md:
    fontFamily: "Instrument Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm:
    fontFamily: "Instrument Sans"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
  label-lg:
    fontFamily: "Instrument Sans"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: "Instrument Sans"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.2px
  label-sm:
    fontFamily: "Instrument Sans"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 14px
    letterSpacing: 0.3px
  code-md:
    fontFamily: "Red Hat Mono"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 18px
```

## Layout & Spacing

A desktop-first administrative layout centered around a structured left navigation sidebar (260px fixed width) and a fluid, responsive main workspace. Section containers follow an 8px modular spacing rhythm.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 40px
  page-margin: 24px
```

## Elevation & Depth

Subtle, crisp elevation using thin 1px borders (#E2E8F0) paired with soft ambient diffusion shadows (`0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)`). High-priority warning cards and active action banners utilize soft colored tints instead of heavyDrop shadows.

## Shapes

Clean, rounded geometric corners providing a tactile, contemporary SaaS feel while preserving structured school record layouts.

```yaml
rounded:
  sm: 6px
  DEFAULT: 8px
  md: 10px
  lg: 12px
  xl: 16px
  full: 9999px
```

## Motion & Micro-interaction

Understated, swift transitions (150ms) for accordion expanding, button hovers, badge popups, and quick-action triggers.

```yaml
motion:
  state-change:
    duration: 150ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 200ms
    delay: 0ms
    timingFunction: cubic-bezier(0.16, 1, 0.3, 1)
```

## Voice & Content Strategy

Institutional, accurate, and functional Turkish educational terminology:
- Clear action verbs: "REHBERE GİT", "EKSİKLERİ GÖR", "Devamsızlık SMS Ekranına Git".
- Official phrasing: "YEMTAL-VBS", "Kurum Kodu", "Netgsm SMS Kredisi", "e-Okul Eklentisi", "Veli Bilgilendirme Sistemi".
- Concise, scannable data metrics without ambiguity.

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Badge** → `@components/badge.html`: `badge-numeric`, `badge-dot`
- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
