import { AppShell } from "@/components/shared/app-shell";
import { AddUserModalProvider } from "@/contexts/add-user-modal-context";
import { CompetitionModalProvider } from "@/contexts/competition-modal-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompetitionModalProvider>
      <AddUserModalProvider>
        <AppShell>{children}</AppShell>
      </AddUserModalProvider>
    </CompetitionModalProvider>
  );
}
