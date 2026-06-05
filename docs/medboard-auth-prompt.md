# Medboard - Sign In Page Implementation Prompt

## Context

You are working in an Nx monorepo. The web app lives at `apps/web/` and uses:
- **Next.js 14+ App Router**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (already installed)
- **react-hook-form** + **zod** for form validation
- **next-auth** or a custom auth flow via `lib/api/auth.ts`

The existing folder structure:
```
apps/web/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   └── jobs/
│       └── JobList.tsx
├── lib/
│   └── api/
│       └── jobs.ts
└── theme/
    ├── theme.ts
    └── theme.client.ts
```

---

## Task

Implement the **Sign In page** for Medboard based on the design described below.

---

## Design Description

### Overall Layout
Two-column split layout (side-by-side, no gap):
- **Left panel** — ~45% width, dark navy blue background (`#1B2B5E` or similar deep blue)
- **Right panel** — ~55% width, white background with the sign-in form

On mobile: stack vertically, left panel collapses or hides, form takes full screen.

---

### Left Panel (`AuthBrandPanel`)

Background: dark navy with two large blurred translucent circles (decorative, lighter blue, ~300px diameter, positioned top-right area of the panel).

Content (vertically centered, ~40px padding):
1. **Logo** — top-left: white `+` icon (cross/plus) + text "Medboard" in white, ~16px, font-weight 600
2. **Headline** — "Welcome back to Medboard." — white, ~32px, font-weight 700, max-width ~280px
3. **Subtext** — "Pick up right where you left off — your matches, messages, and applications are waiting." — white/70% opacity, ~14px, max-width ~260px, margin-top 12px
4. **Hero Cards** — two overlapping white cards stacked with a slight offset/tilt:
   - **Card 1** (back, slightly offset right):
     - Avatar circle with initials "BH" (blue background)
     - Title: "ICU Registered Nurse" bold ~13px
     - Subtitle: "Beacon Hill Medical Center" gray ~11px
     - Salary badge: "$96k–$124k" blue text, right-aligned
   - **Card 2** (front, overlapping card 1):
     - Avatar circle with initials "JW" (teal/green background)
     - Name: "James Whitfield" bold ~13px
     - Status badge: green dot + "Available now" — green pill badge
5. **Trust line** — bottom of panel: shield icon + "Credentials verified · HIPAA-aware" white/60% opacity, ~12px

---

### Right Panel (`AuthFormContainer`)

White background, vertically centered content, ~48px horizontal padding.

Content:
1. **Back link** — top-left: `< Back to home` — gray, ~13px, links to `/`
2. **Title** — "Sign in" — dark, ~28px, font-weight 700, margin-top 24px
3. **Subtitle** — "Welcome back. Enter your details to continue." — gray, ~14px
4. **Form** (`SignInForm`) — margin-top 24px:
   - **Email field**:
     - Label: "Email address" 13px gray
     - Input: placeholder "you@clinic.com", left icon = envelope svg, border rounded-lg
   - **Password field**:
     - Label: "Password"
     - Input: dots placeholder, left icon = shield/lock svg, right icon = eye toggle (show/hide), border rounded-lg
   - **Row**: checkbox "Remember me" (left) + link "Forgot password?" (right, blue, ~13px)
   - **Submit button**: full-width, rounded-full, blue background (`#5B7BE8` or similar), "Sign in →" white text, 14px, height 48px. Has loading state (spinner replaces arrow).
   - **Divider**: "or" with horizontal lines on each side
   - **SSO button**: full-width, white bg, border, rounded-full, device/SSO icon + "Continue with SSO" dark text
5. **Footer**: "New to Medboard?" gray + "Create an account" blue link

---

## File Structure to Create

```
apps/web/src/
├── app/
│   └── (auth)/
│       └── signin/
│           └── page.tsx
├── components/
│   └── auth/
│       ├── AuthLayout.tsx
│       ├── AuthBrandPanel.tsx
│       ├── AuthFormContainer.tsx
│       ├── SignInForm.tsx
│       ├── HeroCards.tsx
│       └── TrustBadge.tsx
```

---

## Implementation Requirements

### `app/(auth)/signin/page.tsx`
- Server Component
- Renders `<AuthLayout>` which splits into brand panel + form container
- If user is already authenticated, redirect to `/dashboard`

### `AuthLayout.tsx`
- Server Component
- `flex h-screen` container
- Left: `AuthBrandPanel` (hidden on mobile with `hidden md:flex`)
- Right: `AuthFormContainer` with `SignInForm` inside

### `AuthBrandPanel.tsx`
- Server Component
- Dark navy background via Tailwind or inline style
- Decorative circles: two `absolute` divs with `rounded-full bg-blue-400/10 blur-3xl`
- Renders: Logo, headline, subtext, `<HeroCards />`, `<TrustBadge />`

### `HeroCards.tsx`
- Can be Server Component (static data)
- Two white cards with `rounded-2xl shadow-lg`
- Card 2 positioned absolutely overlapping card 1 with `translate-x-6 translate-y-6`
- Avatar circles use Tailwind `w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold`

### `TrustBadge.tsx`
- Single line: shield SVG icon + text
- white/60 opacity

### `AuthFormContainer.tsx`
- Server Component wrapper
- `flex flex-col justify-center` with padding
- Renders `BackLink`, heading, subtitle, `<SignInForm />`

### `SignInForm.tsx`
- **`"use client"`** directive required
- Use `react-hook-form` with `useForm`
- Zod schema:
  ```ts
  const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
    remember: z.boolean().optional(),
  })
  ```
- `onSubmit` calls `signIn` from `lib/api/auth.ts` (create a stub if not exists)
- Show field-level errors below each input
- Button shows `<Loader2 className="animate-spin" />` during submission
- On error show a toast or inline error message

### Shared UI primitives (use shadcn if available, otherwise create)
- `Input` with left/right icon slot support
- `Button` with loading prop
- `Checkbox`

---

## Styling Notes

- Primary blue: `#5B7BE8` (or closest Tailwind — `blue-500` / `indigo-500`)
- Navy panel bg: `#1B2B5E` (use `[#1B2B5E]` arbitrary Tailwind value)
- Card shadow: `shadow-xl`
- All inputs: `rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400`
- Submit button: `rounded-full bg-[#5B7BE8] hover:bg-[#4A6AD6]`
- Responsive: the left panel is `hidden md:flex md:w-[45%]`, right is `w-full md:w-[55%]`

---

## What NOT to do
- Do not use `<form>` HTML tag directly — use react-hook-form's `<form {...methods}>` pattern
- Do not put `"use client"` on layout files or page.tsx — keep them as RSC
- Do not hardcode auth logic in the component — keep it in `lib/api/auth.ts`
- Do not skip TypeScript types — all props must be typed

---

## Definition of Done
- [ ] Page renders at `/signin` route
- [ ] Left brand panel visible on desktop, hidden on mobile
- [ ] Form validates email + password on submit with zod errors shown
- [ ] Loading state on submit button works
- [ ] "Show password" toggle works
- [ ] "Forgot password?" and "Create an account" links render (can be `href="#"` stubs)
- [ ] "Continue with SSO" button renders
- [ ] Responsive layout works on 375px and 1280px viewports
