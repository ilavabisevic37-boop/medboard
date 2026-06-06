# MedBoard

Веб-платформа для пошуку роботи медикам. Nx-монорепа: NestJS API (GraphQL) + Next.js (Material UI), PostgreSQL + Redis, Prisma, auth через Supabase. Архітектура — DDD + SOLID.

Чому все влаштовано саме так — у [docs/ADR.md](docs/ADR.md).

## Стек

| Шар              | Технології                                            |
|------------------|-------------------------------------------------------|
| Frontend         | Next.js 14 (App Router), React 18, MUI 5              |
| Forms/validation | react-hook-form + zod                                  |
| API transport    | GraphQL (Apollo, code-first); REST тільки для auth    |
| Backend          | NestJS 10, Prisma 5, class-validator                  |
| Auth             | Supabase Auth (JWT) + webhook-синк юзерів у БД        |
| Database         | PostgreSQL 16                                         |
| Cache / pub-sub  | Redis 7                                               |
| Monorepo         | Nx 20, pnpm workspaces                                |
| Container        | Docker Compose                                        |

## Структура репозиторію

```
medboard/
├── apps/
│   ├── api/                          NestJS — DDD-структура
│   │   ├── prisma/schema.prisma      Persistence schema (infrastructure concern)
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts         Apollo (code-first) + модулі
│   │       ├── schema.gql            Згенерована GraphQL-схема (не редагувати руками)
│   │       ├── shared/               Cross-cutting kernel
│   │       │   ├── domain/           Entity, ValueObject, AggregateRoot, DomainEvent
│   │       │   ├── application/      UseCase interface
│   │       │   └── infrastructure/   PrismaService, RedisService
│   │       └── modules/              Bounded contexts
│   │           ├── auth/             Supabase: guards, decorators, webhook (REST)
│   │           ├── users/            ← повний приклад усіх 4 шарів
│   │           │   ├── domain/             entities, value-objects, repositories, events
│   │           │   ├── application/        use-cases, dtos, outbound ports
│   │           │   ├── infrastructure/     prisma repo + mappers, adapters
│   │           │   └── presentation/       graphql resolver + types
│   │           ├── jobs/             ← так само
│   │           ├── applications/     ← placeholder (за тією ж схемою)
│   │           └── chats/            ← в розробці (гілка backend/chats)
│   └── web/                          Next.js + MUI
│       └── src/
│           ├── app/                  App Router: лендінг, /jobs, (auth)/login|register
│           ├── domain/               zod-схеми (credentials тощо)
│           ├── application/          хуки/сервіси (useSignIn, useSignUp, auth.service)
│           ├── components/           auth/, jobs/, layout/, ui/
│           ├── lib/
│           │   ├── api/              GraphQL/REST-клієнти до API
│           │   ├── graphql/          graphql-request клієнт
│           │   └── supabase/         browser/server клієнти (@supabase/ssr)
│           └── theme/
├── libs/
│   └── shared/
│       └── types/                    @medboard/shared-types — спільні DTO між web/api
├── docs/
│   └── ADR.md                        Architecture Decision Records
├── docker-compose.yml
├── .env.example
├── nx.json / tsconfig.base.json / pnpm-workspace.yaml / package.json
```

## DDD-шари (на прикладі `apps/api/src/modules/users`)

Залежності завжди йдуть **всередину**: presentation → application → domain. Infrastructure імплементує інтерфейси з domain.

1. **Domain** — чиста бізнес-логіка. Знає тільки про себе.
   - `entities/user.entity.ts` — `User extends AggregateRoot`, інкапсуляція інваріантів, factory methods.
   - `value-objects/email.vo.ts` — `Email.create()` з валідацією; immutable.
   - `repositories/user.repository.ts` — **інтерфейс** + DI-токен `USER_REPOSITORY`. Реалізації тут немає.
   - `events/user-registered.event.ts` — domain events для outbox / integration.

2. **Application** — оркестрація use-case'ів. Не знає про GraphQL/Prisma.
   - `use-cases/*.use-case.ts` — реалізують `UseCase<Input, Output>`, інжектять репозиторії через токени.
   - `dtos/` — application-level input/output, без фреймворкових декораторів.

