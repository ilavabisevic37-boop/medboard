# ROADMAP: Прототип → MVP

Повний список робіт по проєкту. Два етапи:

- **Етап 1 — Прототип:** повний цикл найму на демо: реєстрація → профіль →
  пост вакансії → пошук → відгук → чат → рішення.
- **Етап 2 — MVP:** те, що потрібно, щоб пустити реальних користувачів.

---

## Що вже готово ✅

| Шар | Що є |
|-----|------|
| Auth | Supabase + webhook-синк у БД (`SyncUserFromSupabaseUseCase`), `SupabaseAuthGuard`, `RolesGuard`, декоратори `@CurrentUser`/`@Roles`, `/login` на фронті |
| Users | Повний DDD-модуль: `me`, `updateDoctorProfile`, `updateEmployerProfile` (GraphQL) |
| Jobs | Повний DDD-модуль: `createJob` (draft), `jobs(filter)` з фільтрами, `job(id)`; entity має `publish()`/`close()` |
| Web | `/` (лендінг), `/jobs` + фільтри, `/jobs/[id]` — реально тягнуть GraphQL; `/login` |
| БД | Усі моделі: User, DoctorProfile, EmployerProfile, Job, JobApplication (зі статус-машиною); міграції накачені |
| Інфра | Nx + pnpm monorepo, shared-types lib, Prisma, Redis, docker-compose |

Архітектурні правила (не ламати): DDD 4 шари (domain → application →
infrastructure → presentation), транспорт GraphQL для всього, крім auth (REST),
типи у `libs/shared/types`, фронт ходить через `graphql-request`.

---

# ЕТАП 1 — ПРОТОТИП

## 1.1. Auth-фундамент на фронті 🔴 (блокує все інше)

**Фронт:**
- ✅ **`/login` + `/register`** — зроблено за дизайном `medboard-design/`
  (сплітскрін, вибір ролі картками, реальний Supabase signIn/signUp,
  редірект з `?next=`). Залишились з цього блоку: "Forgot password?" (чекає
  на reset-flow, §2.1) і SSO-кнопка (поза скоупом прототипу).
- ~~**`/register`** — сторінки немає~~ Бек готовий: signUp
  через Supabase, вебхук `auth.controller.ts` синкає юзера в БД і бере
  роль/ім'я/прізвище з `raw_user_meta_data`. Форма: email, password,
  firstName, lastName + **вибір ролі** (Лікар / Роботодавець — toggle):

  ```ts
  await supabase.auth.signUp({
    email, password,
    options: { data: { role, firstName, lastName } }, // → raw_user_meta_data → webhook
  });
  ```

  Якщо роль не передати — вебхук дефолтить у DOCTOR. Після успіху —
  редірект на `/profile` ("заповніть профіль"). На `/login` додати лінк
  "Не маєте акаунта? Зареєструватися" (і навпаки).
- Авторизований GraphQL-клієнт: хелпер поверх `lib/graphql/client.ts`, який
  бере Supabase access token (`lib/supabase/client.ts`/`server.ts`) і ставить
  `Authorization: Bearer <token>`. Один раз — далі всі фічі на ньому.
- `lib/api/users.ts`: query `me { id role firstName lastName doctorProfile {...} employerProfile {...} }`.
- `AppHeader`: стан користувача — аватар/меню (Профіль, Мої вакансії або
  Мої відгуки за роллю, Messages, Logout) vs кнопка Login. Logout через
  `supabase.auth.signOut()`.
- `middleware.ts`: захистити майбутні роути `/jobs/new`, `/dashboard`,
  `/applications`, `/profile`, `/messages` (без сесії → `/login?next=...`).

## 1.2. Захист createJob 🔴 (швидко, ~півгодини)

**Бек** (`jobs.resolver.ts:31-37` — там TODO):
- `@UseGuards(SupabaseAuthGuard, RolesGuard)` + `@Roles('EMPLOYER')` на
  `createJob` (зразок — `users.resolver.ts:43-51`).
- `@CurrentUser() user` → `user.id` як `employerId` в use-case.
- Прибрати `employerId` з `CreateJobInputType` і оновити сигнатуру
  `CreateJobUseCase.execute()`.

