import { Suspense } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { AddUserModalProvider } from "@/contexts/add-user-modal-context";
import { CompetitionModalProvider } from "@/contexts/competition-modal-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center font-sans">Загрузка…</div>}>
      <CompetitionModalProvider>
        <AddUserModalProvider>
          <AppShell>{children}</AppShell>
        </AddUserModalProvider>
      </CompetitionModalProvider>
    </Suspense>
  );
}
