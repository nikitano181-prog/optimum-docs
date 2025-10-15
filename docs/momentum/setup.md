# Установка и запуск

## Предпосылки

- Node.js 20.11+ (рекомендуется) и npm/pnpm/yarn
- Аккаунт и проект в Supabase (Postgres, Auth, Realtime, Storage)
- Git для клонирования репозитория

## Установка

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd optimum
```

### 2. Установка зависимостей
```bash
# Рекомендуется pnpm
pnpm i
# или npm i / yarn
```

### 3. Настройка переменных окружения

Создайте файл `.env.local` в корне приложения (например, `www/optimum/.env.local`) и укажите ключи Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# Сервисный ключ — только на серверной стороне (для кэша вопросов)
SUPABASE_SERVICE_ROLE_KEY=...

# (опционально) ключи провайдеров ИИ
# OPENAI_API_KEY=...
```

### 4. Запуск приложения

```bash
pnpm dev
# По умолчанию: http://localhost:3020 (если задано в package.json)
```

## Настройка базы данных (Supabase)

1. В консоли Supabase откройте SQL Editor и выполните миграции из раздела «7. База данных (схема и SQL)» в `overview.md`.
2. Включите Realtime для таблиц `quiz_players`, `friend_requests` (и при необходимости — канал комнаты).
3. Настройте RLS‑политики по разделу «8. Безопасность и RLS‑политики».

## Проверка установки

### 1. Проверка подключения к БД/Realtime
- Создайте тестовую запись в `quiz_rooms` и проверьте подписку на изменения в клиенте.

### 2. Проверка API прокси вопросов
```bash
curl -s http://localhost:3020/api/db/quizzes | head
```

### 3. Проверка UI
- Откройте http://localhost:3020 и убедитесь, что страницы грузятся.

## Устранение неполадок

1. **Не грузятся данные из Supabase:**
   - Проверьте `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Убедитесь, что таблицы созданы и RLS не блокирует запросы.

2. **Кэш вопросов не работает:**  
   - Проверьте наличие `SUPABASE_SERVICE_ROLE_KEY` в серверной среде (не на клиенте).

3. **Подписки Realtime не приходят:**
   - Включите Realtime для нужных таблиц в консоли Supabase.
   - Проверьте фильтры подписок (room_id, from_id/to_id).
