alter table public.profiles
  alter column role set default 'user',
  drop constraint if exists profiles_role_check,
  add constraint profiles_role_check check (role in ('user', 'owner', 'admin'));

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
    'user'
  )
  on conflict (id) do update set
    first_name = coalesce(public.profiles.first_name, excluded.first_name),
    last_name = coalesce(public.profiles.last_name, excluded.last_name);

  return new;
end;
$$;

update public.profiles
set role = 'user'
where role = 'owner'
  and not exists (
    select 1 from public.properties
    where properties.owner_id = profiles.id
  );

create table public.owner_access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  contact_email text not null,
  company_name text not null check (char_length(trim(company_name)) between 1 and 120),
  message text not null check (char_length(trim(message)) between 1 and 2000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id)
);

create unique index owner_access_requests_one_pending_per_user
  on public.owner_access_requests (user_id)
  where status = 'pending';

alter table public.owner_access_requests enable row level security;
grant select on public.owner_access_requests to authenticated;

create policy "Users can read their own owner access requests"
  on public.owner_access_requests for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

create or replace function public.submit_owner_access_request(
  p_company_name text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  request_id uuid;
  account_email text;
begin
  if current_user_id is null then
    raise exception 'You must be signed in to request owner access.';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = current_user_id and role = 'user'
  ) then
    raise exception 'Only regular user accounts can request owner access.';
  end if;

  if p_company_name is null or char_length(trim(p_company_name)) not between 1 and 120
    or p_message is null or char_length(trim(p_message)) not between 1 and 2000
  then
    raise exception 'Provide a business or owner name and a message of up to 2000 characters.';
  end if;

  select email into account_email
  from auth.users
  where id = current_user_id;

  if account_email is null then
    raise exception 'The email address for this account could not be found.';
  end if;

  insert into public.owner_access_requests (user_id, contact_email, company_name, message)
  values (current_user_id, account_email, trim(p_company_name), trim(p_message))
  returning id into request_id;

  return request_id;
end;
$$;

create or replace function public.review_owner_access_request(
  p_request_id uuid,
  p_approve boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  reviewer_id uuid := auth.uid();
  target_user_id uuid;
begin
  if reviewer_id is null or not exists (
    select 1 from public.profiles
    where id = reviewer_id and role = 'admin'
  ) then
    raise exception 'Only site administrators can review owner access requests.';
  end if;

  update public.owner_access_requests
  set status = case when p_approve then 'approved' else 'rejected' end,
      reviewed_at = now(),
      reviewed_by = reviewer_id
  where id = p_request_id and status = 'pending'
  returning user_id into target_user_id;

  if target_user_id is null then
    raise exception 'This request no longer exists or has already been reviewed.';
  end if;

  if p_approve then
    update public.profiles
    set role = 'owner'
    where id = target_user_id and role = 'user';

    if not found then
      raise exception 'The requester account is no longer eligible for owner access.';
    end if;
  end if;
end;
$$;

revoke all on function public.submit_owner_access_request(text, text) from public;
grant execute on function public.submit_owner_access_request(text, text) to authenticated;
revoke all on function public.review_owner_access_request(uuid, boolean) from public;
grant execute on function public.review_owner_access_request(uuid, boolean) to authenticated;

drop policy if exists "Owners can update their own properties" on public.properties;
create policy "Owners can update their own properties"
  on public.properties for update
  to authenticated
  using (
    (owner_id = (select auth.uid()) and exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role in ('owner', 'admin')
    ))
    or exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  )
  with check (
    (owner_id = (select auth.uid()) and exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role in ('owner', 'admin')
    ))
    or exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

drop policy if exists "Owners can delete their own properties" on public.properties;
create policy "Owners can delete their own properties"
  on public.properties for delete
  to authenticated
  using (
    (owner_id = (select auth.uid()) and exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role in ('owner', 'admin')
    ))
    or exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

drop policy if exists "Owners can update their property photos" on storage.objects;
create policy "Owners can update their property photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'property-images'
    and (
      (
        (storage.foldername(name))[1] = (select auth.uid())::text
        and exists (
          select 1 from public.profiles
          where id = (select auth.uid()) and role in ('owner', 'admin')
        )
      )
      or exists (
        select 1 from public.profiles
        where id = (select auth.uid()) and role = 'admin'
      )
    )
  )
  with check (
    bucket_id = 'property-images'
    and (
      (
        (storage.foldername(name))[1] = (select auth.uid())::text
        and exists (
          select 1 from public.profiles
          where id = (select auth.uid()) and role in ('owner', 'admin')
        )
      )
      or exists (
        select 1 from public.profiles
        where id = (select auth.uid()) and role = 'admin'
      )
    )
  );

drop policy if exists "Owners can delete their property photos" on storage.objects;
create policy "Owners can delete their property photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'property-images'
    and (
      (
        (storage.foldername(name))[1] = (select auth.uid())::text
        and exists (
          select 1 from public.profiles
          where id = (select auth.uid()) and role in ('owner', 'admin')
        )
      )
      or exists (
        select 1 from public.profiles
        where id = (select auth.uid()) and role = 'admin'
      )
    )
  );
