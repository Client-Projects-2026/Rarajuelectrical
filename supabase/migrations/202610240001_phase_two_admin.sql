create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;

create table if not exists public.site_settings (
  id smallint primary key check (id = 1),
  business_name text not null,
  phone_display text not null,
  phone_link text not null,
  whatsapp text not null,
  email text not null,
  location text not null,
  hero_title text not null default 'Electrical systems, built for what''s next.',
  hero_description text not null default 'Industrial electrical engineering and power solutions across Andhra Pradesh.',
  about_title text not null default 'Electrical work planned around your site.',
  about_description text not null default '',
  projects_title text not null default 'Electrical work built around uptime',
  projects_description text not null default '',
  socials jsonb not null default '[]'::jsonb check (jsonb_typeof(socials) = 'array'),
  services jsonb not null default '[]'::jsonb check (jsonb_typeof(services) = 'array'),
  updated_at timestamptz not null default now()
);

insert into public.site_settings (
  id, business_name, phone_display, phone_link, whatsapp, email, location,
  about_title, about_description, projects_title, projects_description, socials, services
) values (
  1,
  'Raraju Electrical Engineering Power Solution Works',
  '+91 79935 01001',
  '+917993501001',
  '917993501001',
  'pkrarajuele7yam@gmail.com',
  '5.36/5, Ground Floor, Kotta Colony, Venturu, Rayavaram Mandal, East Godavari, Andhra Pradesh 533225',
  'Electrical work planned around your site.',
  'Raraju Electrical Engineering Power Solution Works provides control panel board and cable works, electronic systems, cable management, lightning protection, industrial lighting and preventive maintenance.',
  'Electrical work built around uptime',
  'Typical scopes of work across control panels, cable systems, lighting and drives. Contact us to discuss your site requirements.',
  '[{"name":"Facebook","href":"https://www.facebook.com/profile.php?id=61578043001778"},{"name":"Instagram","href":"https://www.instagram.com/raraju_electrical77/"},{"name":"IndiaMART","href":"https://m.indiamart.com/raraju-electrical-engineering-power-solution-works/control-panel-board.html"}]'::jsonb,
  '[{"number":"01","title":"Control panel boards & cables","description":"All types of control panel boards and HT/LT cable works for industrial and commercial facilities.","image":"/service-control-panels.jpg","imageAlt":"Electrician wiring an industrial control panel"},{"number":"02","title":"Electronic systems","description":"PCB, VFD and sensor works, including installation, troubleshooting and system integration.","image":"/service-electronic-systems.jpg","imageAlt":"Technician testing a circuit board at an engineering bench"},{"number":"03","title":"Cable management systems","description":"Automatic panel cable tray installation and cable laying, planned for organized electrical distribution.","image":"/service-cable-management.jpg","imageAlt":"Electrician organizing industrial cables on an overhead tray"},{"number":"04","title":"Lightning protection","description":"Lightning arrestor erection and earthing works to protect buildings and electrical infrastructure.","image":"/service-lightning-protection.jpg","imageAlt":"Electricians inspecting lightning protection on a factory roof"},{"number":"05","title":"Industrial lighting","description":"Industrial lighting installation, upgrades and maintenance for factories and commercial facilities.","image":"/service-industrial-lighting.jpg","imageAlt":"Electrician inspecting a high-bay LED light in a warehouse"},{"number":"06","title":"Preventive maintenance","description":"Thermal imaging inspections, load testing and scheduled maintenance to keep electrical systems operating reliably.","image":"/service-preventive-maintenance.jpg","imageAlt":"Engineer using a thermal camera to inspect switchgear"}]'::jsonb
) on conflict (id) do nothing;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 140),
  category text not null check (char_length(category) between 1 and 80),
  description text not null check (char_length(description) between 1 and 800),
  image_url text not null check (image_url like '/%' or image_url like 'https://%'),
  image_alt text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.projects (title, category, description, image_url, image_alt, sort_order, is_published)
values
  ('Industrial control panel work', 'Control panels', 'Example scope: control panel installation, wiring and commissioning.', '/project-control-panel.jpg', 'Industrial switchgear and control panels on a factory floor', 1, true),
  ('HT cable laying', 'Cable works', 'Example scope: HT/LT cable routing, laying and termination.', '/project-ht-cable.jpg', 'Electrician working on industrial electrical equipment', 2, true),
  ('Industrial lighting', 'Industrial lighting', 'Example scope: industrial lighting installation and upgrades.', '/project-factory-lighting.jpg', 'Switchgear serving a factory production area', 3, true),
  ('VFD system work', 'VFD systems', 'Example scope: VFD installation, setup and troubleshooting.', '/project-vfd-water-treatment.jpg', 'Technician inspecting an electrical control panel', 4, true)
