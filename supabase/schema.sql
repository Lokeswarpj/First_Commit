-- CampusLink Database Schema

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  college_email text not null,
  year int check (year between 1 and 4),
  is_mentor boolean default false,
  skills text[] default '{}',
  interests text default '',
  slots text[] default '{}',        -- wkday_aft, wkday_eve, wkend_morn, wkend_aft
  created_at timestamptz default now()
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  kind text check (kind in ('teammate','mentor','notes','others')),
  text text not null,
  slots text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id) on delete cascade,
  candidate_id uuid references profiles(id) on delete cascade,
  score numeric,
  parts jsonb,
  reason text,
  feedback text check (feedback in ('good','bad')),
  created_at timestamptz default now()
);

create table if not exists connections (
  id uuid primary key default gen_random_uuid(),
  from_id uuid references profiles(id),
  to_id uuid references profiles(id),
  request_id uuid references requests(id),
  status text default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz default now()
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id),
  title text not null,
  subject text,
  tags text[] default '{}',
  file_url text,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Row Level Security: enable on every table
alter table profiles enable row level security;
alter table requests enable row level security;
alter table matches enable row level security;
alter table connections enable row level security;
alter table resources enable row level security;

-- Policies:
-- profiles: select for authenticated; update where id = auth.uid()
create policy "Profiles are viewable by authenticated users" 
  on profiles for select 
  to authenticated 
  using (true);

create policy "Users can update their own profile" 
  on profiles for update 
  to authenticated 
  using (auth.uid() = id);

create policy "Users can insert their own profile" 
  on profiles for insert 
  to authenticated 
  with check (auth.uid() = id);

-- requests: select/insert/delete where user_id = auth.uid()
create policy "Users can view their own requests" 
  on requests for select 
  to authenticated 
  using (auth.uid() = user_id);

create policy "Users can insert their own requests" 
  on requests for insert 
  to authenticated 
  with check (auth.uid() = user_id);

create policy "Users can delete their own requests" 
  on requests for delete 
  to authenticated 
  using (auth.uid() = user_id);

-- matches: select for the request owner
create policy "Users can view matches for their requests" 
  on matches for select 
  to authenticated 
  using (
    exists (
      select 1 from requests 
      where requests.id = matches.request_id 
      and requests.user_id = auth.uid()
    )
  );

create policy "Service role or match engine can insert matches" 
  on matches for insert 
  to authenticated 
  with check (true);

-- connections: select where auth.uid() in (from_id, to_id); insert where from_id = auth.uid()
create policy "Users can view connections they are part of" 
  on connections for select 
  to authenticated 
  using (auth.uid() in (from_id, to_id));

create policy "Users can initiate connections" 
  on connections for insert 
  to authenticated 
  with check (auth.uid() = from_id);

create policy "Users can update connections they received" 
  on connections for update 
  to authenticated 
  using (auth.uid() = to_id);

-- resources: select for authenticated; insert where owner_id = auth.uid()
create policy "Resources are viewable by authenticated users" 
  on resources for select 
  to authenticated 
  using (true);

create policy "Users can insert their own resources" 
  on resources for insert 
  to authenticated 
  with check (auth.uid() = owner_id);

