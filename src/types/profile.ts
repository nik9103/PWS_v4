/** Роли в БД (enum user_role в Supabase) */
export type UserRole = "athlete" | "judge" | "manager" | "admin";

export interface Profile {
  id: string;
  role: UserRole;
  updated_at: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  athlete: "Спортсмен",
  judge: "Судья",
  manager: "Спортивный менеджер",
  admin: "Администратор",
};

export const ADMIN_ROLE: UserRole = "admin";
