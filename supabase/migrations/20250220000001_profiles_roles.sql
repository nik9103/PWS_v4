-- Роли приложения (не встроенные роли Supabase Auth).
-- Хранятся в таблице public.profiles (поле role).
-- При авторизации: auth.uid() → запрос к profiles по id → получаем role.

-- Роли: спортсмен (athlete), судья (judge), спортивный менеджер (manager), администратор (admin)

create type public.user_role as enum (
  'athlete',   -- Спортсмен
  'judge',     -- Судья
  'manager',   -- Спортивный менеджер
  'admin'      -- Администратор
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'athlete',
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Пользователь может читать только свой профиль
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Обновлять свой профиль
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Вставка профиля: триггер при регистрации или service_role при seed
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Триггер: при создании пользователя в auth.users создаём запись в profiles с ролью по умолчанию
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'athlete');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

comment on table public.profiles is 'Профили пользователей с ролями: athlete, judge, manager, admin';
