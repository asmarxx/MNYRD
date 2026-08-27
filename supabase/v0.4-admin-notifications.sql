-- MNYRD v0.4 — Admin Notification Center
-- Run ONCE in Supabase SQL Editor after the original MVP database script.

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  title text not null,
  body text,
  entity_type text,
  entity_id text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_notifications_created on public.admin_notifications(created_at desc);
create index if not exists idx_admin_notifications_unread on public.admin_notifications(is_read, created_at desc);
alter table public.admin_notifications enable row level security;

drop policy if exists "Admins read notifications" on public.admin_notifications;
create policy "Admins read notifications" on public.admin_notifications for select to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.account_type='admin' and p.is_active=true));

drop policy if exists "Admins update notifications" on public.admin_notifications;
create policy "Admins update notifications" on public.admin_notifications for update to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.account_type='admin' and p.is_active=true))
with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.account_type='admin' and p.is_active=true));

-- Admin visibility for moderation counts/data
drop policy if exists "Admins read all reports" on public.supplier_reports;
create policy "Admins read all reports" on public.supplier_reports for select to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.account_type='admin' and p.is_active=true));

drop policy if exists "Admins read all claims" on public.supplier_claims;
create policy "Admins read all claims" on public.supplier_claims for select to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.account_type='admin' and p.is_active=true));

create or replace function public.mnyrd_admin_notify() returns trigger language plpgsql security definer set search_path=public as $$
declare t text; b text; et text; eid text;
begin
  if tg_table_name='suppliers' then t:='مورد جديد'; b:=coalesce(new.name_ar,new.name,'تمت إضافة مورد جديد'); et:='supplier'; eid:=new.id::text;
  elsif tg_table_name='recommendations' then t:='ترشيح مورد جديد'; b:='تمت إضافة ترشيح جديد لأحد طلبات الموردين'; et:='recommendation'; eid:=new.id::text;
  elsif tg_table_name='supplier_feedback' then t:='تقييم جديد'; b:='تمت إضافة تجربة أو تقييم جديد لمورد'; et:='feedback'; eid:=new.id::text;
  elsif tg_table_name='questions' then t:='طلب مورد جديد'; b:=new.title; et:='question'; eid:=new.id::text;
  elsif tg_table_name='supplier_reports' then t:='بلاغ جديد'; b:=coalesce(new.details,'بلاغ جديد يحتاج مراجعة'); et:='report'; eid:=new.id::text;
  elsif tg_table_name='supplier_claims' then t:='طلب إثبات مورد'; b:='طلب جديد لملكية/إثبات صفحة مورد'; et:='claim'; eid:=new.id::text;
  end if;
  insert into public.admin_notifications(event_type,title,body,entity_type,entity_id)
  values(tg_table_name||'_created',t,b,et,eid);
  return new;
end; $$;

do $$ begin
  drop trigger if exists notify_admin_supplier on public.suppliers;
  create trigger notify_admin_supplier after insert on public.suppliers for each row execute function public.mnyrd_admin_notify();
  drop trigger if exists notify_admin_recommendation on public.recommendations;
  create trigger notify_admin_recommendation after insert on public.recommendations for each row execute function public.mnyrd_admin_notify();
  drop trigger if exists notify_admin_feedback on public.supplier_feedback;
  create trigger notify_admin_feedback after insert on public.supplier_feedback for each row execute function public.mnyrd_admin_notify();
  drop trigger if exists notify_admin_question on public.questions;
  create trigger notify_admin_question after insert on public.questions for each row execute function public.mnyrd_admin_notify();
  drop trigger if exists notify_admin_report on public.supplier_reports;
  create trigger notify_admin_report after insert on public.supplier_reports for each row execute function public.mnyrd_admin_notify();
  drop trigger if exists notify_admin_claim on public.supplier_claims;
  create trigger notify_admin_claim after insert on public.supplier_claims for each row execute function public.mnyrd_admin_notify();
end $$;

-- Enable realtime delivery for the notification center (safe if already added).
do $$ begin
  alter publication supabase_realtime add table public.admin_notifications;
exception when duplicate_object then null;
end $$;

-- IMPORTANT: promote your own existing profile to admin manually by email.
-- Replace YOUR_EMAIL below, then run the UPDATE separately:
-- update public.profiles p set account_type='admin'
-- from auth.users u where p.id=u.id and u.email='YOUR_EMAIL';
