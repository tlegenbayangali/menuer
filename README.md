# Menuer - Система управления меню

Веб-приложение для формирования меню заведений, построенное на Next.js 15, Supabase и shadcn/ui.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Файл `.env.local` уже настроен с вашими учетными данными Supabase.

### 3. Применение миграции базы данных

Откройте [Supabase Dashboard](https://supabase.com/dashboard/project/hsiqxdsedrxwhnzvkweg/sql/new) и выполните SQL из файла `supabase/migrations/001_initial_schema.sql`.

Либо используйте Supabase CLI:

```bash
# Инициализация проекта (если еще не сделано)
supabase init

# Связать с проектом
supabase link --project-ref hsiqxdsedrxwhnzvkweg

# Применить миграцию
supabase db push
```

### 4. Отключите Email Confirmation (опционально, для разработки)

Перейдите в [Authentication Settings](https://supabase.com/dashboard/project/hsiqxdsedrxwhnzvkweg/auth/providers) и отключите "Confirm email" для быстрой регистрации во время разработки.

### 5. Запуск приложения

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3001](http://localhost:3001)

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

## 🔐 Аутентификация

- Регистрация по email и паролю
- Вход по email и паролю
- Автоматический редирект для неавторизованных пользователей
- Row Level Security (RLS) для защиты данных

## 📱 Функционал

### Страницы

1. **Дашборд** (`/dashboard`) - статистика по всем сущностям
2. **Мои заведения** (`/establishments`) - управление заведениями
3. **Мое меню** (`/menus`) - управление меню
4. **Блюда** (`/dishes`) - управление блюдами
5. **Ингредиенты** (`/ingredients`) - управление ингредиентами

### CRUD операции

Для каждой сущности доступны операции:
- ✅ Создание
- ✅ Чтение
- ✅ Обновление
- ✅ Удаление

## 🛠️ Технологии

- **Next.js 15** - React фреймворк с App Router
- **Turbopack** - быстрый сборщик
- **Supabase** - backend-as-a-service (PostgreSQL, Auth, Storage)
- **shadcn/ui** - компоненты UI
- **Tailwind CSS v4** - стилизация
- **TypeScript** - типизация

## 📁 Структура проекта

```
├── app/
│   ├── (dashboard)/           # Защищенные страницы с сайдбаром
│   │   ├── dashboard/         # Главная страница дашборда
│   │   ├── establishments/    # Страница заведений
│   │   ├── menus/             # Страница меню
│   │   ├── dishes/            # Страница блюд
│   │   └── ingredients/       # Страница ингредиентов
│   ├── auth/
│   │   ├── login/             # Страница входа
│   │   └── register/          # Страница регистрации
│   └── page.tsx               # Редирект на дашборд или логин
├── components/
│   ├── ui/                    # shadcn/ui компоненты
│   ├── establishments/        # Компоненты для заведений
│   ├── menus/                 # Компоненты для меню
│   ├── dishes/                # Компоненты для блюд
│   ├── ingredients/           # Компоненты для ингредиентов
│   └── sidebar.tsx            # Боковое меню навигации
├── utils/supabase/
│   ├── client.ts              # Клиент Supabase для клиента
│   └── server.ts              # Клиент Supabase для сервера
├── middleware.ts              # Middleware для защиты маршрутов
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql  # Начальная схема БД
```

## 🔜 Следующие шаги (для расширения функционала)

- [ ] Связывание меню с заведениями
- [ ] Связывание блюд с меню
- [ ] Добавление ингредиентов в блюда с количеством
- [ ] Публичная страница меню для гостей
- [ ] Экспорт меню в PDF
- [ ] Загрузка изображений через Supabase Storage
- [ ] Мультиязычность меню
- [ ] Система категорий для блюд

## 📝 Лицензия

MIT