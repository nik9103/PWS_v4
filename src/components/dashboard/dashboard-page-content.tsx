"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import { ROLE_LABELS } from "@/types/profile";

export function DashboardPageContent() {
  const { role, loading } = useUserProfile();
  const roleLabel = role ? ROLE_LABELS[role] : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6">
      {loading ? (
        <p className="text-muted-foreground">Загрузка…</p>
      ) : (
        <p className="text-2xl font-semibold text-foreground">
          {roleLabel ? `${roleLabel}. Главная.` : "Вы авторизованы."}
        </p>
      )}
    </div>
  );
}
