create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  source text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();

alter table public.leads enable row level security;

create policy "Service role has full access to leads"
  on public.leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
