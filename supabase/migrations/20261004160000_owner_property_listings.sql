create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  role text not null default 'owner' check (role in ('owner', 'admin'))
);

alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists role text not null default 'owner';

update public.profiles
set role = 'owner'
where role is null or role <> 'admin';

create or replace function public.create_owner_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  full_name text := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'name', ''),
    ''
  );
begin
  insert into public.profiles (id, first_name, last_name, role)
  values (
    new.id,
    nullif(split_part(full_name, ' ', 1), ''),
    nullif(trim(substr(full_name, length(split_part(full_name, ' ', 1)) + 1)), ''),
    'owner'
  )
  on conflict (id) do update set
    first_name = coalesce(public.profiles.first_name, excluded.first_name),
    last_name = coalesce(public.profiles.last_name, excluded.last_name),
    role = case when public.profiles.role = 'admin' then 'admin' else 'owner' end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_owner_profile on auth.users;
create trigger on_auth_user_created_owner_profile
  after insert on auth.users
  for each row execute function public.create_owner_profile();

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  slug text not null unique,
  name text not null,
  owner_company_name text,
  location text not null,
  price numeric(12, 2) not null check (price > 0),
  listing text not null check (listing in ('buy', 'rent')),
  beds integer not null check (beds >= 0),
  baths numeric(4, 1) not null check (baths >= 0),
  area integer not null check (area > 0),
  style text not null,
  description text not null,
  features text[] not null default '{}',
  year_built integer not null check (year_built between 1600 and 2200),
  lot_size text not null,
  image_urls text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties enable row level security;

create policy "Anyone can read published properties"
  on public.properties for select
  using (status = 'published');

create policy "Owners can read their own properties"
  on public.properties for select
  to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

create policy "Owners can create their own properties"
  on public.properties for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role in ('owner', 'admin')
    )
  );

create policy "Owners can update their own properties"
  on public.properties for update
  to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  )
  with check (
    owner_id = (select auth.uid())
    or exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

create policy "Owners can delete their own properties"
  on public.properties for delete
  to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Anyone can view property photos"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "Owners can upload property photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role in ('owner', 'admin')
    )
  );

create policy "Owners can update their property photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'property-images'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or exists (
        select 1 from public.profiles
        where id = (select auth.uid()) and role = 'admin'
      )
    )
  )
  with check (
    bucket_id = 'property-images'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or exists (
        select 1 from public.profiles
        where id = (select auth.uid()) and role = 'admin'
      )
    )
  );

create policy "Owners can delete their property photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'property-images'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or exists (
        select 1 from public.profiles
        where id = (select auth.uid()) and role = 'admin'
      )
    )
  );
