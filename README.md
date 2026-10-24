# Raraju Electrical Engineering Power Solution Works website

A responsive single-page electrical services website built with React, TypeScript, and Vite. Its navy-and-cyan visual direction follows `design-reference/RA-Raja-Electrical-reference.png`. Netlify serves the production build from `dist/` and collects quote requests through Netlify Forms.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`.

## Update business content

- Edit contact details and service categories in `src/data.ts`. Project copy and image assignments live in `src/projects/data.ts`; the carousel UI and its styles are in `src/projects/`.
- Page sections are split into focused components in `src/components/`, while the enquiry section and Netlify form logic live in `src/contact/`.
- Global styling is organized by page area in `src/styles/`. `src/theme.css` imports these files in cascade order.
- The project carousel shows three cards on desktop, advances automatically, and pauses while hovered or focused. It respects reduced-motion preferences.
- The hero has two slides, timed rotation, previous/next and dot controls, plus a pause button. It pauses while hovered or keyboard-focused and respects reduced-motion settings.
- Service and project cards use separate generated photographs in `public/`. They are illustrative visuals; use verified onsite photos when you want to document the exact completed jobs.
- The second hero slide uses `design-reference/Factory Electrical Backbone, Illuminated.png`; its existing blue routes are traced by the animated SVG overlay. The original logo (`RaRaja.png`) remains in `public/`.
- Confirm the final business name and contact details before publishing. Empty phone and WhatsApp settings send visitors to the enquiry form instead of opening invalid contact links.

## Netlify form

The quote request form is declared in `index.html` for Netlify's build-time form detection and submits to Netlify Forms. After deploying, enable form notifications and select the email address that should receive enquiries in the Netlify site settings.
