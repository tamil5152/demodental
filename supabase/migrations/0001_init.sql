-- Dental clinic: bookings + callback requests.
-- All access goes through server code using the service-role key, so RLS is
-- enabled with NO policies (deny-all for anon/authenticated roles).
-- In Supabase Auth settings: DISABLE public sign-ups and create the clinic
-- owner's user manually (Authentication > Users).

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (phone ~ '^[0-9]{11,15}$'),
  email text,
  service text not null,
  appointment_date date not null,
  appointment_time text not null check (appointment_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  notes text check (char_length(notes) <= 500),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  source text not null default 'website',
  confirmation_sent boolean not null default false,
  reminder_sent boolean not null default false,
  review_requested boolean not null default false,
  created_at timestamptz not null default now()
);

-- One active booking per slot (cancelled / completed ones free the slot).
create unique index if not exists bookings_active_slot
  on public.bookings (appointment_date, appointment_time)
  where status in ('pending', 'confirmed');

create index if not exists bookings_date_idx on public.bookings (appointment_date);
create index if not exists bookings_phone_idx on public.bookings (phone);

create table if not exists public.callback_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (phone ~ '^[0-9]{11,15}$'),
  message text check (char_length(message) <= 500),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;
alter table public.callback_requests enable row level security;

revoke all on public.bookings from anon, authenticated;
revoke all on public.callback_requests from anon, authenticated;
