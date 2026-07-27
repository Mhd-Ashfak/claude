# OMERO GYM

A clean, minimal and fully responsive redesign of the OMERO GYM booking web app.

Red is used **only as an accent** — no heavy linear gradients. Dark, flat surfaces,
one type scale (Oswald + Inter), and mobile-first responsive layouts.

## Pages

| Route | Page |
|-------|------|
| `/login` | Portal login |
| `/register` | Create account |
| `/classes` | Session catalog (floor access, group classes, personal training) |
| `/book` | Book a training slot (date + time block + summary) |
| `/workouts` | Workout dashboard (upcoming + past sessions) |

## Tech stack

- **Vite + React 18** with **react-router-dom**
- **Tailwind CSS** for styling (design tokens in `tailwind.config.js`)
- **lucide-react** icons
- Auth + bookings persisted in `localStorage` (mock — no backend required to preview)

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview the build
```

Then open the printed local URL. Use any email/password to log in (it's a mock auth layer).

## Design spec

See **[DESIGN_NOTES.md](./DESIGN_NOTES.md)** for the exact size, colour, weight and
x/y position of every text block, logo, button and card.