3. **Infrastructure** — реалізації портів.
   - `persistence/prisma-user.repository.ts` — `implements UserRepository`.
   - `persistence/user.mapper.ts` — мапінг між Prisma row і domain entity.

4. **Presentation** — транспортний адаптер: GraphQL resolver + `@ObjectType`/`@InputType` (у auth — REST-контролер).
   - Auth тут не пишемо: глобальний `SupabaseAuthGuard` закриває все за замовчуванням; публічне позначається `@Public()`, ролі — `@Roles('EMPLOYER')`, юзер — `@CurrentUser()`.

5. **Module** — `users.module.ts` зв'язує все через провайдери: `{ provide: USER_REPOSITORY, useClass: PrismaUserRepository }`.

## Auth-флоу (Supabase)

1. Фронт реєструє юзера напряму в Supabase: `supabase.auth.signUp({ email, password, options: { data: { role, firstName, lastName } } })`.
2. Supabase шле вебхук `POST /api/auth/webhook` → `SyncUserFromSupabaseUseCase` створює `User` у нашій БД (роль з `raw_user_meta_data`).
3. Далі фронт ходить у GraphQL з `Authorization: Bearer <supabase-jwt>`; `SupabaseAuthGuard` верифікує токен.
4. Паролі в нашій БД **не зберігаються** — ними володіє Supabase.

## SOLID — як він тут реалізований

- **S** — кожен use-case = один сценарій (`CreateJobUseCase`, `SearchJobsUseCase`, `SyncUserFromSupabaseUseCase`).
- **O** — додати новий ApplicationStatus → не змінюєш існуючий код, тільки розширюєш domain.
- **L** — `PrismaJobRepository` повністю замінний на `InMemoryJobRepository` у тестах через однаковий контракт.
- **I** — окремі вузькі порти-інтерфейси на кожен репозиторій, не один «жирний service».
- **D** — application залежить від інтерфейсів, конкретні класи інжектяться в `*.module.ts`.

## Bounded contexts (DDD)

- **auth** — інтеграція з Supabase: guards, декоратори, webhook-синк. Єдиний REST-модуль.
- **users** — профілі (`User` + `DoctorProfile` / `EmployerProfile`): `me`, `updateDoctorProfile`, `updateEmployerProfile`.
- **jobs** — вакансії (`Job` як aggregate root, `SalaryRange` як VO, статус-машина: Draft → Published → Closed → Archived): `jobs(filter)`, `job(id)`, `createJob`.
- **applications** — заявки лікаря на вакансію (статуси: Submitted → Reviewing → Interview → Offer/Rejected/Withdrawn) — placeholder, в роботі.
- **chats** — переписка в контексті відгуку (1 розмова = 1 заявка, реал-тайм через graphql-ws + Redis pub/sub) — в роботі.

Кожен контекст спілкується **тільки через свій repository / application API**. Не імпортуй entity з іншого контексту — лише `id` посилання.

## Локальний запуск

```bash
# 1. Залежності
pnpm install

# 2. Env: скопіюй і заповни Supabase-ключі (URL, anon key, JWT secret, webhook secret)
cp .env.example .env

# 3. Запусти БД + Redis
pnpm docker:up
# (опційно) pgAdmin на http://localhost:5050
docker compose --profile tools up -d pgadmin

# 4. Згенеруй Prisma client та накати міграції
pnpm prisma:generate
pnpm prisma:migrate

# 5. Старт у dev-режимі (у двох терміналах)
pnpm api    # GraphQL: http://localhost:3001/graphql (Apollo Sandbox), REST auth: /api, Swagger: /api/docs
pnpm web    # http://localhost:3000
```

Повний стек у Docker (включно з api/web):
```bash
docker compose --profile full up --build
```

## Чому Postgres + Redis саме для цього проєкту

Job board — це класична реляційна задача: користувачі ↔ профілі ↔ вакансії ↔ заявки з референційною цілісністю, складними фільтрами і фасетним пошуком. Postgres дає JSONB для гнучкості, повнотекстовий пошук (через `tsvector` або pg_trgm) і потім легко мігрує на Meilisearch/Elastic, коли пошук переросте. Redis — кеш гарячих запитів (списки вакансій, auth-кеш юзера), pub/sub для GraphQL-підписок чатів і BullMQ-черги на майбутнє (email-нотифікації).
