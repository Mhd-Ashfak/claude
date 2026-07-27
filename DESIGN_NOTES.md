# OMERO GYM — Design Specification & Layout Notes

This document lists the **exact size, colour, weight and x/y position** of every
text block, logo, button and card in the redesign.

## Reference frame

- All coordinates are measured on a **1440 × 900 px desktop viewport**.
- Content lives in a **centred shell of 1120 px** (`max-w-shell`).
  - On a 1440 px screen the shell starts at **x = 160 px** and ends at **x = 1280 px**.
- `x` = distance from the **left edge of the viewport** to the element's left edge.
- `y` = distance from the **top edge of the viewport** to the element's top edge.
- The layout is **fluid/responsive**: below 1440 px the shell shrinks and columns
  reflow (see "Responsive behaviour"). The pixel values here describe the desktop
  reference; treat them as the intended proportions, not fixed absolutes.

## Global design tokens

| Token | Value | Usage |
|-------|-------|-------|
| Page background | `#0a0a0b` (ink-950) | body |
| Card surface | `#151517` (ink-850) | cards, panels |
| Input / raised | `#1c1c20` (ink-800) | fields, buttons-ghost |
| Border | `rgba(255,255,255,0.06)` | card & divider borders |
| **Accent red** | `#e02434` | the ONLY strong colour — buttons, active states, links |
| Accent hover | `#f04452` | button hover |
| Primary text | `#ffffff` | headings/body |
| Muted text | `#9a9aa2` | subtitles/captions |
| Heading font | **Oswald** 500–700 | all display headings |
| Body font | **Inter** 400–600 | body, labels, buttons |
| Mono font | **JetBrains Mono** | reservation IDs, step numbers |

Font sizes (Tailwind scale): `xs 12px · sm 14px · base 16px · lg 18px · xl 20px · 2xl 24px · 3xl 30px · 4xl 36px · 5xl 48px`.

---

## Shared: Top Navbar (all pages)

The navbar is a pill bar, sticky at the top, sitting inside the 1120 px shell with 16 px outer padding.

| Element | Font / size | Weight | Colour | x (left) | y (top) | Size (w × h) |
|---------|-------------|--------|--------|----------|---------|--------------|
| Nav bar container | — | — | bg `#0f0f11` @80% + blur, 1px border | 176 | 16 | 1088 × 53 |
| Logo badge (dumbbell) | icon 18px | — | white on `#e02434`, radius 8 | 196 | 26 | 32 × 32 |
| Logo wordmark "OMERO GYM" | Oswald 18px | 700 | OMERO `#fff` / GYM `#e02434` | 236 | 31 | ~112 × 22 |
| Nav link "Classes & Sessions" | Inter 14px | 500 | white 70% (active = white on red pill) | ~560 | 30 | pill h 30 |
| Nav link "Book a Slot" | Inter 14px | 500 | white 70% | ~700 | 30 | pill h 30 |
| Nav link "My Workouts" | Inter 14px | 500 | white 70% | ~800 | 30 | pill h 30 |
| "Hello, {name}" | Inter 14px | 400 | white 70%, user icon red | ~1010 | 33 | auto |
| Logout button | Inter 14px | 600 | white on `#1c1c20`, 1px border | ~1180 | 27 | ~96 × 38 |
| (logged-out) Login link | Inter 14px | 500 | white 70% | ~1090 | 30 | auto |
| (logged-out) Create Account btn | Inter 14px | 600 | white on `#e02434` | ~1150 | 27 | ~130 × 38 |

- **Mobile (< 768 px):** links collapse into a hamburger button (right, 40 × 40) that opens a stacked dropdown.

## Shared: Background

- Fixed, full-viewport, base `#0a0a0b` with a single soft radial red glow at top-centre (10% opacity) — no heavy gradients.
- Faint 64 px dotted grid, masked to fade at the edges.
- Side watermark words (desktop ≥ 1024 px only), Oswald 30–36px, 700:
  - Left column at **x ≈ 0–210**, right column at **x ≈ 1230–1440**, both vertically centred.
  - Words: `DISCIPLINE` / `TODAY` / `STRENGTH` (white 5%) and `TOMORROW` (red 15%).

---

## Page 1 — Login  (`/login`)

Card is centred both axes. Card: 448 px wide (`max-w-md`), padding 32 px, `#151517`.
On 1440 × 900 the card left edge ≈ **x = 496**, top ≈ **y = 250**.

