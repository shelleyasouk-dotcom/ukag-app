-- Document purchases table
create table if not exists document_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  product_id text not null,
  price_paid_pence integer not null,
  stripe_session_id text,
  stripe_payment_intent text,
  status text not null default 'pending', -- pending | paid | failed
  personalisation jsonb,
  personalised_path text,
  purchased_at timestamptz default now(),
  renewed_from uuid references document_purchases(id)
);

-- RLS
alter table document_purchases enable row level security;

-- Users can see only their own purchases
create policy "Users view own purchases"
  on document_purchases for select
  using (auth.uid() = user_id);

-- Service role inserts (via Edge Functions)
create policy "Service role insert"
  on document_purchases for insert
  with check (true);

create policy "Service role update"
  on document_purchases for update
  using (true);

-- Index for profile lookup
create index if not exists document_purchases_user_id_idx on document_purchases (user_id);
create index if not exists document_purchases_status_idx on document_purchases (status);
