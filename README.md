# MedBoard

Веб-платформа для пошуку роботи медикам. Nx-монорепа: NestJS API + Next.js (Material UI), PostgreSQL + Redis, Prisma. Архітектура — DDD + SOLID.

## Стек

| Шар              | Технології                                  |
|------------------|---------------------------------------------|
| Frontend         | Next.js 14 (App Router), React 18, MUI 5    |
| Backend          | NestJS 10, Prisma 5, class-validator        |
| Database         | PostgreSQL 16                               |
| Cache / queues   | Redis 7                                     |
| Monorepo         | Nx 20, pnpm workspaces                      |
| Container        | Docker Compose                              |

## Структура репозиторію

```
medboard/
├── apps/
│   ├── api/                          NestJS — DDD-структура
│   │   ├── prisma/schema.prisma      Persistence schema (infrastructure concern)
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       ├── shared/               Cross-cutting kernel
│   │       │   ├── domain/           Entity, ValueObject, AggregateRoot, DomainEvent
│   │       │   ├── application/      UseCase interface
│   │       │   └── infrastructure/   PrismaService, RedisService
│   │       └── modules/              Bounded contexts
│   │           ├── users/            ← повний приклад усіх 4 шарів
│   │           │   ├── domain/             entities, value-objects, repositories, events
│   │           │   ├── application/        use-cases, dtos, outbound ports
│   │           │   ├── infrastructure/     prisma repo + mappers, adapters
│   │           │   └── presentation/       controllers, http dtos
│   │           ├── jobs/             ← так само
│   │           └── applications/     ← placeholder (за тією ж схемою)
│   └── web/                          Next.js + MUI
│       └── src/
│           ├── app/                  App Router (layout.tsx, page.tsx, /jobs)
│           ├── components/
│           ├── lib/api/              http-клієнти до NestJS
│           └── theme/
├── libs/
│   └── shared/
│       └── types/                    @medboard/shared-types — спільні DTO між web/api
├── docker-compose.yml
├── .env.example
├── nx.json / tsconfig.base.json / pnpm-workspace.yaml / package.json
```

## DDD-шари (на прикладі `apps/api/src/modules/users`)

Залежності завжди йдуть **всередину**: presentation → application → domain. Infrastructure імплементує інтерфейси з domain.

1. **Domain** — чиста бізнес-логіка. Знає тільки про себе.
   - `entities/user.entity.ts` — `User extends AggregateRoot`, інкапсуляція інваріантів, factory methods (`User.register`, `User.restore`).
   - `value-objects/email.vo.ts` — `Email.create()` з валідацією; immutable.
   - `repositories/user.repository.ts` — **інтерфейс** + DI-токен `USER_REPOSITORY`. Реалізації тут немає.
   - `events/user-registered.event.ts` — domain events для outbox / integration.

2. **Application** — оркестрація use-case'ів. Не знає про HTTP/Prisma.
   - `use-cases/register-user.use-case.ts` — реалізує `UseCase<Input, Output>`. Інжектить `UserRepository` і `PasswordHasher` через токени.
   - `ports/password-hasher.port.ts` — outbound-порт (Dependency Inversion): application залежить від абстракції.
   - `dtos/` — application-level input/output, без декораторів класів-валідаторів.

3. **Infrastructure** — реалізації портів.
   - `persistence/prisma-user.repository.ts` — `implements UserRepository`.
   - `persistence/user.mapper.ts` — мапінг між Prisma row і domain entity.
   - `security/bcrypt-password.hasher.ts` — `implements PasswordHasher` (зараз заглушка, заміни на справжній bcrypt/argon2).

4. **Presentation** — HTTP-адаптер.
   - `presentation/users.controller.ts` — `@Controller('users')`, делегує в use-case.
   - `presentation/dtos/register-user.http.dto.ts` — `class-validator` на вході.

5. **Module** — `users.module.ts` зв’язує все через провайдери: `{ provide: USER_REPOSITORY, useClass: PrismaUserRepository }`.

## SOLID — як він тут реалізований

- **S** — кожен use-case = один сценарій (`RegisterUserUseCase`, `CreateJobUseCase`, `SearchJobsUseCase`).
- **O** — додати новий ApplicationStatus → не змінюєш існуючий код, тільки розширюєш domain.
- **L** — `PrismaUserRepository` повністю замінний на `InMemoryUserRepository` у тестах через однаковий контракт.
- **I** — окремі вузькі порти: `UserRepository`, `PasswordHasher`. Не один «жирний service».
- **D** — application залежить від інтерфейсів, конкретні класи інжектяться в `*.module.ts`.

## Bounded contexts (DDD)

- **users** — реєстрація і профілі (`User` + `DoctorProfile` / `EmployerProfile`).
- **jobs** — публікація вакансій (`Job` як aggregate root, `SalaryRange` як VO, статус-машина: Draft → Published → Closed → Archived).
- **applications** — заявки лікаря на вакансію (`JobApplication`, статуси: Submitted → Reviewing → Interview → Offer/Rejected/Withdrawn).

Кожен контекст спілкується **тільки через свій repository / application API**. Не імпортуй entity з іншого контексту — лише `id` посилання.

## Локальний запуск

```bash
# 1. Залежності
pnpm install

# 2. Env
cp .env.example .env

# 3. Запусти БД + Redis
pnpm docker:up
# (опційно) pgAdmin на http://localhost:5050
docker compose --profile tools up -d pgadmin

# 4. Згенеруй Prisma client та накати міграції
pnpm prisma:generate
pnpm prisma:migrate

# 5. Старт у dev-режимі (у двох терміналах)
pnpm api    # http://localhost:3001/api, Swagger /api/docs
pnpm web    # http://localhost:3000
```

Повний стек у Docker (включно з api/web):
```bash
docker compose --profile full up --build
```

## Чому Postgres + Redis саме для цього проєкту

Job board — це класична реляційна задача: користувачі ↔ профілі ↔ вакансії ↔ заявки з референційною цілісністю, складними фільтрами і фасетним пошуком. Postgres дає JSONB для гнучкості, повнотекстовий пошук (через `tsvector` або pg_trgm) і потім легко мігрує на Meilisearch/Elastic, коли пошук переросте. Redis — для сесій (коли додаси auth), кешу гарячих запитів (списки вакансій), pub/sub нотифікацій і BullMQ-черг (email-нотифікації про нові вакансії за спеціалізацією).
