-- ============================================================
-- JWT カスタムクレーム Hook
-- company_id と user_role を JWT に注入する
-- Supabase Dashboard > Authentication > Hooks で有効化が必要
-- ============================================================

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb as $$
declare
  claims jsonb;
  user_company_id uuid;
  user_role text;
begin
  select company_id, role into user_company_id, user_role
  from public.users
  where id = (event->>'user_id')::uuid;

  claims := event->'claims';

  if user_company_id is not null then
    claims := jsonb_set(claims, '{company_id}', to_jsonb(user_company_id::text));
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  end if;

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$ language plpgsql security definer;

-- Supabase Auth が hook を呼び出すための権限
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;