## 1.3. Lifecycle вакансії: publish / close / myJobs 🔴

**Бек** (методи `publish()`/`close()` на entity вже є — лише expose):
- Use-cases: `publish-job`, `close-job` — завантажити job, перевірити
  ownership (`job.employerId === currentUser.id`), викликати domain-метод,
  зберегти.
- `get-my-jobs.use-case.ts` + query `myJobs` — вакансії employer-а у всіх
  статусах. Новий метод `findByEmployerId` у `JobRepository` (interface +
  `PrismaJobRepository`).
- Мутації `publishJob(id)`, `closeJob(id)` з `@Roles('EMPLOYER')`.

## 1.4. Applications-модуль 🔴 (зараз порожній стаб)

**Бек** — `apps/api/src/modules/applications/`, за шаблоном jobs
(Prisma-модель `JobApplication` готова: unique `[jobId, doctorId]`,
статуси `SUBMITTED → REVIEWING → INTERVIEW → OFFER/REJECTED/WITHDRAWN`):

- **Domain:** `Application` aggregate root — фабрика `submit(jobId, doctorId,
  coverLetter?)`, переходи `review()`, `invite()`, `makeOffer()`, `reject()`,
  `withdraw()` з валідацією дозволених переходів (`WITHDRAWN` — тільки самим
  лікарем з нетермінальних станів); `ApplicationStatus` VO; інтерфейс
  `ApplicationRepository` (`findById`, `findByJobAndDoctor`, `findByDoctorId`,
  `findByJobId`, `save`).
- **Application use-cases:**
  - `apply-to-job` — job існує і PUBLISHED; немає дубля; статус SUBMITTED;
    тут же створюється Conversation для чату (див. 1.7);
  - `withdraw-application` — ownership: тільки сам doctor;
  - `update-application-status` — ownership: тільки employer цієї вакансії
    (підвантажити job через `JobRepository`);
  - `get-my-applications` — для лікаря, з даними вакансії (title, company);
  - `get-job-applications` — для employer-а, з даними лікаря (ім'я,
    спеціалізація) — read-model проєкції за зразком `toJobSummary`.
- **Infrastructure:** `PrismaApplicationRepository` + `ApplicationMapper`.
- **Presentation:** `applications.resolver.ts`:
  - `myApplications` — `@Roles('DOCTOR')`
  - `jobApplications(jobId)` — `@Roles('EMPLOYER')`
  - `applyToJob(input: { jobId, coverLetter? })` — `@Roles('DOCTOR')`
  - `withdrawApplication(id)` — `@Roles('DOCTOR')`
  - `updateApplicationStatus(id, status)` — `@Roles('EMPLOYER')`
- Поле `hasApplied: Boolean` у `JobDetailType` (nullable; рахується тільки
  для залогіненого лікаря).
- Типи в `libs/shared/types` (`application.types.ts`).
- Перевірити, що `ApplicationsModule` підключений в `app.module.ts`.

## 1.5. Фронт: повний цикл найму 🔴

- **Apply на `/jobs/[id]`** — увімкнути кнопку (зараз disabled,
  `page.tsx:100` з TODO). Стани: гість → редірект `/login?next=...`;
  EMPLOYER → сховати; `hasApplied` → "Заявку подано" (disabled).
  Діалог з cover letter → мутація `applyToJob`.
- **`/jobs/new`** — форма поста вакансії (тільки EMPLOYER): title, summary,
  description, specialization, employmentType/shift (select), experience,
  salary min/max + period + currency, requirements/benefits (динамічний
  список), city/country, чекбокси remote/urgent. Кнопки "Зберегти чернетку"
  (createJob) і "Опублікувати" (createJob → publishJob).
- **`/dashboard`** (employer) — список `myJobs` з бейджем статусу,
  кнопки Publish/Close; клік → відгуки (`jobApplications`): картка лікаря
  + зміна статусу (`updateApplicationStatus`).
- **`/applications`** (doctor) — мої відгуки: вакансія, компанія, дата,
  бейдж статусу, Withdraw для активних.
- `lib/api/applications.ts` з усіма queries/mutations.

