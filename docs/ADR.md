# Architecture Decision Records — MedBoard

Кожен запис: контекст → рішення → наслідки. Статуси: ✅ прийнято, 🚧 прийнято, в реалізації.

---

## ADR-001: Nx + pnpm монорепа ✅

**Контекст.** Один продукт, два застосунки (API + web) і спільні типи між ними. Команда з 4 людей, паралельна робота.

**Рішення.** Nx-монорепа з pnpm workspaces: `apps/api` (NestJS), `apps/web` (Next.js), `libs/shared/types`.

**Наслідки.**
- Спільні DTO/типи імпортуються як `@medboard/shared-types` — без публікації пакетів.
- Один lockfile, одна версія TS/ESLint на всіх.
- Залежності ставимо в корінь: `pnpm add -w <pkg>`.
- `nx affected` дозволить ганяти CI тільки по зачепленому (коли з'явиться CI).

---

## ADR-002: DDD з 4 шарами в API ✅

**Контекст.** Доменна логіка (статус-машини вакансій і заявок, ownership-правила) не повинна розповзатися по контролерах і ORM-коді.

**Рішення.** Кожен bounded context (`users`, `jobs`, `applications`, `chats`) — окремий модуль із шарами `domain → application → infrastructure → presentation`. Залежності тільки всередину. Domain не знає про Nest/Prisma; application залежить від інтерфейсів репозиторіїв (DI-токени `Symbol`); infrastructure їх імплементує.

**Наслідки.**
- Бізнес-правила тестуються unit-тестами без БД (in-memory repo за тим самим контрактом).
- Більше файлів на фічу — плата за ізоляцію; шаблон копіюємо з модуля `jobs`.
- Контексти спілкуються тільки через id-посилання і репозиторії — не імпортуємо чужі entity.

---

## ADR-003: GraphQL для всього, крім auth (REST) ✅

**Контекст.** Фронту потрібні гнучкі вибірки (вакансія з фільтрами, профіль з вкладеннями) і реал-тайм для чатів. Auth-вебхук від Supabase — це фіксований HTTP-контракт.

**Рішення.** Apollo (code-first, схема генерується у `apps/api/src/schema.gql`) для всіх модулів. Auth — єдиний REST-виняток: `/api/auth/webhook` (синк від Supabase) і `/api/auth/me`. Фронт ходить через `graphql-request` (легкий, без кешу Apollo Client), підписки — через `graphql-ws`.

**Наслідки.**
- Один endpoint `/graphql`, типи в SDL — фронт бачить контракт без зайвої документації.
- `graphql-request` не вміє subscriptions — для чатів окремий ws-клієнт (`graphql-ws`).
- Swagger лишається тільки для REST-частини auth (`/api/docs`).

---

## ADR-004: Auth через Supabase, синк юзерів вебхуком ✅

**Контекст.** Писати власний auth (паролі, сесії, reset-флоу) — тижні роботи і ризики. Потрібні ролі (DOCTOR / EMPLOYER / ADMIN).

**Рішення.** Supabase Auth володіє credentials (у нашій БД **немає** password hash — колонку видалено міграцією). Реєстрація з фронта: `supabase.auth.signUp` з `options.data = { role, firstName, lastName }` → Supabase-вебхук `POST /api/auth/webhook` → `SyncUserFromSupabaseUseCase` створює/оновлює `User` у нашій БД. Запити до API авторизуються Supabase JWT через **httpOnly-куку `sb-access-token`**: Next-middleware фронта синкає в неї access token сесії, GraphQL-клієнт шле її з `credentials: 'include'`, глобальний `SupabaseAuthGuard` (APP_GUARD) читає куку, верифікує JWT і кладе юзера в контекст. Усе закрите за замовчуванням, публічні поля позначаються `@Public()`; ролі — `RolesGuard` + `@Roles(...)`; юзер у резолвері — `@CurrentUser()`. Наслідок для CORS: wildcard заборонений — конкретний origin (`WEB_ORIGIN`) + `credentials: true`.

**Наслідки.**
- Email-верифікація, reset password, SSO — конфігурація Supabase, не наш код.
- Guard зараз ходить у БД на кожен запит — TODO: Redis-кеш юзера з коротким TTL.
- Метод-рівневі `@UseGuards` у резолверах не використовуємо — guard глобальний (метод-рівневі ламають DI при бутстрапі).
- Вебхук — точка відмови: якщо він не дійшов, юзер є в Supabase, але не в БД.

---

## ADR-005: PostgreSQL + Prisma, Redis ✅

**Контекст.** Job board — реляційна задача: users ↔ profiles ↔ jobs ↔ applications із цілісністю і складними фільтрами.

**Рішення.** PostgreSQL 16 + Prisma 5. Схема Prisma — це **persistence-модель** (infrastructure concern): domain entities мапляться на неї маперами, ніколи не використовуються Prisma-типи в domain/application. Redis 7 — кеш і pub/sub.

**Наслідки.**
- Повнотекстовий пошук — Postgres `tsvector` (TODO у `job.repository.ts`), без окремого пошукового рушія до MVP.
- Зміна схеми = міграція (`pnpm prisma:migrate`) — не редагуємо БД руками.
- Repo-патерн ховає Prisma: заміна ORM не зачіпає domain/application.

---

## ADR-006: Фронт — Next.js App Router + MUI, графік клієнта без Apollo ✅

**Контекст.** Потрібен SSR для SEO публічних вакансій і швидкий старт UI без власної дизайн-системи.

**Рішення.** Next.js 14 App Router + React 18 + MUI 5 (тема в `src/theme`). Дані — `graphql-request` + хелпери в `lib/api/*`; форми — `react-hook-form` + `zod` (схеми в `src/domain`); Supabase-клієнти в `lib/supabase` (browser/server через `@supabase/ssr`).

**Наслідки.**
- Без Apollo Client: немає нормалізованого кешу — стейт запитів тримаємо просто (своя обгортка/хуки), для прототипу достатньо.
- На фронті теж легкий поділ шарів: `domain` (zod-схеми) / `application` (хуки, сервіси) / `components` / `lib`.

---

## ADR-007: Чати — graphql-ws + Redis pub/sub, 1 розмова = 1 відгук 🚧

**Контекст.** Лікар і роботодавець спілкуються в контексті конкретного відгуку. Потрібен реал-тайм, але API може скейлитися на кілька інстансів.

**Рішення.**
- **Модель:** `Conversation` 1:1 з `JobApplication`; учасники **не зберігаються** — виводяться з заявки (`doctorId` + `job.employerId`). Розмова створюється одразу при відгуку. Прочитаність — `readAt` на повідомленні.
- **Реал-тайм:** GraphQL Subscription `messageAdded` поверх `graphql-ws` на тому ж `/graphql`; події через Redis pub/sub (`graphql-redis-subscriptions`, два окремі конекти publisher/subscriber — підписаний конект Redis не може виконувати команди, конект `RedisService` не переюзаємо).
- **Auth на WS:** кука `sb-access-token` автоматично їде в upgrade-запиті (той самий механізм, що й HTTP) — `onConnect` читає її звідти; `connectionParams` з Bearer-токеном — запасний канал на випадок кросдоменного продакшена. Перевірка участі — domain-інваріант `assertParticipant(userId)`.

**Наслідки.**
- Pub/sub через Redis → підписки працюють при кількох інстансах API.
- WebSocket вимагає постійного процесу — деплой API на Railway/Fly/Render, не serverless.
- JWT протухає на живому конекті — для прототипу верифікуємо тільки на конекті; refresh — до MVP.
- Статус: скафолд у гілці `backend/chats`, бізнес-логіка в роботі.

---

## ADR-008: Процес — PR + 1 апрув, гілки за зонами ✅

**Контекст.** 4 людини, паралельні фічі, main має завжди бути робочим.

**Рішення.** `main` захищений ruleset-ом: зміни тільки через PR, мінімум 1 апрув, прямий push заборонено. Гілки — `front/<feature>` / `backend/<feature>` від свіжого main. Автор не може апрувити свій PR — рев'юїть інший член команди.

**Наслідки.**
- Кожен мердж бачили щонайменше двоє.
- Конфлікти вирішує автор PR ребейзом/мерджем main у свою гілку.
- Увімкніть "Automatically delete head branches" в налаштуваннях репо, щоб не накопичувати мертві гілки.
