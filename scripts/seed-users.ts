/**
 * Создаёт в Supabase пользователей с ролями и записывает профили.
 * Запуск: npx tsx scripts/seed-users.ts
 * В .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (Dashboard → Settings → API).
 */

import path from "path";
import { config } from "dotenv";

config({ path: path.join(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import type { UserRole } from "../src/types/profile";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Нужны NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в окружении (например в .env.local)."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = "123456";

const USERS: { email: string; role: UserRole }[] = [
  { email: "Patsev91@ya.ru", role: "admin" },
  { email: "manager1@test.ru", role: "manager" },
  ...Array.from({ length: 20 }, (_, i) => ({
    email: `sport${i + 1}@test.ru`,
    role: "athlete" as UserRole,
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    email: `sud${i + 1}@test.ru`,
    role: "judge" as UserRole,
  })),
];

async function ensureProfileRole(userId: string, role: UserRole) {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, role, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) {
    console.error(`Профиль для ${userId}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log("Создание пользователей и профилей...\n");

  for (const { email, role } of USERS) {
    try {
      const { data: userData, error } = await supabase.auth.admin.createUser({
        email,
        password: PASSWORD,
        email_confirm: true,
      });

      if (error) {
        if (error.message.includes("already been registered") || error.message.includes("already exists")) {
          const { data: list } = await supabase.auth.admin.listUsers();
          const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
          if (existing) {
            await ensureProfileRole(existing.id, role);
            console.log(`  [OK] ${email} (уже был) → ${role}`);
            continue;
          }
        }
        throw error;
      }

      const userId = userData.user?.id;
      if (!userId) throw new Error("Нет id после createUser");
      await ensureProfileRole(userId, role);
      console.log(`  [OK] ${email} → ${role}`);
    } catch (e) {
      console.error(`  [FAIL] ${email}:`, e instanceof Error ? e.message : e);
    }
  }

  console.log("\nГотово. Пароль у всех: 123456");
}

main();