## 1.6. Профілі 🟠 (бек готовий — тільки фронт)

- **`/profile`** — за `me.role` рендерить форму:
  - DOCTOR: specialization, yearsOfExp, bio, licenseNumber, city, country;
  - EMPLOYER: companyName, website, description, city, country.
- Мутації `updateDoctorProfile`/`updateEmployerProfile` вже є на беку.
- М'який банер "заповніть профіль", якщо профіль порожній.

## 1.7. Чати 🟠 (рішення прийняті: graphql-ws + Redis pub/sub; чат одразу після відгуку; 1 розмова = 1 відгук)

### Схема даних

```prisma
model Conversation {
  id            String   @id @default(uuid()) @db.Uuid
  applicationId String   @unique @map("application_id") @db.Uuid
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  application JobApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  messages    Message[]
  @@map("conversations")
}

model Message {
  id             String    @id @default(uuid()) @db.Uuid
  conversationId String    @map("conversation_id") @db.Uuid
  senderId       String    @map("sender_id") @db.Uuid
  body           String
  readAt         DateTime? @map("read_at")
  createdAt      DateTime  @default(now()) @map("created_at")
  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender       User         @relation(fields: [senderId], references: [id], onDelete: Cascade)
  @@index([conversationId, createdAt])
  @@map("messages")
}
```

+ зворотні relations у `User` і `JobApplication`. Учасники розмови НЕ
зберігаються окремо — виводяться з application (`doctorId` + `job.employerId`).
`readAt` — найпростіша прочитаність для двох учасників.

### Бек — модуль `chats` (за DDD-шаблоном)

- **Domain:** `Conversation` (інваріант: учасники — тільки doctor відгуку та
  employer вакансії; `assertParticipant(userId)`), `Message` (валідація body,
  ліміт ~4000); інтерфейси `ConversationRepository` (`findById`,
  `findByApplicationId`, `findByParticipant`, `save`) і `MessageRepository`
  (`findByConversation(id, { before?, limit })` — курсорна пагінація, `save`,
  `markRead(conversationId, readerId)`).
- **Use-cases:** `get-my-conversations` (інбокс: останнє повідомлення +
  unread count + вакансія + співрозмовник — read-model), `get-conversation`,
  `send-message` (участь → зберегти → опублікувати в Redis канал
  `chat.message.<conversationId>` через порт `ChatEventsPublisher`),
  `mark-conversation-read`.
- **Створення розмови:** в `ApplyToJobUseCase` після збереження заявки;
  плюс lazy-init у `getConversationByApplication` для старих заявок.
- **Infrastructure:** Prisma-репозиторії + мапери;
  `redis-pubsub.provider.ts` — `RedisPubSub` із `graphql-redis-subscriptions`
  (два окремі Redis-конекти: publisher + subscriber, НЕ переюзати конект
  `RedisService`). Залежності: `graphql-redis-subscriptions`,
  `graphql-subscriptions`, `graphql-ws`.
- **GraphQL** (усе під `SupabaseAuthGuard`):
  - Query `myConversations`, `conversation(id)` (з messages);
  - Mutation `sendMessage({ conversationId, body })`,
    `markConversationRead(id)`;
  - Subscription `messageAdded(conversationId)` — asyncIterator по Redis,
    перевірка участі при підписці.
- **Subscriptions в Apollo** (`app.module.ts`) — найделікатніша частина:
  - `subscriptions: { 'graphql-ws': { onConnect } }` на тому ж `/graphql`;
  - auth на WS: клієнт шле токен у
    `connectionParams: { authorization: 'Bearer <jwt>' }`, в `onConnect`
    верифікація наявним `SupabaseJwtVerifier`, user у контекст з'єднання;
  - прокинути user так, щоб `@CurrentUser()`/guards працювали і для ws
    (перевірити гілку ws-контексту в `supabase-auth.guard.ts`);
  - JWT протухає, конект живе — для прототипу досить верифікації на
    конекті, refresh на живому конекті → MVP.

### Фронт

