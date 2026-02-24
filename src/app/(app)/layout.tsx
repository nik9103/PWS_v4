import { cookies } from "next/headers";
import { AppShellClient } from "@/components/shared/app-shell-client";
import { AddUserModalProvider } from "@/contexts/add-user-modal-context";
import { CompetitionModalProvider } from "@/contexts/competition-modal-context";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get("sidebar_state");
  const defaultSidebarOpen = sidebarCookie ? sidebarCookie.value === "true" : true;

  return (
    <CompetitionModalProvider>
      <AddUserModalProvider>
        <AppShellClient defaultSidebarOpen={defaultSidebarOpen}>
          {children}
        </AppShellClient>
      </AddUserModalProvider>
    </CompetitionModalProvider>
  );
}
