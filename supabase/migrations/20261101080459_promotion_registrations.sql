-- Apply only to the verified wayu organization / wayu.frontend project.
-- All reads and writes are server-only; no visitor can list subscribers.


create table public.promotion_registrations (
  id uuid primary key default gen_random_uuid(),
  campaign text not null default 'fiestas-patrias-prm-10-v1',
  full_name text not null check (char_length(full_name) between 5 and 100),
  phone text not null check (phone ~ '^\+519[0-9]{8}$'),
  email text not null check (email = lower(btrim(email)) and char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  discount_code text not null unique check (discount_code ~ '^WAYU10-[A-F0-9]{16}$'),
  discount_percent smallint not null default 10 check (discount_percent = 10),
  product_slug text not null default 'set-tabla-cuchillo-tenedor-prm-wayu',
  consent_version text not null default 'promo-v1-2026-11-01',
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  is_active boolean not null default true,
  expires_at timestamptz,
  email_status text not null default 'pending' check (email_status in ('pending', 'sending', 'sent', 'failed')),
  email_sent_at timestamptz,
  email_last_attempt_at timestamptz,
  email_window_started_at timestamptz not null default now(),
  email_attempts_in_window integer not null default 0,
  email_attempts integer not null default 0,
  email_locked_until timestamptz,
  email_delivery_token uuid,
  email_message_id text,
  email_error text,
  unique (campaign, email)
);

create index promotion_registrations_attempts_idx on public.promotion_registrations (email_last_attempt_at);
alter table public.promotion_registrations enable row level security;
revoke all on public.promotion_registrations from anon, authenticated;
grant select, insert, update on public.promotion_registrations to service_role;

comment on table public.promotion_registrations is 'Contact registrations, unique 10% PRM coupons and email delivery status. Server-only access.';

create function public.register_wayu_promotion(p_full_name text, p_phone text, p_email text, p_discount_code text)
returns table (registration_id uuid, recipient_name text, recipient_email text, issued_code text, delivery_token uuid, outcome text)
language plpgsql security invoker set search_path = ''
as $$
declare
  v_row public.promotion_registrations%rowtype;
  v_now timestamptz := clock_timestamp();
  v_email text := lower(btrim(p_email));
begin
  -- Serialize only this short transaction: duplicate requests cannot send twice.
  perform pg_advisory_xact_lock(hashtextextended('wayu-promo-registration', 0));
  select * into v_row from public.promotion_registrations
    where campaign = 'fiestas-patrias-prm-10-v1' and email = v_email for update;
  if found then
    if not v_row.is_active or (v_row.expires_at is not null and v_row.expires_at <= v_now) then
      return query select v_row.id, null::text, null::text, null::text, null::uuid, 'inactive'::text;
      return;
    end if;
    if v_row.email_locked_until > v_now then
      return query select v_row.id, null::text, null::text, null::text, null::uuid, 'busy'::text;
      return;
    end if;
    if v_row.email_sent_at > v_now - interval '60 seconds' then
      return query select v_row.id, null::text, null::text, null::text, null::uuid, 'cooldown'::text;
      return;
    end if;
    if v_row.email_window_started_at > v_now - interval '24 hours' and v_row.email_attempts_in_window >= 3 then
      return query select v_row.id, null::text, null::text, null::text, null::uuid, 'rate_limited'::text;
      return;
    end if;
  end if;

  -- Global caps remain effective even if a caller changes IP or email address.
  if (select count(*) from public.promotion_registrations where email_last_attempt_at > v_now - interval '1 minute') >= 20
     or (select count(*) from public.promotion_registrations where email_last_attempt_at > v_now - interval '1 hour') >= 120 then
    return query select null::uuid, null::text, null::text, null::text, null::uuid, 'rate_limited'::text;
    return;
  end if;

  if v_row.id is null then
    insert into public.promotion_registrations (full_name, phone, email, discount_code)
      values (btrim(p_full_name), p_phone, v_email, p_discount_code) returning * into v_row;
  end if;
  -- Existing contact data is not overwritten by unauthenticated repeat requests.
  update public.promotion_registrations set
    email_status = 'sending', email_locked_until = v_now + interval '2 minutes',
    email_delivery_token = gen_random_uuid(), email_last_attempt_at = v_now,
    email_attempts = email_attempts + 1,
    email_attempts_in_window = case when email_window_started_at <= v_now - interval '24 hours' then 1 else email_attempts_in_window + 1 end,
    email_window_started_at = case when email_window_started_at <= v_now - interval '24 hours' then v_now else email_window_started_at end,
    email_error = null
    where id = v_row.id returning * into v_row;
  return query select v_row.id, v_row.full_name, v_row.email, v_row.discount_code, v_row.email_delivery_token, 'ready'::text;
end;
$$;

create function public.complete_wayu_promotion_email(p_registration_id uuid, p_delivery_token uuid, p_sent boolean, p_message_id text default null, p_error text default null)
returns boolean language plpgsql security invoker set search_path = ''
as $$
declare v_count integer;
begin
  update public.promotion_registrations set
    email_status = case when p_sent then 'sent' else 'failed' end,
    email_sent_at = case when p_sent then now() else email_sent_at end,
    email_message_id = case when p_sent then left(p_message_id, 255) else email_message_id end,
    email_error = case when p_sent then null else left(p_error, 80) end,
    email_locked_until = null, email_delivery_token = null
    where id = p_registration_id and email_delivery_token = p_delivery_token;
  get diagnostics v_count = row_count;
  return v_count = 1;
end;
$$;

create function public.validate_wayu_discount(p_code text)
returns boolean language sql stable security invoker set search_path = ''
as $$
  select exists (
    select 1 from public.promotion_registrations
    where discount_code = upper(btrim(p_code)) and is_active
      and campaign = 'fiestas-patrias-prm-10-v1' and discount_percent = 10
      and product_slug = 'set-tabla-cuchillo-tenedor-prm-wayu'
      and (expires_at is null or expires_at > now())
  );
$$;

revoke all on function public.register_wayu_promotion(text,text,text,text) from public, anon, authenticated;
revoke all on function public.complete_wayu_promotion_email(uuid,uuid,boolean,text,text) from public, anon, authenticated;
revoke all on function public.validate_wayu_discount(text) from public, anon, authenticated;
grant execute on function public.register_wayu_promotion(text,text,text,text) to service_role;
grant execute on function public.complete_wayu_promotion_email(uuid,uuid,boolean,text,text) to service_role;
grant execute on function public.validate_wayu_discount(text) to service_role;