- `lib/graphql/ws-client.ts` — `createClient` з `graphql-ws`
  (`graphql-request` підписки не вміє; queries/mutations лишаються на ньому):
  `url: NEXT_PUBLIC_API_WS_URL`, async `connectionParams` з Supabase-токеном;
  тільки в браузері; на reconnect — рефетч повідомлень.
- `lib/api/chats.ts`: `fetchMyConversations`, `fetchConversation`,
  `sendMessage`, `markConversationRead`, `subscribeToMessages(id, cb)`
  (повертає unsubscribe).
- `hooks/useChat.ts`: історія → підписка → append → optimistic UI своїх
  (дедуп по id — своє прилетить і через підписку) → mark read → cleanup.
- Сторінки: **`/messages`** (інбокс: співрозмовник, вакансія, останнє
  повідомлення, unread-бейдж) і **`/messages/[id]`** (вікно чату:
  `ChatWindow` + `MessageList` (свої справа/чужі зліва, автоскрол,
  load older по курсору) + `MessageInput` (Enter — send, Shift+Enter —
  новий рядок)).
- Точки входу: кнопка "Написати" у `/applications` (doctor) і у відгуках
  дашборду (employer); іконка Messages з лічильником у `AppHeader`
  (для прототипу досить рефетчу при навігації).

## 1.8. Порядок виконання прототипу

| # | Крок | Залежить від |
|---|------|--------------|
| 1 | Auth-фундамент фронту (1.1) | — |
| 2 | createJob guard (1.2) + lifecycle (1.3) | 1 |
| 3 | Applications-модуль бек (1.4) | — |
| 4 | Фронт циклу найму: Apply, /jobs/new, /dashboard, /applications (1.5) | 1–3 |
| 5 | /profile (1.6) | 1 |
| 6 | Чати: схема + модуль + queries/mutations (1.7, без підписок) | 3 |
| 7 | Чати: subscriptions + ws-клієнт + /messages (1.7) | 6 |

Після кроку 4 прототип уже демонструє повний цикл найму; 5–7 доводять до
повного скоупу. Чат працює "на рефреші" вже після кроку 6.

---

# ЕТАП 2 — MVP

Що відділяє прототип від продукту, в який можна пустити живих користувачів.

## 2.1. Auth і безпека 🔴

- **Кешування auth** — закрити TODO в `supabase-auth.guard.ts` (зараз DB-запит
  на кожен request): кеш user у Redis (`RedisService` вже є) з коротким TTL.
- **Email-верифікація** — увімкнути в Supabase + не пускати неверифікованих
  до Apply/пост вакансії.
- **Відновлення пароля** — Supabase reset flow + сторінки на фронті.
- **Rate limiting** — `@nestjs/throttler` на мутації (особливо applyToJob,
  sendMessage, createJob).
- **Валідація вводу** — аудит усіх GraphQL inputs (`class-validator` на
  кожному полі: довжини, формати, enum); санітизація description/bio/body
  (XSS — рендеримо користувацький текст).
- **Аудит guards** — пройтись по всіх resolvers: ніщо не лишилось відкритим
  випадково; ownership-перевірки у всіх mutate-use-cases.
- **CORS/helmet** — прибрати wildcard, продові заголовки.
- **WS auth hardening** — refresh JWT на живому конекті (з прототипу
  свідомо відкладено).

## 2.2. Jobs: доведення до продукту 🔴

- **Редагування вакансії** — `updateJob` use-case + мутація (ownership,
  правила: що можна міняти в PUBLISHED) + форма редагування на фронті
  (переюзати `/jobs/new`).
- **Пагінація** — `jobs(filter)` зараз без ліміту: курсорна пагінація
  (cursor + take) у repo, query і фронті (infinite scroll або кнопка
  "Показати ще"). Те ж для myApplications/jobApplications/messages.
- **Повноцінний пошук** — закрити TODO в `job.repository.ts`: Postgres
  full-text (`tsvector` + GIN-індекс, міграція) замість contains.
- **Сортування** — newest / salary, ASC|DESC.
- **Архівація** — авто-`ARCHIVED` для старих CLOSED (cron / `@nestjs/schedule`)
  або хоча б ручна.

## 2.3. Файли 🟠

