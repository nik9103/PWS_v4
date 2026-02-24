"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/shared/app-shell";

/**
 * Оборачивает AppShell и рендерит его только после монтирования на клиенте,
 * чтобы избежать hydration mismatch из‑за разных Radix ID на сервере и клиенте.
 */
export function AppShellClient({
  defaultSidebarOpen,
  children,
}: {
  defaultSidebarOpen: boolean;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="font-sans bg-background relative flex min-h-dvh w-full items-center justify-center">
        <div className="text-muted-foreground text-sm">Загрузка…</div>
      </div>
    );
  }

  return (
    <AppShell defaultSidebarOpen={defaultSidebarOpen}>{children}</AppShell>
  );
}
