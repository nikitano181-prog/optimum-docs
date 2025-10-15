# Архитектура системы

Обновлённая целевая архитектура на базе Next.js и Supabase.

## Общая архитектура

```
┌────────────────┐      HTTP/SSR/ISR       ┌──────────────────────────┐
│   Next.js UI   │ ───────────────────────▶ │   Next.js API Routes     │
│ (App Router)   │ ◀─────────────────────── │  (/app/api/...)          │
└────────────────┘                          └────────────┬─────────────┘
           ▲                                               │
           │Realtime (channels, row-level changes)         │SQL/Storage/Auth
           │                                               ▼
      ┌────┴────┐      Auth / Postgres / Realtime / Storage / Edge Functions
      │Supabase │ ◀──────────────────────────────────────────────────────────
      └────┬────┘
           │ HTTP (proxy)
           ▼
   ┌────────────────┐
   │ The Trivia API │  → Кэш вопросов в Postgres (`cached_quizzes`)
   └────────────────┘
```

## Компоненты системы

### Frontend (Next.js)
- App Router, React серверные/клиентские компоненты.
- TailwindCSS для стилей.
- Подписки на Supabase Realtime (друзья, игроки, состояние комнаты).

### API слой (Next.js API Routes)
- `app/api/db/quizzes` — каталог подборок из The Trivia API (через наш прокси).
- `app/api/db/quizzes/[id]` — получение/нормализация вопросов и кэш в `cached_quizzes`.
- (опц.) `app/api/quizzes/generate` — генерация вопросов ИИ.

### Supabase
- Auth (JWT), Postgres (основные таблицы), Realtime (каналы/изменения строк), Storage (аватары).
- RLS‑политики на таблицах, см. раздел «8. Безопасность и RLS‑политики».

### Внешние сервисы
- The Trivia API (без ключа) + (опц.) OpenTDB — источники базовых вопросов.

## Потоки данных (ключевые сценарии)

1) Аутентификация
```
UI → Supabase Auth (OAuth/email) → выдача JWT → UI хранит сессию
```

2) Создание комнаты
```
UI → API Route (/api/...) → вставка в Postgres (quiz_rooms) → код комнаты
```

3) Подключение к комнате
```
UI → insert в quiz_players (Postgres) → подписка на Realtime (room_id)
```

4) Игровой процесс
```
UI → ответ (insert в quiz_answers) → (опц.) RPC инкремент очков →
Realtime оповещает всех участников о баллах/переходах между вопросами
```

## События Realtime (примеры)

Клиент подписывается на:
- `friend_requests` (фильтр по `from_id`/`to_id`).
- `quiz_players` по `room_id` (состав/баллы).
- (опц.) канал комнаты для синхронизации состояния вопроса.

## Схема данных и безопасность
- Схема таблиц и SQL: см. «7. База данных (схема и SQL)» в `overview.md`.
- Политики доступа (RLS): см. «8. Безопасность и RLS‑политики» в `overview.md`.

## Производительность и кэширование
- Кэш вопросов внешнего API в `cached_quizzes` (TTL 24ч).
- `revalidate` для каталогов; вопросы — `no-store`, но с серверным кэшем в БД.

## Примечания по развертыванию
- Vercel для фронтенда/API, Supabase Cloud для БД/Realtime/Storage.
- Переменные окружения см. «5. Переменные окружения (.env)».
