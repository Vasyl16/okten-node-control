# AutoRia Clone Backend (AutoRia-style)

Цей проєкт — backend частина платформи продажу авто на **Node.js / Express / TypeScript** + **PostgreSQL** (Drizzle ORM).

## 1. Що потрібно

- Docker Desktop (щоб підняти PostgreSQL)
- Node.js + npm
- Postman (для перевірки API)

## 2. Запуск PostgreSQL

З кореня проєкту `node_autoria`:

```bash
docker-compose up -d
```

## 3. Налаштування ENV

У `backend` відкрий файл `backend/.env.example`, створіть:
- `backend/.env.dev` (для локальної роботи) або `backend/.env.prod`

Після цього API читатиме значення з `config`.

## 4. Міграції та seed (mock дані)

Перейдіть в `backend`:

```bash
cd backend
```

### 4.1 Міграції

```bash
npm run drizzle:migrate
```

### 4.2 Seed базових даних

```bash
npm run seed
```

Seed створює:
- account types (`basic`, `premium`)
- ролі (`buyer`, `seller`, `manager`, `admin`)
- permissions + role_permissions
- admin користувача:
  - `admin@autoria.local` / `admin123`
- premium seller для тестування статистики:
  - `premium.seller@autoria.local` / `admin123`
- brands / models / regions
- початкові `currency_rates`

### 4.3 Seed додаткових оголошень + статистика переглядів

Скрипт: `backend/src/db/seed-extra-ads.ts` (в `package.json` це `npm run seed:ads`)

```bash
npm run seed:ads -- <userId1,userId2,...>
```

Скрипт також підтримує **email** замість userId:

```bash
npm run seed:ads -- <email1,email2,...>
```

Пояснення:
- створює кілька оголошень (`advertisements`) для заданих користувачів
- вставляє фейкові записи `advert_view_stats` (останні ~10 днів), щоб швидко перевірити `GET /ads/:id/stats`

## 5. Запуск сервера

У `backend`:

```bash
npm run dev
```

API буде доступне за адресою, заданою в `.env` (`APP_HOST`, `APP_PORT`).

## 6. Auth (JWT) і як тестувати protected endpoints

### 6.1 Sign up

`POST /auth/sign-up`

Тіло (JSON):
```json
{
  "firstName": "Ivan",
  "lastName": "Ivanov",
  "email": "ivan@example.com",
  "password": "StrongPassword123!",
  "phone": "+380123456789",
  "role": "seller"
}
```

- `role` необов’язковий
- дозволені значення: `buyer` або `seller`
- за замовчуванням, якщо `role` не передати — буде `seller`

### 6.2 Sign in

`POST /auth/sign-in`

Тіло (JSON):
```json
{
  "email": "admin@autoria.local",
  "password": "admin123"
}
```

Відповідь містить:
- `tokenPair.accessToken`
- `tokenPair.refreshToken`

### 6.3 Використання JWT (Bearer)

Для будь-якого endpoint, де потрібно авторизуватися, додайте header:

- `Authorization: Bearer <accessToken>`

У Postman:
- після `sign-in` вручну скопіюйте `accessToken` і вставте в змінну (див. Postman collection)

### 6.4 Refresh / logout

- `POST /auth/refresh` (Authorization: Bearer `<refreshToken>`)
- `POST /auth/log-out` (Authorization: Bearer `<accessToken>`)

## 7. Система permissions (RBAC)

Реалізовано через:
- `roles`
- `permissions`
- `role_permissions`

Механіка:
1. `checkPermission(...)` бере JWT userId
2. підтягує `user.permissions` (через `getFullUserById`)
3. перевіряє чи user має потрібний `permission.name`

Приклади permission:
- `listings.create` (створити оголошення)
- `listings.update.own` / `listings.update.any`
- `listings.delete.own` / `listings.delete.any`
- `users.read`, `users.ban`
- `moderation.review`, `moderation.approve`, `moderation.reject`
- `admin.manage_brands`, `admin.manage_roles`

Важливо про статистику:
- `GET /ads/:id/stats` **не** перевіряє permission-місце в middleware
- доступ визначається в сервісі:
  - оголошення має належати користувачу
  - акаунт користувача має бути `premium`

## 8. Основні endpoint-и, що важливо перевірити

### Ads
- `GET /ads` (public, тільки `active`)
- `GET /ads/:id` (public, інкрементує `views` для statistics)
- `GET /ads/me/list` (тільки свої оголошення)
- `POST /ads` (seller; basic: максимум 1)
- `PATCH /ads/:id` (owner або update.any для manager/admin)
- `DELETE /ads/:id`:
  - owner може видаляти
  - manager/admin може видаляти `inactive` навіть якщо не owner
- `GET /ads/:id/stats`:
  - тільки premium і тільки для власних оголошень

### Catalog
- `GET /catalog/brands`, `GET /catalog/brands/:id/models`, `GET /catalog/regions`
- `POST /catalog/brands` (admin)
- `POST /catalog/brands/:id/models` (admin)
- `POST /catalog/requests/brand` та `/requests/model` (валідація додана)

### Moderation
- `GET /moderation/ads` (черга на перевірку)
- `POST /moderation/ads/:id/approve`
- `POST /moderation/ads/:id/reject`

## 9. Постман

У корені `node_autoria` є файл:
- `postman_collection.json`

Імпортуйте його в Postman:
- створіть environment із `baseUrl`
- вставте `accessToken` після `sign-in`

