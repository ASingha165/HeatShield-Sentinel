---
name: Climate Resilience Operational System
colors:
  surface: '#f6faf7'
  surface-dim: '#d7dbd8'
  surface-bright: '#f6faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f5f2'
  surface-container: '#ebefec'
  surface-container-high: '#e5e9e6'
  surface-container-highest: '#dfe3e1'
  on-surface: '#181d1b'
  on-surface-variant: '#424844'
  inverse-surface: '#2d3130'
  inverse-on-surface: '#eef2ef'
  outline: '#727974'
  outline-variant: '#c2c8c2'
  surface-tint: '#4a6457'
  primary: '#00130a'
  on-primary: '#ffffff'
  primary-container: '#0f291e'
  on-primary-container: '#769283'
  inverse-primary: '#b0cdbd'
  secondary: '#5a605c'
  on-secondary: '#ffffff'
  secondary-container: '#dfe4df'
  on-secondary-container: '#606662'
  tertiary: '#1c0a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b1c00'
  on-tertiary-container: '#d27200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce9d8'
  primary-fixed-dim: '#b0cdbd'
  on-primary-fixed: '#062016'
  on-primary-fixed-variant: '#324c3f'
  secondary-fixed: '#dfe4df'
  secondary-fixed-dim: '#c3c8c3'
  on-secondary-fixed: '#181d1a'
  on-secondary-fixed-variant: '#434844'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f6faf7'
  on-background: '#181d1b'
  surface-variant: '#dfe3e1'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
  metric-display:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.03em
  metric-display-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system serves municipal field directors, occupational health coordinators, and community organizers managing extreme thermal exposure in vulnerable urban and peri-urban environments. The interface balances institutional authority with urgent operational clarity.

The visual style merges structured editorial ergonomics with high-reliability industrial dashboard design:
- **Authority without alarmism**: Critical heat-stress metrics and wet-bulb globe temperature (WBGT) projections are delivered through structured, measured visual weights rather than sensory-overloading sirens.
- **Field-tested legibility**: Tailored for high-glare handheld usage under harsh sunlight and low-bandwidth rural-urban fringe monitoring stations. High-contrast typography and deliberate information density replace decorative gradients and superfluous visual ornamentation.
- **Civic dignity**: Surfaces convey public-health rigor, grounding real-time biometeorological data in calm, disciplined layouts suitable for government briefings and rapid street-level interventions.

## Colors

The palette establishes an organic, clinical baseline that reserves high-chroma tones strictly for environmental risk states.

### Primary & Interface Foundations
- **Primary Deep Forest (`#0F291E`)**: Serves as the primary anchor for dominant structural elements, key brand touchpoints, top-level navigation, and primary interactive call-to-actions.
- **Secondary Charcoal (`#1E2320`)**: Used for high-emphasis typography, dark borders, and technical structural panels where deep contrast against light backgrounds is required.
- **Base Canvas & Sage Surfaces (`#F8FAF8`, `#F0F4F1`)**: Canvas background sits on `#F8FAF8`, while sub-panels, elevated cards, and utility drawers transition to `#F0F4F1` to reduce stark glare without degrading contrast.
- **Structural Stroke (`#D1DCD3`)**: Used across card borders, tabular dividers, and metric containers to maintain visual containment without heavy lines.

### Critical Risk Scale (Occupational Biometeorology)
- **Extreme Danger (`#DC2626`)**: Reserved exclusively for immediate work stoppage, mandatory hydration-cooling pauses, and critical heat-stroke conditions.
- **High Risk / Heat Stress Alert (`#D97706`)**: Denotes dangerous WBGT thresholds, active heatwave advisories, and mandatory shaded rest cycles.
- **Moderate Caution (`#B45309`)**: Denotes rising temperatures requiring vigilance for physical laborers.
- **Normal / Safe Operations (`#15803D`)**: Indicates standard working conditions within acceptable thermal limits.

All text pairings strictly achieve a minimum contrast ratio of 4.5:1 for standard body copy and 3.0:1 for large display metrics against their respective backing surfaces.

## Typography

The type scale uses Inter across all tiers to maintain rapid scanning, tall x-height, and neutral precision across micro-labels and dense technical grids.

- **Tabular Numerals (`font-feature-settings: 'tnum' on, 'cv05' on`)**: Essential for biometeorological gauges, WBGT tables, and localized ward-level forecasts to prevent jitter during live data feeds.
- **Editorial Sub-headings**: Section headers utilize `headline-lg` paired with `label-caps` for categorical taxonomy (e.g., "WARD 64 • CENTRAL KOLKATA • OCCUPATIONAL WATCH").
- **Metric Values**: Quantitative indicators rely on `metric-display`, accompanied by compact, bold baseline units to guarantee instant comprehension from distance or via handheld devices in direct sunlight.

## Layout & Spacing

The layout employs a structured 12-column responsive grid system engineered for information density and multi-panel operational consoles.

