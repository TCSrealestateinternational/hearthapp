# Design System: The Serene Concierge

## 1. Overview & Creative North Star
**Creative North Star: "The Curated Sanctuary"**

This design system is built to dismantle the high-stress, data-heavy "trading floor" aesthetic common in real estate apps. Instead, we are creating a digital sanctuary that feels like a private consultation with a high-end concierge. 

To break the "template" look, we move away from rigid, boxy grids. We utilize **intentional asymmetry**, where images may bleed off-edge or overlap soft-colored containers. This system prioritizes breathing room (white space) as a luxury feature, using high-contrast typography scales (the interplay between Noto Serif and Manrope) to guide the user’s eye with editorial authority.

## 2. Colors & Tonal Depth
The palette is a sophisticated blend of botanical greens and warmed neutrals, designed to lower the user's heart rate.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts.
*   *Example:* A property description section using `surface-container-low` (#fdf9f1) should sit directly on a `background` (#fffbff) page without a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, like stacked sheets of fine, heavy-weight paper.
*   **Level 0 (Base):** `background` (#fffbff)
*   **Level 1 (Sections):** `surface-container-low` (#fdf9f1)
*   **Level 2 (Feature Cards):** `surface-container-highest` (#ebe8de)
*   **Level 3 (Interactive Elements):** `surface-container-lowest` (#ffffff)

### The "Glass & Gradient" Rule
To add a premium "soul," use Glassmorphism for floating navigation bars or quick-action overlays. Use a `surface` color at 70% opacity with a `20px` backdrop blur. For main CTAs, apply a subtle linear gradient from `primary` (#4f6c4b) to `primary-dim` (#435f3f) at a 135-degree angle to create a soft, tactile depth.

## 3. Typography: The Editorial Voice
We use a bi-font system to balance warmth with modern efficiency.

*   **Display & Headlines (Noto Serif):** These are our "Editorial" moments. Use `display-lg` and `headline-md` for property titles and welcome messages. The serif adds a sense of heritage, trust, and permanence.
*   **Titles & Body (Manrope):** Our "Functional" voice. Manrope's clean, geometric sans-serif nature ensures that technical data (sq ft, price, address) is legible and modern.
*   **The Hierarchy Rule:** Always pair a `headline-lg` (Serif) with a `body-md` (Sans) to create a clear distinction between "Storytelling" and "Information."

## 4. Elevation & Depth
We eschew traditional "drop shadows" in favor of **Tonal Layering**.

*   **Ambient Shadows:** If a floating element (like a "Book Viewing" button) requires a shadow, it must be tinted. Use the `on-surface` color (#393831) at 6% opacity with a `32px` blur and `8px` Y-offset. This mimics natural light filtered through a room.
*   **The "Ghost Border" Fallback:** If a layout requires a container for accessibility in complex forms, use the `outline-variant` (#bcb9b0) at **15% opacity**. Never use 100% opaque lines.
*   **Roundedness:** Adhere to the `lg` (2rem) scale for all primary cards and `xl` (3rem) for search bars to maintain the "soft" visual language.

## 5. Components

### Buttons
*   **Primary:** `primary` (#4f6c4b) fill with `on-primary` (#ffffff) text. Use `full` (9999px) roundedness.
*   **Secondary:** `primary-container` (#cbecc2) fill with `on-primary-container` (#3d5939) text.
*   **Tertiary:** No fill. `primary` text with an underline only on hover.

### Cards & Lists
*   **The "No-Divider" Rule:** Forbid 1px dividers between list items. Use 16px or 24px of vertical white space or a alternating `surface-container` shifts to separate items.
*   **Property Cards:** Use `surface-container-high` (#f1eee5) backgrounds. Images should have a `md` (1.5rem) corner radius.

### Input Fields
*   **Default State:** `surface-container-highest` (#ebe8de) background, no border, `md` corner radius.
*   **Focus State:** A 2px "Ghost Border" using `primary` at 30% opacity.

### Featured Components (Real Estate Specific)
*   **The Concierge Floating Action Button (FAB):** A `tertiary-container` (#feefda) glassmorphic circle that sits in the bottom right, providing instant access to a human agent.
*   **The Mood Filter:** Selection chips using `secondary-fixed-dim` (#c7dabd) for users to filter homes by "Vibe" (e.g., "Sun-drenched," "Quiet," "Entertainer’s Dream").

## 6. Do’s and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., 24px left, 32px right) for editorial layouts.
*   **Do** allow high-quality architectural photography to bleed into the background of `surface` containers.
*   **Do** use `tertiary` (#6e6353) for captions and secondary metadata to reduce visual noise.

### Don’t
*   **Don’t** use pure black (#000000). Use `inverse_surface` (#0f0e0b) if deep contrast is needed.
*   **Don’t** use "Alert Red" for everything. Use `error_container` (#fd795a) for a softer, less alarming warning state.
*   **Don’t** crowd the screen. If you are unsure, add another 8px of padding. Space is the primary indicator of premium service.