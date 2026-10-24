# Raraju Electrical Engineering Power Solution Works website

A responsive single-page electrical services website built with React, TypeScript, and Vite. Its navy-and-cyan visual direction follows `design-reference/RA-Raja-Electrical-reference.png`. Vercel serves the production build from `dist/` and runs the API functions; Supabase stores editable website content, enquiries, project images, and admin sign-in records.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`. Use `vercel dev` to run the API functions locally.

## Update business content

- Edit contact details and service categories in `src/data.ts`. Project copy and image assignments live in `src/projects/data.ts`; the carousel UI and its styles are in `src/projects/`.
- Page sections are split into focused components in `src/components/`, while the enquiry form and Vercel API functions live in `src/contact/` and `api/`.
- Global styling is organized by page area in `src/styles/`. `src/theme.css` imports these files in cascade order.
- The project capability carousel loops automatically, supports swipe/drag and arrow/dot navigation, and has a persistent pause control. It pauses on hover or focus and respects reduced-motion preferences.
- The hero has two slides, timed rotation, previous/next and dot controls, plus a pause button. It pauses while hovered or keyboard-focused and respects reduced-motion settings.
- Service and project cards use separate generated photographs in `public/`. They are illustrative visuals; use verified onsite photos when you want to document the exact completed jobs.
- The second hero slide uses `design-reference/Factory Electrical Backbone, Illuminated.png`; its existing blue routes are traced by the animated SVG overlay. The original logo (`RaRaja.png`) remains in `public/`.
- Confirm the business phone, WhatsApp, email, address, and social profiles directly with the client before publishing. Current project cards describe typical scopes and are not verified customer case studies.

## Admin and enquiry data

The contact section includes a lazy-loaded Google Maps embed and directions link based on the supplied business address; verify the mapped pin before launch. Quote requests are stored in Supabase through a Vercel Function and reviewed in the private admin dashboard. For Supabase, admin provisioning, Vercel environment variables, data policies, and launch checks, follow [Phase 2 admin setup](docs/PHASE_TWO_ADMIN_SETUP.md).
