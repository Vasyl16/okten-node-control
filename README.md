# AutoRia Clone Backend (npm + remote PostgreSQL)

Backend платформа продажу авто: **Node.js / Express / TypeScript** + **PostgreSQL** (Drizzle ORM).

> БД **remote**, використовується `DB_URI` з `backend/.env`.

## 1) Що потрібно

- Node.js + npm
- Postman
- remote PostgreSQL (у тебе вже є `DB_URI`)

## 2) Налаштуй `backend/.env`

1. Скопіюй `backend/.env.example` → `backend/.env` (або просто відредагуй `backend/.env`).
2. Переконайся, що задані:
   - `DB_URI`
   - `APP_HOST`, `APP_PORT`
   - `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRATION`
   - `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRATION`
   - `PRICE_RECALC_CRON`
   - `PRIVAT_API_URL`

## 3) Встанови залежності

```bash
cd backend
npm i
```

## 4) Міграції

```bash
npm run drizzle:migrate
```

## 5) Seed (mock дані)

### 5.1 Базові дані (ролі, permissions, admin, бренди/моделі/регіони, currency_rates)

```bash
npm run seed
```

### 5.2 Додаткові оголошення + статистика переглядів

Скрипт: `src/db/seed-extra-ads.ts` (у `package.json` це `npm run seed:ads`).

**За userId:**

```bash
npm run seed:ads -- <userId1,userId2,...>
```

**За email:**

```bash
npm run seed:ads -- "premium.seller@autoria.local"
```

Це заповнює:

- `advertisements`
- `advert_view_stats` (останні ~10 днів), щоб одразу перевіряти `GET /ads/:id/stats`.

## 6) Запуск сервера

### dev

```bash
npm run dev
```

Сервер слухає `APP_HOST:APP_PORT`.

> Під час старту також запускається cron (раз на день) для оновлення приватбанківських курсів і перерахунку `priceUsd/priceEur/priceUah`.

## 7) Auth (JWT Bearer)

### Sign in

`POST /auth/sign-in`

```json
{
  "email": "admin@autoria.local",
  "password": "admin123"
}
```

Відповідь містить:

- `tokenPair.accessToken`
- `tokenPair.refreshToken`

### Як передавати токен

Для protected endpoint-ів у Postman:

- `Authorization: Bearer <accessToken>`

### Refresh / logout

- `POST /auth/refresh` (Bearer у header — `refreshToken`)
- `POST /auth/log-out` (Bearer у header — `accessToken`)

## 8) Permissions (RBAC)

RBAC реалізовано через `roles` + `permissions` + `role_permissions`.

Перевірка робиться middleware `checkPermission(...)`, яке дістає `userId` з JWT і перевіряє чи є відповідний `permission.name`.

Приклади:

- `POST /ads` → `listings.create`
- `PATCH /ads/:id` → `listings.update.own` або `listings.update.any`
- `DELETE /ads/:id` → `listings.delete.own` або `listings.delete.any`
- `POST /catalog/brands` → `admin.manage_brands`
- `/moderation/*` → `moderation.review|approve|reject`
- `/users/:id/ban` → `users.ban`

## 9) Статистика оголошення (premium-only)

`GET /ads/:id/stats`:

- тільки **premium** акаунт
- тільки **для власних** оголошень

Тому:

- basic seller не зможе бачити stats
- premium seller зможе отримати views + середню ціну по регіону + середню по Україні (залежить від розрахунків у сервісі)

## 10) Postman

У корені `node_autoria` є `postman_collection.json`.
Імпортуй у Postman та вистав `baseUrl`.
Після `sign-in` підстав `accessToken` в `Authorization`.

# AutoRia Clone Backend (npm + remote PostgreSQL)

Backend платформа продажу авто: **Node.js / Express / TypeScript** + **PostgreSQL (Drizzle ORM)**.

> Важливо: БД **не локальна**, використовується `DB_URI` з `backend/.env`.

## 1) Що потрібно

- Node.js + npm
- Postman (для перевірки)
- Налаштований remote PostgreSQL (у тебе вже є `DB_URI`)

## 2) Налаштуй `backend/.env`

1. Відкрий `backend/.env.example`
2. Створи `backend/.env` (якщо ще не зроблено)
3. Заповни значення (мінімально):
   - `DB_URI`
   - `APP_HOST`, `APP_PORT`
   - `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRATION`
   - `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRATION`
   - `PRICE_RECALC_CRON`
   - `PRIVAT_API_URL`

## 3) Інсталяція

```bash
cd backend
npm i
```

## 4) Міграції

```bash
cd backend
npm run drizzle:migrate
```

## 5) Seed (mock дані)

### 5.1 Базові дані (ролі, permissions, admin, бренди/моделі/регіони, currency_rates)

```bash
cd backend
npm run seed
```

### 5.2 Додаткові оголошення + статистика переглядів

Скрипт: `src/db/seed-extra-ads.ts` (у package.json це `npm run seed:ads`).

За допомогою **userId**:

```bash
npm run seed:ads -- <userId1,userId2,...>
```

За допомогою **email**:

```bash
npm run seed:ads -- "premium.seller@autoria.local"
```

Скрипт заповнює:

