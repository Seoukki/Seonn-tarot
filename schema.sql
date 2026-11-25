-- Skema Tarot Reveal. Jalankan SEKALI di Supabase → SQL Editor. Aman dijalankan ulang (idempotent).
-- Aplikasi hanya MEMBACA data kartu. Tidak ada tabel untuk pengguna atau cerita pengguna.

create table if not exists public.tarot_categories (
  id          text primary key,
  label       text not null,
  title       text not null,
  description text not null,
  sort_order  smallint not null default 0
);

create table if not exists public.tarot_cards (
  id                text primary key,
  name              text not null,
  card_number       smallint not null check (card_number between 0 and 21),
  arcana            text not null check (arcana in ('major', 'minor')),
  suit              text check (suit in ('wands', 'cups', 'swords', 'pentacles')),
  sort_order        smallint not null unique,
  image_path        text not null,
  keywords_upright  text[] not null,
  keywords_reversed text[] not null,
  meaning_upright   text not null,
  meaning_reversed  text not null,
  description       text not null,
  guidance_upright  text not null,
  guidance_reversed text not null,
  tone_upright      smallint not null check (tone_upright between -2 and 2),
  tone_reversed     smallint not null check (tone_reversed between -2 and 2),
  constraint tarot_cards_suit_matches_arcana check ((arcana = 'major' and suit is null) or (arcana = 'minor' and suit is not null))
);

create table if not exists public.tarot_card_categories (
  card_id     text not null references public.tarot_cards (id) on delete cascade,
  category_id text not null references public.tarot_categories (id) on delete cascade,
  weight      smallint not null default 1 check (weight between 1 and 3),
  primary key (card_id, category_id)
);

create table if not exists public.reading_templates (
  id             bigint generated always as identity primary key,
  card_id        text not null references public.tarot_cards (id) on delete cascade,
  category_id    text not null references public.tarot_categories (id) on delete cascade,
  position       text not null default 'general',
  orientation    text not null check (orientation in ('upright', 'reversed')),
  interpretation text not null,
  unique (card_id, category_id, position, orientation)
);

create index if not exists tarot_cards_arcana_suit_idx on public.tarot_cards (arcana, suit);
create index if not exists tarot_card_categories_category_idx on public.tarot_card_categories (category_id);
create index if not exists reading_templates_lookup_idx on public.reading_templates (card_id, orientation, category_id);

-- ---------- Row Level Security: publik hanya boleh SELECT ----------
alter table public.tarot_categories      enable row level security;
alter table public.tarot_cards           enable row level security;
alter table public.tarot_card_categories enable row level security;
alter table public.reading_templates     enable row level security;

drop policy if exists "public read categories" on public.tarot_categories;
drop policy if exists "public read cards"      on public.tarot_cards;
drop policy if exists "public read links"      on public.tarot_card_categories;
drop policy if exists "public read templates"  on public.reading_templates;

create policy "public read categories" on public.tarot_categories      for select to anon, authenticated using (true);
create policy "public read cards"      on public.tarot_cards           for select to anon, authenticated using (true);
create policy "public read links"      on public.tarot_card_categories for select to anon, authenticated using (true);
create policy "public read templates"  on public.reading_templates     for select to anon, authenticated using (true);

-- Tidak ada policy INSERT/UPDATE/DELETE → anon & authenticated tidak bisa menulis. Seed memakai service role (melewati RLS) hanya dari komputermu.
revoke insert, update, delete, truncate on public.tarot_categories, public.tarot_cards, public.tarot_card_categories, public.reading_templates from anon, authenticated;
