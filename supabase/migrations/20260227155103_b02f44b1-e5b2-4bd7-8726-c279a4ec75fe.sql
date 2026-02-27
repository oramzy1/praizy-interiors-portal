
-- Fix function search path for validate_booking_status
create or replace function public.validate_booking_status()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.status not in ('pending', 'accepted', 'rejected', 'proposed') then
    raise exception 'Invalid booking status: %', new.status;
  end if;
  return new;
end;
$$;

-- Fix function search path for update_updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