### Breakpoint Strategy
- **Mobile (< 768px)**: 4 columns. Gutter: `1.25rem` (20px). Margin: `1rem` (16px). Stacked single-column card flows with persistent top alert rails for ambient heat emergency warnings.
- **Tablet (768px – 1024px)**: 8 columns. Gutter: `1.25rem` (20px). Margin: `1.5rem` (24px). Split layout accommodating spatial heat maps alongside responsive metric feeds.
- **Desktop (>= 1025px)**: 12 columns. Gutter: `1.5rem` (24px). Margin: `2.5rem` (40px). Max content container constrained to 1440px to retain editorial readability and avoid excessively wide data visualizations.

Vertical rhythmic pacing uses a consistent 4px/8px incremental rhythm, prioritizing dense spatial conservation within live telemetry panes while allowing open breathing room within incident reports and health protocols.

## Elevation & Depth

Visual hierarchy relies on structural containment, low-contrast boundary strokes, and tonal layering rather than dramatic drop shadows.

- **Surface Tiers**:
  - **Ground**: Base viewport canvas rendered in `#F8FAF8`.
  - **Level 1 (Cards & Data Sections)**: Solid `#FFFFFF` or pale sage `#F0F4F1` containers enclosed with a crisp 1px stroke of `#D1DCD3`.
  - **Level 2 (Active Panels & Popovers)**: `#FFFFFF` surfaces with a 1px border of `#0F291E` at 15% opacity, combined with a subtle ambient shadow: `0 4px 16px -2px rgba(15, 41, 30, 0.06), 0 2px 4px -1px rgba(15, 41, 30, 0.04)`.
  - **Level 3 (Modal Dialogs & Critical Interventions)**: High-priority situational overrides sit above an ambient backdrop scrim (`#0F291E` at 40% opacity) using an elevation shadow of `0 12px 32px -4px rgba(15, 41, 30, 0.14)`.
- **Atmospheric Containment**: No pure black shadows. Every shadow cast carries an environmental tint derived from `#0F291E`, providing visual depth that integrates with the deep forest palette.

## Shapes

The interface balances soft, humane geometry with administrative structure. Cards, structural panels, and prominent metric containers standardize on a balanced 12px border radius.

- **Cards & Primary Modules**: 12px (`rounded-lg` under token scale 2). Prevents clinical visual harshness while conserving usable screen area across multi-column data views.
- **Micro-Controls (Inputs, Buttons, Dropdowns)**: 8px (`rounded` under token scale 2). Provides compact, distinct click targets.
- **Badges, Status Chips, & Pill Meters**: 9999px (full pill). Used exclusively for situational categorization and live operational status tokens to differentiate metadata chips from interactive square controls.

## Components

### Buttons
- **Primary Operational Button**: Background `#0F291E`, text `#FFFFFF`, border-radius 8px, height 40px, padding `0 18px`. Hover: `#1B3E2E`. Active: `#091A13`. Text label rendered in `label-lg`.
- **Critical Action Button (Emergency Dispatch / Alert Issuance)**: Background `#DC2626`, text `#FFFFFF`, border-radius 8px. Hover: `#B91C1C`.
- **Secondary Outlined Button**: Background transparent, border 1px solid `#D1DCD3`, text `#1E2320`. Hover: `#F0F4F1` with border `#0F291E`.

### Cards & Telemetry Tiles
- **Standard Card**: Background `#FFFFFF`, border 1px solid `#D1DCD3`, border-radius 12px, padding `space-lg`.
- **Alert Status Card (High Risk)**: Background `#FFFBEB`, left border accent 4px solid `#D97706`, standard border 1px solid `#FDE68A`, border-radius 12px.
- **Hazard Stop Card (Extreme Danger)**: Background `#FEF2F2`, left border accent 4px solid `#DC2626`, standard border 1px solid `#FECACA`, border-radius 12px.

### Status Chips & Badges
- Compact capsules using full roundedness (9999px), height 24px, padding `0 10px`, font size `label-caps`.
- **Safe / Normal**: Background `#DCFCE7`, text `#15803D`, border 1px solid `#BBF7D0`.
- **Advisory (Heat Caution)**: Background `#FEF3C7`, text `#B45309`, border 1px solid `#FDE68A`.
- **Emergency (Work Halted)**: Background `#FEE2E2`, text `#991B1B`, border 1px solid `#FECACA`.

### Input Fields & Selectors
- Standard height 40px, border 1px solid `#D1DCD3`, background `#FFFFFF`, border-radius 8px, padding `0 12px`, typography `body-md`. Focus state uses a clean 2px ring in `#0F291E` with zero blur offset.

### Checkboxes & Radio Controls
- Base dimension 18px × 18px, border 1.5px solid `#D1DCD3`, background `#FFFFFF`. Selected state switches background to `#0F291E` with a crisp `#FFFFFF` checkmark/indicator.

### Domain-Specific Components
- **WBGT Thermal Matrix Gauge**: Segmented linear progress strip mapped to 4-tier health danger zones, featuring a fixed 2px tracking needle and direct contextual text label.
- **Worker Hydration & Rest Protocol Banner**: Editorial layout containing bold numeric rest-to-work ratios (e.g., "45m WORK / 15m REST") housed inside an off-white `#F0F4F1` container with high-contrast `#1E2320` typographic metrics.
- **Ward-Level Heat Anomaly Timeline**: Compact sparkline and tabular row showing hourly forecast metrics with automatic risk-band color indicators matching occupational health guidelines.