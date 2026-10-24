# Phase 2 admin setup

Vercel hosts the public site and runs the API functions. Supabase stores admin authentication, editable site settings, services, projects, project images, enquiries, and successful admin sign-in events. The admin is at `/admin`.

## 1. Create Supabase resources

1. Create a Supabase project in the business owner's account.
2. Open **SQL Editor** and run `supabase/migrations/202610240001_phase_two_admin.sql`.
3. In **Authentication → Users**, create the first admin account. Do not enable public sign-up.
4. Copy that user's UUID from the Users page and run this in SQL Editor:

   ```sql
   insert into public.admin_users (user_id)
   values ('PASTE-THE-AUTH-USER-UUID-HERE');
   ```

5. After the first admin is allowlisted, run `supabase/migrations/202610240002_admin_user_management.sql`. Existing allowlisted accounts are promoted to **Owner** so the first account can manage users from `/admin`.

After the initial setup, Owners can invite staff from **Admin users** in `/admin`. Supabase sends an invitation link; each person sets their own password. The site never displays or stores admin passwords. Configure Supabase Auth email/SMTP and add the production `/admin` URL to **Authentication → URL Configuration → Redirect URLs** so invitations can return to the dashboard. Owners can assign **Administrator** or **Owner** roles, change roles, and remove access. At least one Owner must remain. Administrators can manage the website and enquiries, but cannot manage admin accounts.

Remove a user's row from `admin_users` to revoke admin access. The account management API also deletes the Supabase Auth account when an owner removes a user.

The migration enables row-level security. Visitors can read published projects, public contact settings, and public project images. Enquiries and sign-in history are private; only allowlisted admins can read or update them. New enquiries can be written only by the server function.

## 2. Configure Vercel environment variables

Set these in **Vercel → Project → Settings → Environment Variables**:

| Variable | Used by | Value |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser build | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser build | Supabase publishable key; safe to expose with the migration's RLS policies |
| `SUPABASE_URL` | Vercel Functions | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Sign-in audit function | Supabase publishable key |
| `SUPABASE_SECRET_KEY` | Vercel Functions only | Supabase server secret key; never add a `VITE_` prefix or commit it |
| `SITE_ORIGIN` | Enquiry function | Canonical site origin, such as `https://www.example.com`, without a trailing slash |
| `RATE_LIMIT_SECRET` | Enquiry function | Random secret of at least 32 characters used to hash client IPs before rate-limit storage |

You can use `.env.example` as a local template, but keep `.env` private. The privileged Supabase secret belongs only in Vercel's server environment; it must never be included in browser code. Set the `VITE_` variables for the Vercel build and the remaining values for the Function runtime. Apply them to Production and Preview as needed, then redeploy.

Vercel discovers the Web Handler functions in `api/`: `/api/submit-enquiry` stores enquiries and `/api/record-admin-sign-in` records verified sign-ins. The Vercel routing, SPA fallback, and security headers are in `vercel.json`. Enquiries are limited to five valid submissions per client IP per hour; only an HMAC fingerprint is stored for that limit.

For local development, `npm run dev` serves the Vite pages but not the Vercel API functions. Use `vercel dev` with the Vercel project linked and local environment variables configured to test sign-in audit and enquiry submission.

## 3. Use the admin

- Visit `/admin` and sign in with an account already added to `admin_users`.
- **Overview** shows the number of successful admin sign-ins, enquiry count, project count, and recent sign-ins. Failed logins are not counted. Each successful authentication session is counted once.
- **Projects** supports create, edit, publish, unpublish, ordering, deletion, and image upload. Uploaded images are public website assets; enquiry data remains private.
- **Enquiries** lists submissions and lets an admin mark them New, Contacted, or Closed.
- **Site content** edits the business name and contact details, hero and about copy, all six service titles/descriptions/images, project section copy, and social/directory links.
- **Admin users** is available to Owners. It sends Supabase invitations, assigns Owner or Administrator access, and removes accounts. Passwords are set by invitees through Supabase Auth.

## 4. Verify before launch

1. Sign in as the provisioned admin; confirm an unlisted Supabase account is denied.
2. Add and publish a test project, then verify it appears on the public page and is editable in `/admin`.
3. Submit a test enquiry and confirm it appears in the private Enquiries view. Check validation, honeypot behavior, and the rate limit. Any historical submissions from Netlify Forms remain in that former Netlify site and are not automatically imported into Supabase.
4. Change a social link and business phone, save, and confirm the public footer and call controls update.
5. Confirm the Supabase project has backups enabled and decide who can access the Supabase and Vercel consoles.

Admin sign-in records are an operational count, not a tamper-proof security audit trail. Use Supabase's authentication logs for security investigations.