| Element | Font / size | Weight | Colour | x | y | Size |
|---------|-------------|--------|--------|---|---|------|
| Dumbbell badge | icon 24px | — | white on `#e02434`, radius 12 | 696 | 282 | 48 × 48 |
| "OMERO GYM PORTAL" | Oswald 24px | 700 | white | centred | 346 | auto |
| Subtitle | Inter 14px | 400 | muted `#9a9aa2` | centred | 380 | auto |
| Label "Email Address" | Inter 14px | 500 | white 80% | 528 | 424 | — |
| Email input | Inter 14px | 400 | text white, bg `#1c1c20` | 528 | 448 | 384 × 42 |
| Label "Password" | Inter 14px | 500 | white 80% | 528 | 506 | — |
| Password input | Inter 14px | 400 | white on `#1c1c20` | 528 | 530 | 384 × 42 |
| "Sign In" button | Inter 14px | 600 | white on `#e02434` | 528 | 592 | 384 × 44 |
| "Create an Account Here" | Inter 14px | 600 | `#e02434` | centred | 652 | — |

## Page 2 — Create Account  (`/register`)

Same centred card (448 px, 32 px padding). Because there are 4 fields the card is taller; top ≈ **y = 150**.

| Element | Font / size | Weight | Colour | x | y | Size |
|---------|-------------|--------|--------|---|---|------|
| UserPlus badge | icon 24px | — | white on `#e02434`, radius 12 | 696 | 182 | 48 × 48 |
| "CREATE ACCOUNT" | Oswald 24px | 700 | white | centred | 246 | auto |
| Subtitle | Inter 14px | 400 | muted | centred | 280 | auto |
| "Full Name" label + input | 14px | 500 / 400 | white / bg `#1c1c20` | 528 | 324 / 348 | 384 × 42 |
| "Email Address" label + input | 14px | 500 / 400 | " | 528 | 406 / 430 | 384 × 42 |
| "Phone Number" label + input | 14px | 500 / 400 | " (placeholder `+94 7X XXX XXXX`) | 528 | 488 / 512 | 384 × 42 |
| "Password" label + input | 14px | 500 / 400 | " (placeholder `Minimum 6 characters`) | 528 | 570 / 594 | 384 × 42 |
| bcrypt helper text | Inter 12px | 400 | white 40% | 528 | 640 | — |
| "Register Now" button | Inter 14px | 600 | white on `#e02434` | 528 | 672 | 384 × 44 |
| "Login Here" link | Inter 14px | 600 | `#e02434` | centred | 732 | — |

## Page 3 — Classes & Sessions  (`/classes`)

Hero is centred; section grid is 2 columns on desktop.

| Element | Font / size | Weight | Colour | x | y | Size |
|---------|-------------|--------|--------|---|---|------|
| Eyebrow "OMERO GYM — Session Catalog" | Inter 12px, tracking 0.22em | 600 | `#e02434` | centred | 109 | — |
| Hero "PICK YOUR SLOT." | Oswald 48px | 700 | white | centred | 140 | — |
| Hero "OWN THE FLOOR." | Oswald 48px | 700 | `#e02434` | centred | 190 | — |
| Hero subtitle (2 lines) | Inter 14px | 400 | muted | centred | 258 | max 512 |
| Filter pills (All + 3) | Inter 12px | 500 | active white/red, idle white70% | centred row | 312 | h 28 |
| Section heading dot + label | Oswald 14px, tracking 0.18em | 600 | white 90%, dot red | 160 | 420 | — |
| Session card | — | — | `#151517`, 1px border, radius 16 | 160 / 592 | 470 | 528 × ~180 |
| — card title | Oswald 16px | 600 | white | +24 into card | +24 | — |
| — card description | Inter 14px | 400 | muted | +24 | +52 | — |
| — price "LKR 1,500" | Oswald 24px | 700 | white | +24 | card btm-56 | — |
| — duration "· 90 mins" | Inter 12px | 400 | white 45%, clock icon | +24 | card btm-30 | — |
| — "Book Slot" button | Inter 14px | 600 | white on `#e02434` | card right-24 | aligned btm | ~118 × 40 |

Card grid gap = 16 px. Sections stacked with 48 px vertical gap. Order: Floor Access, Group Fitness, Personal Training.

## Page 4 — Book a Slot  (`/book`)

Two-column grid: left flow (fluid) + right sidebar fixed **360 px**. Gap 20 px.

