
-- Create app_role enum
create type public.app_role as enum ('admin', 'user');

-- User roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- Security definer function for role checks
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

-- RLS: users can read own roles
create policy "Users can read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

-- Admin settings table
create table public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  recovery_email text,
  display_username text default 'admin',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.admin_settings enable row level security;

create policy "Admins can manage settings" on public.admin_settings
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Bookings table
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_phone text,
  service_type text not null,
  budget_range text,
  project_description text,
  preferred_date date,
  preferred_time text,
  status text default 'pending',
  admin_notes text,
  proposed_date date,
  proposed_time text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.bookings enable row level security;

-- Validation trigger for booking status
create or replace function public.validate_booking_status()
returns trigger
language plpgsql
as $$
begin
  if new.status not in ('pending', 'accepted', 'rejected', 'proposed') then
    raise exception 'Invalid booking status: %', new.status;
  end if;
  return new;
end;
$$;

create trigger check_booking_status
  before insert or update on public.bookings
  for each row execute function public.validate_booking_status();

-- Anyone can create bookings (public form)
create policy "Anyone can create bookings" on public.bookings
  for insert to anon, authenticated with check (true);

-- Only admins can read/update/delete bookings
create policy "Admins can read bookings" on public.bookings
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update bookings" on public.bookings
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete bookings" on public.bookings
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Portfolio items
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null default 'General',
  image_url text not null,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table public.portfolio_items enable row level security;

create policy "Anyone can view portfolio" on public.portfolio_items
  for select to anon, authenticated using (true);
create policy "Admins can manage portfolio" on public.portfolio_items
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table public.services enable row level security;

create policy "Anyone can view services" on public.services
  for select to anon, authenticated using (true);
create policy "Admins can manage services" on public.services
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_role text,
  content text not null,
  rating int default 5,
  featured boolean default false,
  created_at timestamptz default now()
);
alter table public.testimonials enable row level security;

create policy "Anyone can view testimonials" on public.testimonials
  for select to anon, authenticated using (true);
create policy "Admins can manage testimonials" on public.testimonials
  for all to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Function to auto-update updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_bookings_updated_at
  before update on public.bookings
  for each row execute function public.update_updated_at();

create trigger set_admin_settings_updated_at
  before update on public.admin_settings
  for each row execute function public.update_updated_at();