- **CV лікаря** — upload у Supabase Storage (signed URLs), поле в
  DoctorProfile, прикріплення до відгуку, перегляд employer-ом.
- **Лого компанії** — upload + показ у JobCard/JobDetail/профілі.
- Ліміти розміру/типів файлів.

## 2.4. Нотифікації 🟠

- **Email** (Resend/SES/Postmark, адаптер в infrastructure):
  - employer: новий відгук на вакансію;
  - doctor: зміна статусу заявки;
  - обидва: нове повідомлення в чаті (digest або "якщо офлайн > N хв").
- Через доменні події (`domain-event.base.ts` вже є) — handlers в окремому
  notifications-модулі, щоб не зашивати email у use-cases.
- Unsubscribe-лінк (юридично обов'язково).

## 2.5. Адмінка / модерація 🟡

- Роль ADMIN вже є в enum — використати: список/блокування користувачів,
  зняття вакансій з публікації, перегляд репортів.
- Мінімум для MVP: захищені admin-queries + проста сторінка `/admin`.

## 2.6. UX-доведення 🟠

- **Лендінг** — живі цифри (кількість вакансій/лікарів з API) замість
  хардкоду; CTA за роллю.
- **SEO** — metadata для `/jobs/[id]` (title, description, OG), sitemap,
  `generateStaticParams`/ISR для публічних вакансій.
- **Стани** — loading skeletons, error boundaries, empty states на всіх
  нових сторінках; toast-нотифікації для мутацій.
- **404/403** — сторінки.
- **Мобільна верстка** — аудит усіх сторінок (MUI breakpoints).
- **Доступність** — фокуси, aria на діалогах/формах.

## 2.7. Якість і інфраструктура 🔴

- **Тести:**
  - unit на domain (статус-машини Job/Application, VO-валідації) — найдешевші
    і найцінніші;
  - unit на use-cases (ownership, дублі відгуків) з in-memory repo;
  - e2e на API (supertest проти тестової БД): happy path циклу найму;
  - smoke на фронт (Playwright): login → apply → чат.
- **CI** — GitHub Actions: lint + typecheck + tests + build на PR
  (Nx affected, щоб ганяти тільки зачеплене).
- **Сідинг** — `prisma/seed.ts`: демо-користувачі обох ролей, 20–30 вакансій,
  відгуки — для демо і тестів.
- **Env-гігієна** — `.env.example` з усіма змінними, валідація конфігу на
  старті (`@nestjs/config` + schema).
- **Деплой** — web → Vercel; api + ws → Railway/Fly/Render (потрібен
  постійний процес через WebSocket — серверлес не підійде); Postgres + Redis
  managed; Supabase webhook на прод-URL.
- **Моніторинг** — Sentry (api + web), структуровані логи (pino),
  healthcheck endpoint.
- **Бекапи БД** — налаштувати в managed Postgres.

## 2.8. Юридичне 🟡 (медична ніша — не пропустити)

- Terms of Service + Privacy Policy сторінки, згода при реєстрації.
- GDPR-мінімум: видалення акаунта (каскади в схемі вже є), експорт даних.
- Дисклеймер про перевірку ліцензій лікарів (платформа не верифікує —
  або верифікує, тоді це окрема фіча roadmap+).

## 2.9. Пріоритети MVP

| Пріоритет | Блоки |
|-----------|-------|
| 🔴 Без цього не запускатись | 2.1 безпека, 2.2 пагінація+редагування, 2.7 тести домену + CI + деплой + сідинг |
| 🟠 Перший тиждень після запуску | 2.3 файли (CV!), 2.4 email-нотифікації, 2.6 SEO+стани |
| 🟡 Можна ітеративно | 2.5 адмінка, 2.8 юридичне (але ToS/Privacy — до публічного запуску) |

---

## Свідомо поза MVP (roadmap далі)

- Typing-індикатори / presence у чаті, вкладення в чаті
- Збережені вакансії (favorites), job alerts за фільтром
- Верифікація ліцензій лікарів
- Рекомендації вакансій, аналітика для employer-ів
- Платні тарифи / білінг
- i18n (укр/англ)
- Мобільний застосунок