| Element | Font / size | Weight | Colour | x | y | Size |
|---------|-------------|--------|--------|---|---|------|
| Eyebrow "Reserve Your Spot" | Inter 12px, 0.22em | 600 | `#e02434` | 160 | 109 | — |
| "BOOK A TRAINING SLOT" | Oswald 36px | 700 | white | 160 | 132 | — |
| Subtitle | Inter 14px | 400 | muted | 160 | 180 | — |
| Left card | — | — | `#151517`, radius 16 | 160 | 236 | ~720 × auto |
| Stepper pills 1/2/3 | Inter 12px (num mono) | active red text on red-15% | 184 | 260 | h 28 |
| "Session / Class" select | Inter 14px | 400 | white on `#1c1c20` | 184 | 330 | fluid × 42 |
| "1. Choose Booking Date" | Inter 14px | 500 | white 80% | 184 | 400 | — |
| Date input | 14px | 400 | white on `#1c1c20` | 184 | 424 | fluid × 42 |
| "2. Choose a Time Block" | 14px | 500 | white 80% | 184 | 490 | — |
| Empty-state placeholder | Inter 14px | 400 | white 40%, calendar icon | centred | 520 | dashed box |
| Time-block buttons (×6) | 14px | 500 | idle white80% / active white-on-red | grid 3-col | after date | h 46 |
| "Confirm Booking" button | 14px | 600 | white on `#e02434` | 184 | bottom | full × 44 |
| **Sidebar** Booking Summary card | — | — | `#151517` | 920 | 236 | 360 × auto |
| — "Booking Summary" header | Oswald 14px, 0.14em | 600 | white 90% | 940 | 250 | — |
| — "Selected Workout / Class" | Inter 12px | 400 | white 40% | 940 | 300 | — |
| — session title | Oswald 18px | 600 | white | 940 | 320 | — |
| — Duration value | Oswald 18px | 700 | white | 940 | 380 | — |
| — Session Cost value | Oswald 18px | 700 | `#e02434` | 1110 | 380 | — |
| — "Good to Know" card | — | — | `#151517` | 920 | ~470 | 360 × auto |
| — tips (×4) | Inter 14px | 400 | white 70%, red icons | 940 | per row | — |

## Page 5 — My Workouts Dashboard  (`/workouts`)

Two stacked panels (tables on desktop, cards on mobile).

| Element | Font / size | Weight | Colour | x | y | Size |
|---------|-------------|--------|--------|---|---|------|
| Dumbbell badge | icon 18px | — | red on red-15%, radius 8 | 160 | 100 | 36 × 36 |
| "MY WORKOUT DASHBOARD" | Oswald 30px | 700 | white | 208 | 102 | — |
| **Upcoming panel** | — | — | `#151517`, radius 16 | 160 | 170 | 1120 × auto |
| — panel header "Upcoming Scheduled Slots" | Oswald 14px, 0.16em | 600 | white 90%, calendar icon red | 180 | 184 | — |
| — table headers | Inter 12px, uppercase | 600 | white 40% | 180+ | 230 | — |
| — Reservation ID cell | JetBrains Mono 14px | 400 | `#e02434` | col 1 | rows | — |
| — Class/Session cell | Inter 14px | 500 | white | col 2 | rows | — |
| — Date/Cost cells | Inter 14px | 400 | white 70% | col 3–4 | rows | — |
| — Status badge "Confirmed" | Inter 12px | 500 | emerald text/bg-15% | col 5 | rows | pill |
| — "Cancel" button | Inter 12px | 600 | white on `#1c1c20`, X icon | col 6 (right) | rows | ~88 × 32 |
| **Past panel** "Past Session Logs" | Oswald 14px, 0.16em | 600 | white 90%, history icon red | 180 | below | — |
| — Status badge "Attended" | Inter 12px | 500 | sky text/bg-15% | col 5 | rows | pill |
| — "Book Again" button | Inter 12px | 600 | white on `#1c1c20`, rotate icon | col 6 | rows | ~112 × 32 |

Table row height ≈ 52 px; header cells padding-bottom 12 px; column left padding 20 px.

---

## Responsive behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| **< 640 px (mobile)** | Single column; session cards, booking columns and dashboard tables stack. Tables become stacked cards. Navbar → hamburger. Side watermark words hidden. Hero heading 36px. |
| **640–1024 px (tablet)** | Session catalog = 2 columns; Book page still stacks sidebar under the flow at the lower end. Watermarks hidden < 1024px. |
| **≥ 1024 px** | Side watermark words appear; Book page shows the 360 px sidebar beside the flow. |
| **≥ 1440 px** | Content locked to the centred 1120 px shell; extra space becomes side margin. |

## What changed from the original (minimal redesign)

- Removed the heavy red **linear-gradients** on cards, panels and the background. Red (`#e02434`) is now used **only** as an accent (primary buttons, active nav pill, links, section dots, key figures).
- Flat, consistent dark surfaces (`#151517`) with hairline `6%` white borders → cleaner, less noisy.
- Unified spacing, radii (16px cards / 12px inputs) and one type scale (Oswald + Inter).
- Everything is responsive with mobile card fallbacks for tables.
- Consistent focus rings and larger tap targets for accessibility.
