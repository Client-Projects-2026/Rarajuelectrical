-- Admins that were already explicitly allowlisted are trusted accounts.
-- Promote them to owner once so they can manage future invitations.
alter table public.admin_users
  add column if not exists role text not null default 'admin'
    check (role in ('owner', 'admin')),
  add column if not exists email text;

update public.admin_users as admins
set email = users.email
from auth.users as users
where users.id = admins.user_id
  and admins.email is distinct from users.email;

alter table public.admin_users
  alter column email set not null;

create unique index if not exists admin_users_email_lower_idx
  on public.admin_users (lower(email));

update public.admin_users set role = 'owner';

comment on column public.admin_users.role is
  'owner can manage admin accounts; admin can manage site content and enquiries';
