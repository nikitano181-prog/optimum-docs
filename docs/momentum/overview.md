# Обзор проекта

## Оглавление
- [1. Резюме проекта (elevator pitch)](#1-резюме-проекта-elevator-pitch)
- [2. Ценность и сценарии использования](#2-ценность-и-сценарии-использования)
- [3. Архитектура и стек](#3-архитектура-и-стек)
- [4. Быстрый старт (локально)](#4-быстрый-старт-локально)
- [5. Переменные окружения (.env)](#5-переменные-окружения-env)
- [6. Структура проекта](#6-структура-проекта)
- [7. База данных (схема и SQL)](#7-база-данных-схема-и-sql)
- [8. Безопасность и RLS-политики](#8-безопасность-и-rls-политики)
- [9. API слои и интеграции](#9-api-слои-и-интеграции)
- [10. Фронтенд страницы и ключевые фичи](#10-фронтенд-страницы-и-ключевые-фичи)
- [11. Realtime (подписки и потоки)](#11-realtime-подписки-и-потоки)
- [12. Кэширование и производительность](#12-кэширование-и-производительность)
- [13. Начисление очков и лидерборд](#13-начисление-очков-и-лидерборд)
- [14. Деплой и CI/CD](#14-деплой-и-cicd)
- [15. Сценарий демо для жюри (5–7 минут)](#15-сценарий-демо-для-жюри-57-минут)
- [16. FAQ / Риски / Ограничения](#16-faq--риски--ограничения)
- [17. Roadmap (после хакатона)](#17-roadmap-после-хакатона)

---

## 1. Резюме проекта (elevator pitch)
Optimum — платформа для проведения квизов в реальном времени с друзьями и командами. Вы создаёте комнату, выбираете готовые вопросы из внешних баз или генерируете их с помощью ИИ, и сразу начинаете игру. Очки начисляются мгновенно, лидерборд обновляется онлайн.

Ключевые отличия:
- Реалтайм‑комнаты и честный подсчёт (+100/−50).
- Бесплатные вопросы из The Trivia API + генерация ИИ.
- Лидерборд по суммарным очкам, профили, друзья, заявки.

## 2. Ценность и сценарии использования
- Вечерние квиз‑вечеринки с друзьями (онлайн/офлайн).
- Командный тимбилдинг, обучающие викторины.
- Турниры на стримах и в комьюнити.

## 3. Архитектура и стек
- Фронтенд: Next.js (App Router), TypeScript, TailwindCSS.
- Бэкенд: API‑роуты Next.js, Supabase (Auth, Postgres, Realtime, Storage).
- Внешние источники вопросов: The Trivia API (без ключа), OpenTDB (как фолбэк, опционально).
- Хостинг: Vercel (рекомендуется), Supabase Cloud.

Диаграмма (упрощённо):
- UI (Next.js) ↔ API Routes (/api/...) ↔ Supabase (Postgres + Realtime)
- UI ↔ The Trivia API (через наш API‑прокси) ↔ Кэш в Postgres.

## 4. Быстрый старт (локально)
1) Установить зависимости:
```
pnpm i
# или npm i / yarn
```
2) Создать .env.local в www/optimum/ (см. раздел .env) и заполнить ключи.

3) Запустить дев‑сервер:
```
pnpm dev
# по умолчанию http://localhost:3020 (если настроено в package.json)
```

## 5. Переменные окружения (.env)
В www/optimum/.env.local:
- NEXT_PUBLIC_SUPABASE_URL=...
- NEXT_PUBLIC_SUPABASE_ANON_KEY=...
- SUPABASE_SERVICE_ROLE_KEY=... (серверный доступ для кэша, хранить только на серверной стороне)

Опционально для генерации ИИ (если используется собственный backend/LLM):
- OPENAI_API_KEY=... (или совместимый провайдер)

## 6. Структура проекта
Ключевые пути:
- `app/` — маршруты Next.js (App Router)
  - `dashboard/quizzes/ai/page.tsx` — комнаты с ИИ‑генерацией
  - `dashboard/quizzes/db/page.tsx` — готовые наборы из The Trivia API
  - `dashboard/leaderboard/page.tsx` — лидерборд
  - `dashboard/friends/page.tsx` — друзья, заявки
  - `dashboard/[code]/page.tsx` — игровая комната по коду
  - `api/db/quizzes/route.ts` — список “виртуальных подборок”
  - `api/db/quizzes/[id]/route.ts` — детали квиза + кэширование
- `src/components/` — UI блоки лендинга и общие компоненты
- `public/` — статика (иконки, баннеры, изображения)


## 7. База данных (схема и SQL)
Основные таблицы:
- profiles(id uuid pk, username text, full_name text, avatar_url text, ...)
- quiz_rooms(id uuid pk, code text unique, host_id uuid, question_duration_seconds int, created_at timestamptz)
- quiz_players(id uuid pk, room_id uuid fk, user_id uuid fk, display_name text, avatar_url text, score int default 0)
- quiz_questions(id uuid pk, room_id uuid fk, order_index int, prompt text, options text[], correct_index int)
- quiz_answers(id uuid pk, room_id uuid fk, question_id uuid fk, user_id uuid fk, selected_index int, created_at timestamptz default now())
- friend_requests(id uuid pk, from_id uuid fk, to_id uuid fk, status text check in ('pending','accepted','rejected'), created_at timestamptz default now(), unique(from_id, to_id))
- cached_quizzes(key text, provider text, data jsonb, ttl_seconds int default 86400, created_at timestamptz default now(), primary key(key, provider))

Пример SQL (миграция‑минимум):
```
create table if not exists quiz_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  host_id uuid not null,
  question_duration_seconds int not null default 30,
  created_at timestamptz not null default now()
);

create table if not exists quiz_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references quiz_rooms(id) on delete cascade,
  user_id uuid not null,
  display_name text,
  avatar_url text,
  score int not null default 0
);

create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references quiz_rooms(id) on delete cascade,
  order_index int not null,
  prompt text not null,
  options text[] not null,
  correct_index int not null
);

create table if not exists quiz_answers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references quiz_rooms(id) on delete cascade,
  question_id uuid not null references quiz_questions(id) on delete cascade,
  user_id uuid not null,
  selected_index int not null,
  created_at timestamptz not null default now()
);
create unique index if not exists quiz_answers_unique on quiz_answers(room_id, question_id, user_id);

create table if not exists friend_requests (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null,
  to_id uuid not null,
  status text not null check (status in ('pending','accepted','rejected')) default 'pending',
  created_at timestamptz not null default now(),
  unique (from_id, to_id)
);

create table if not exists cached_quizzes (
  key text not null,
  provider text not null,
  data jsonb not null,
  ttl_seconds int not null default 86400,
  created_at timestamptz not null default now(),
  primary key(key, provider)
);
```

## 8. Безопасность и RLS-политики
Рекомендуемые политики Supabase (примерно):
- profiles: select всем анонимно только публичные поля; update только владельцу (`id = auth.uid()`).
- quiz_rooms: select всем аутентифицированным; insert только владельцу, update — хосту.
- quiz_players: select всем участникам конкретной room_id; insert — любому аутентифицированному, update — по user_id=auth.uid().
- quiz_answers: select участникам room_id; insert один ответ на question_id (уникальный индекс), update запрещён.
- friend_requests:
  - insert: from_id = auth.uid() и from_id != to_id;
  - select: from_id=auth.uid() OR to_id=auth.uid();
  - update: только to_id=auth.uid() (принять/отклонить).
- cached_quizzes: RLS можно выключить; запись идёт сервисным ключом из серверного роута.

## 9. API слои и интеграции
Файлы:
- app/api/db/quizzes/route.ts — список “виртуальных подборок” из The Trivia API категорий × сложностей (без внешнего ключа).
- app/api/db/quizzes/[id]/route.ts — получение вопросов по id = category|difficulty|amount, нормализация к `{ prompt, options[], correct_index }`, best‑effort кэш в `cached_quizzes` через `SUPABASE_SERVICE_ROLE_KEY`.
- (Опционально) app/api/quizzes/generate — генерация вопросов ИИ для комнаты.

Форматы ответов:
- GET /api/db/quizzes → `{ items: { id, title, category, difficulty, question_count, description, cover_url }[] }`
- GET /api/db/quizzes/:id → `{ id, title, questions: { prompt, options, correct_index }[] }`

## 10. Фронтенд страницы и ключевые фичи
- dashboard/quizzes/ai/page.tsx — создание комнаты, подключение по коду, генерация ИИ, автовход хоста в quiz_players.
- dashboard/quizzes/db/page.tsx — каталог подборок, предпросмотр, импорт вопросов в quiz_questions, старт комнаты.
- dashboard/[code]/page.tsx — сам квиз: таймер, отправка ответов, подсветка, переход по вопросам, реалтайм‑обновления.
- dashboard/leaderboard/page.tsx — агрегированный рейтинг по сумме очков (аватары, full_name/@username).
- dashboard/friends/page.tsx — поиск @username, отправка заявок, принятие/отклонение, списки входящих/исходящих и друзей.

UI‑паттерны:
- Унифицированный сайдбар, топ‑бар; иконки — из /public/dashboard/*.
- Лёгкая тема, Tailwind‑классы, без тяжёлых зависимостей.

## 11. Realtime (подписки и потоки)
- Supabase Realtime используется для:
  - Обновления списков друзей и заявок (`friend_requests`, фильтр по `from_id` и `to_id`).
  - Обновления состава игроков в комнате (подписка на `quiz_players`) — чтобы видеть добавления/баллы.
  - (Опционально) канал комнаты для синхронизации состояния вопроса.

Практики:
- Локальные optimistic‑обновления, затем консолидация по событию.
- Отписка каналов на `unmount`.

## 12. Кэширование и производительность
- Кэш вопросов The Trivia API в таблице `cached_quizzes` (TTL по умолчанию 24 часа).
- В роутах Next.js — `revalidate` для категорий; вопросы — `no-store` (свежие), но с кэшем в БД.
- Лидерборд агрегируется на клиенте (выборка `user_id`, `score` из `quiz_players`), при нагрузке — вынести в `view/materialized view` или RPC.

## 13. Начисление очков и лидерборд
- Начисление очков в реальном времени при отправке ответа (`submitAnswer`):
  - правильный: `+100`, неправильный: `-50`;
  - одноразовый ответ на `question_id` (уникальный индекс по `quiz_answers`).
- `finishQuestion` не начисляет очки повторно — только `revealCorrect` и авто‑переход.
- Лидерборд: суммирование `quiz_players.score` по `user_id`, вывод топ‑100, привязка к `profiles`.
- Для атомарности инкремента рекомендуется RPC‑функция `increment_score(room_id, user_id, delta)`.

## 14. Деплой и CI/CD
- Vercel: импорт репозитория, указать `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Supabase: развёртывание схемы (SQL из раздела), включение Realtime на нужных таблицах.
- Ротация ключей и изоляция сервисного ключа — только в серверных окружениях.

## 15. Сценарий демо для жюри (5–7 минут)
1) Лэндинг: кратко — что такое Optimum (герой‑секция, фичи, тарифы).
2) Авторизация: зайти под двумя аккаунтами (разные браузеры/инкогнито).
3) Друзья: поиск по `@username`, отправить заявку, принять (realtime обновление списков).
4) Квизы из БД: открыть Квизы → База данных, выбрать подборку, задать длительность, создать комнату.
5) Вторая сторона присоединяется по коду. Ответить на 2–3 вопроса, показать автосчёт, подсветку и авто‑переход.
6) Открыть Лидерборд: показать суммарные очки и профили.
7) Коротко — кэш вопросов, безопасность (RLS), масштабируемость (RPC/матвью).

## 16. FAQ / Риски / Ограничения
- Вопрос: «Можно ли русскоязычные вопросы?»
  - Да: через ИИ‑генерацию/собственную БД. Наружные бесплатные API в основном англоязычные.
- Вопрос: «Что с накруткой очков?»
  - Уникальный ответ на вопрос, RPC для атомарного инкремента, RLS ограничивает запись.
- Вопрос: «Где хранится кэш?»
  - В `cached_quizzes`, TTL по умолчанию 24 часа.
- Ограничения: бесплатные провайдеры API по квизам имеют лимиты; кэширование и агрегации нивелируют.

## 17. Roadmap (после хакатона)
- Мультикомнаты и турниры (сеточная сетка/раунды).
- Моб. клиенты (PWA/React Native).
- Модерация вопросов и пользовательские наборы.
- Монетизация: Premium темы, брендирование, большие комнаты, API.