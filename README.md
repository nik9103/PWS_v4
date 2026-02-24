# Next.js + shadcn/ui + Tailwind v4 + Supabase

Стек:

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** (PostCSS, `@tailwindcss/postcss`)
- **shadcn/ui** (New York, Lucide)
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`)

## Запуск

```bash
npm install
cp .env.local.example .env.local
# Заполни .env.local: NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Supabase

- **Клиент в браузере:** `import { createClient } from "@/lib/supabase/client"`
- **Клиент на сервере:** `import { createClient } from "@/lib/supabase/server"` (Server Components, Server Actions, Route Handlers)
- Middleware обновляет сессию через `getClaims()` и пробрасывает cookies.

Ключи возьми в [Supabase Dashboard](https://supabase.com/dashboard) → проект → Settings → API.

## shadcn/ui

Добавление компонентов:

```bash
npx shadcn@latest add card
npx shadcn@latest add input
# и т.д.
```

Компоненты лежат в `src/components/ui/`.
