import { Suspense } from "react";
import { AppShell } from "@/components/shared/app-shell";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center font-sans">Загрузка…</div>}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
