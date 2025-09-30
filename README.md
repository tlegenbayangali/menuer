# Menuer - Система управления меню

Веб-приложение для формирования меню заведений, построенное на Next.js 15, Supabase и shadcn/ui.

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd menuer
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка Supabase

#### 3.1 Создайте проект в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Дождитесь завершения настройки проекта

#### 3.2 Настройте переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

Найти эти значения можно в: `Supabase Dashboard → Settings → API`

#### 3.3 Примените миграции базы данных

Откройте Supabase Dashboard → SQL Editor и выполните SQL из файла `supabase/migrations/001_initial_schema.sql`

Или используйте Supabase CLI:

```bash
# Инициализация проекта
supabase init

# Связать с проектом
supabase link --project-ref your-project-ref

# Применить миграции
supabase db push
```

#### 3.4 Создайте Storage bucket для аватаров

В Supabase Dashboard:
1. Перейдите в **Storage**
2. Создайте новый bucket с именем `avatars`
3. Установите **Public bucket** (для публичного доступа к аватарам)

Или примените миграцию: `supabase/migrations/20250130000000_create_avatars_bucket.sql`

#### 3.5 Отключите Email Confirmation (опционально, для разработки)

Перейдите в `Authentication → Settings → Email Auth` и отключите "Confirm email" для быстрой регистрации во время разработки.

### 4. Запуск приложения

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## 🛠️ Технологии

- **Next.js 15** - React фреймворк с App Router
- **Turbopack** - быстрый сборщик
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, Storage)
- **shadcn/ui** - UI компоненты (стиль New York)
- **Tailwind CSS v4** - стилизация
- **TypeScript** - типизация
- **next-themes** - поддержка темной темы
- **react-image-crop** - обрезка изображений

## 📁 Структура проекта

```
menuer/
├── app/
│   ├── (dashboard)/           # Защищенные страницы с сайдбаром
│   │   ├── dashboard/         # Главная страница дашборда
│   │   ├── establishments/    # Страница заведений
│   │   ├── menus/             # Страница меню
│   │   ├── dishes/            # Страница блюд
│   │   ├── ingredients/       # Страница ингредиентов
│   │   └── import/            # Импорт данных
│   ├── auth/
│   │   ├── login/             # Страница входа
│   │   └── register/          # Страница регистрации
│   └── page.tsx               # Редирект на дашборд или логин
├── components/
│   ├── ui/                    # shadcn/ui компоненты
│   ├── profile/               # Компоненты профиля и аватара
│   ├── establishments/        # Компоненты для заведений
│   ├── menus/                 # Компоненты для меню
│   ├── dishes/                # Компоненты для блюд
│   ├── ingredients/           # Компоненты для ингредиентов
│   └── sidebar.tsx            # Боковое меню навигации
├── utils/supabase/
│   ├── client.ts              # Клиент Supabase для клиента
│   └── server.ts              # Клиент Supabase для сервера
├── lib/                       # Утилиты (cn для className)
├── middleware.ts              # Middleware для защиты маршрутов
└── supabase/
    └── migrations/            # SQL миграции
        ├── 001_initial_schema.sql
        └── 20250130000000_create_avatars_bucket.sql
```

## 📊 Схема базы данных

### Основные таблицы

- **profiles** - профили пользователей
- **establishments** - заведения пользователя
- **menus** - меню
- **dishes** - блюда (с ценой и изображением)
- **ingredients** - ингредиенты (с единицами измерения)

### Связи (Many-to-Many)

- **establishment_menus** - заведения ↔ меню
- **menu_dishes** - меню ↔ блюда
- **dish_ingredients** - блюда ↔ ингредиенты (с количеством)

### Единицы измерения

- Грамм (gram)
- Килограмм (kilogram)
- Штука (piece)
- Литр (liter)
- Миллилитр (milliliter)
- Столовая ложка (tablespoon)
- Чайная ложка (teaspoon)
- Стакан (cup)

## 📱 Функционал

### Аутентификация и профиль

- ✅ Регистрация и вход по email/паролю
- ✅ Редактирование профиля (имя)
- ✅ Загрузка аватара с обрезкой (соотношение 1:1)
- ✅ Placeholder с инициалами если нет аватара
- ✅ Автоматическое обновление аватара без перезагрузки страницы
- ✅ Защита маршрутов через middleware

### Темная тема

- ✅ Автоматическое определение системной темы
- ✅ Переключение между светлой/темной темой
- ✅ Сохранение выбранной темы

### CRUD операции

Для каждой сущности (заведения, меню, блюда, ингредиенты):
- ✅ Создание
- ✅ Чтение
- ✅ Обновление
- ✅ Удаление
- ✅ Загрузка изображений

### Связывание данных

- ✅ Привязка меню к заведениям
- ✅ Привязка блюд к меню
- ✅ Привязка ингредиентов к блюдам (с количеством)

### Дополнительно

- ✅ Дашборд со статистикой
- ✅ Детальные страницы для каждой сущности
- ✅ Row Level Security (RLS) для защиты данных
- ✅ Оптимистичные обновления UI

## 🎨 Конфигурация

### shadcn/ui

Настройки в `components.json`:
- Стиль: "new-york"
- React Server Components: Включены
- Базовый цвет: neutral

### Path aliases

- `@/components` → `components/`
- `@/utils` → `utils/`
- `@/lib` → `lib/`
- `@/ui` → `components/ui/`
- `@/hooks` → `hooks/`

## 📝 Доступные команды

```bash
# Разработка
npm run dev          # Запуск dev-сервера с Turbopack (http://localhost:3000)

# Production
npm run build        # Сборка приложения
npm start            # Запуск production-сервера

# Линтинг
npm run lint         # Проверка кода

# Добавление UI компонентов
npx shadcn@latest add <component-name>
```

## 🔍 Troubleshooting

### Ошибка подключения к Supabase

Проверьте:
1. Правильность URL и ключей в `.env.local`
2. Что проект Supabase активен
3. Что применены все миграции

### Проблемы с загрузкой аватаров

Убедитесь, что:
1. Создан bucket `avatars` в Supabase Storage
2. Bucket настроен как публичный
3. Применена миграция `20250130000000_create_avatars_bucket.sql`

### Ошибки при сборке

```bash
# Очистка кеша и переустановка
rm -rf node_modules package-lock.json
npm install
```

## 🔜 Планируемые улучшения

- [ ] Публичная страница меню для гостей (QR-код)
- [ ] Экспорт меню в PDF
- [ ] Мультиязычность меню
- [ ] Система категорий для блюд
- [ ] Фильтрация и поиск
- [ ] Аналитика и отчеты

## 📄 Лицензия

MIT