- `advertisements`
- `advert_view_stats` (для швидкого тесту `/ads/:id/stats`)

## 6) Запуск сервера

### dev (рекомендовано)

```bash
cd backend
npm run dev
```

Сервер піднімається на `APP_HOST:APP_PORT`.

> Кожен старт також ініціює cron, який **раз на день** оновлює currency rates і перераховує `priceUsd/priceEur/priceUah`.

## 7) Auth (JWT Bearer)

### 7.1 Sign in

`POST /auth/sign-in`

Body:

```json
{
  "email": "admin@autoria.local",
  "password": "admin123"
}
```

Відповідь містить:

- `tokenPair.accessToken`
- `tokenPair.refreshToken`

### 7.2 Як передавати токен

У Postman для protected endpoint-ів додай:

- `Authorization: Bearer <accessToken>`

## 8) Permissions (RBAC)

Permissions працюють через `checkPermission(...)`, яке перевіряє `user.permissions` на основі JWT.

Приклади protected endpoint-ів:

- `POST /ads` → `listings.create`
- `PATCH /ads/:id` → `listings.update.own` або `listings.update.any`
- `DELETE /ads/:id` → `listings.delete.own` або `listings.delete.any`
- `POST /catalog/brands` → `admin.manage_brands`
- `GET/POST /moderation/*` → `moderation.*`
- `PATCH /users/:id/ban` → `users.ban`

## 9) Статистика оголошення (premium-only)

`GET /ads/:id/stats` працює так:

- доступ тільки **для premium** акаунта
- тільки для оголошень **власника**

Тому:

- basic seller не зможе викликати це endpoint для своїх оголошень
- premium seller зможе побачити:
  - total views
  - views за day/week/month
  - середню ціну по регіону

## 10) Postman

У корені `node_autoria` є файл:

- `postman_collection.json`

Імпортуй його в Postman і після `sign-in` встав `accessToken` в `Authorization`.

# AutoRia Clone Backend — Docker

## 1) Налаштуй env

Використовується файл `backend/.env` (remote PostgreSQL через `DB_URI`).

Переконайся, що в `backend/.env` задані:

- `DB_URI`
- `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRATION`
- `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRATION`
- `PRICE_RECALC_CRON`
- `PRIVAT_API_URL`
- `APP_HOST`, `APP_PORT`

## 2) Збірка та запуск (docker-compose)

З папки `node_autoria/backend`:

```bash
docker-compose -f docker-compose.yml up --build
```

API буде доступне на `http://localhost:3000` (або іншому порту з `APP_PORT`).

## 3) Зупинка

```bash
docker-compose -f docker-compose.yml down
```

## 4) Перевірка / логи

```bash
docker-compose -f docker-compose.yml ps
docker-compose -f docker-compose.yml logs -f
```

## 5) (Опційно) Міграції та seed

> `seed` — робить “очистку і вставку” (може бути деструктивним для прод/remote БД). Використовуй обережно.

### 5.1 Міграції

```bash
docker-compose -f docker-compose.yml exec api npm run drizzle:migrate
```

### 5.2 Seed базових даних

```bash
docker-compose -f docker-compose.yml exec api npm run seed
```

### 5.3 Seed оголошень і статистики (для тесту premium /ads/:id/stats)

Скрипт: `src/db/seed-extra-ads.ts`

```bash
docker-compose -f docker-compose.yml exec api npm run seed:ads -- "<userId1,userId2,...>"
```

Також підтримується **email**, наприклад:

```bash
docker-compose -f docker-compose.yml exec api npm run seed:ads -- "premium.seller@autoria.local"
```

Після цього можна перевіряти:

- `GET /ads/:id/stats` (працює для `premium` акаунта і тільки для власних оголошень)

## 6) Auth і JWT Bearer

Для protected endpoint-ів у Postman додавай header:
`Authorization: Bearer <accessToken>`

### 6.1 Отримати токени

- `POST /auth/sign-in` → відповість `tokenPair.accessToken` і `tokenPair.refreshToken`

### 6.2 Refresh / logout

- `POST /auth/refresh` (Bearer у header — refresh token)
- `POST /auth/log-out` (Bearer у header — access token)

## 7) Система permissions (RBAC)

RBAC працює так:

1. Middleware `checkPermission(...)` читає JWT `userId`
2. Далі отримує `user.permissions` через `getFullUserById`
3. Перевіряє наявність `permission.name`

Приклади endpoint-ів, які захищені permissions:

- `POST /ads` — `listings.create`
- `PATCH /ads/:id` — `listings.update.own` або `listings.update.any`
- `DELETE /ads/:id` — `listings.delete.own` або `listings.delete.any`
- `POST /catalog/brands` і `/brands/:id/models` — `admin.manage_brands`
- `GET/POST /moderation/*` — `moderation.*`
- `users/*/ban` — `users.ban`

Важливо про статистику:

- `GET /ads/:id/stats`:
  - доступ тільки для **premium** акаунта
  - і тільки для **власних** оголошень
  - permission-місце через middleware тут не використовується, контроль в сервісі.

## 8) Postman collection

У корені `node_autoria` є файл:

- `postman_collection.json`

Імпортуй його в Postman, задай `baseUrl`, а після `sign-in` підстав `accessToken` в `Authorization`.