on conflict do nothing;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (char_length(phone) between 6 and 32),
  company text not null default '',
  email text not null default '',
  customer_type text not null,
  service text not null,
  project_location text not null default '',
  message text not null check (char_length(message) between 1 and 3000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

create table if not exists public.admin_sign_ins (
  id bigint generated always as identity primary key,
  admin_user_id uuid not null references public.admin_users(user_id) on delete cascade,
  admin_email text not null,
  signed_in_at timestamptz not null default now()
);

create table if not exists public.inquiry_rate_limits (
  fingerprint text primary key check (fingerprint ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0)
);

create or replace function public.claim_inquiry_slot(p_fingerprint text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_window timestamptz := date_trunc('hour', now());
  attempts integer;
begin
  if p_fingerprint !~ '^[a-f0-9]{64}$' then
    return false;
  end if;

  insert into public.inquiry_rate_limits (fingerprint, window_started_at, request_count)
  values (p_fingerprint, current_window, 1)
  on conflict (fingerprint) do update
    set window_started_at = case
          when public.inquiry_rate_limits.window_started_at < current_window then current_window
          else public.inquiry_rate_limits.window_started_at
        end,
        request_count = case
          when public.inquiry_rate_limits.window_started_at < current_window then 1
          else public.inquiry_rate_limits.request_count + 1
        end
  returning request_count into attempts;

  delete from public.inquiry_rate_limits
  where window_started_at < current_window - interval '1 day';

  return attempts <= 5;
end;
$$;

revoke all on function public.claim_inquiry_slot(text) from public, anon, authenticated;
grant execute on function public.claim_inquiry_slot(text) to service_role;

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists admin_sign_ins_signed_in_at_idx on public.admin_sign_ins (signed_in_at desc);
create index if not exists projects_published_order_idx on public.projects (is_published, sort_order);

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.inquiries enable row level security;
alter table public.admin_sign_ins enable row level security;

revoke all on public.admin_users, public.site_settings, public.projects, public.inquiries, public.admin_sign_ins, public.inquiry_rate_limits from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select on public.site_settings, public.projects to anon, authenticated;
grant update on public.site_settings to authenticated;
grant insert, update, delete on public.projects to authenticated;
grant select, update, delete on public.inquiries to authenticated;
grant select on public.admin_sign_ins to authenticated;
grant insert on public.inquiries, public.admin_sign_ins to service_role;
grant select, insert, update, delete on public.inquiry_rate_limits to service_role;
grant usage, select on sequence public.admin_sign_ins_id_seq to service_role;

create policy "Admins can verify their own access"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Public can read site settings"
  on public.site_settings for select to anon, authenticated using (true);
create policy "Admins can update site settings"
  on public.site_settings for update to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

create policy "Public can read published projects"
  on public.projects for select to anon
  using (is_published);
create policy "Signed-in admins can read projects"
  on public.projects for select to authenticated
  using (is_published or (select public.is_site_admin()));
create policy "Admins can insert projects"
  on public.projects for insert to authenticated
  with check ((select public.is_site_admin()));
create policy "Admins can update projects"
  on public.projects for update to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));
create policy "Admins can delete projects"
  on public.projects for delete to authenticated
  using ((select public.is_site_admin()));

create policy "Admins can read inquiries"
  on public.inquiries for select to authenticated
  using ((select public.is_site_admin()));
create policy "Admins can update inquiries"
  on public.inquiries for update to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));
create policy "Admins can delete inquiries"
  on public.inquiries for delete to authenticated
  using ((select public.is_site_admin()));

create policy "Admins can read sign-in history"
  on public.admin_sign_ins for select to authenticated
  using ((select public.is_site_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read project images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'project-images');
create policy "Admins can upload project images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-images' and (select public.is_site_admin()));
create policy "Admins can update project images"
  on storage.objects for update to authenticated
  using (bucket_id = 'project-images' and (select public.is_site_admin()))
  with check (bucket_id = 'project-images' and (select public.is_site_admin()));
create policy "Admins can delete project images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-images' and (select public.is_site_admin()));
