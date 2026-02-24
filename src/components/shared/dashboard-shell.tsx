"use client";

// Один shell для всех ролей; видимость пунктов меню и страниц — по роли.
// Любые карточки статистики, графики, таблицы с демо-данными не из проекта
// помечать комментарием: // TODO: REMOVE BEFORE RELEASE

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useDashboardNav } from "@/hooks/use-dashboard-nav";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ROLE_LABELS } from "@/types/profile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/competitions": Home,
  "/admin": LayoutDashboard,
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { items, pathname } = useDashboardNav();
  const { role, loading } = useUserProfile();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const roleLabel = role ? ROLE_LABELS[role] : null;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const Icon = NAV_ICONS[item.href];
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                        <Link href={item.href}>
                          {Icon ? <Icon /> : null}
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
          {!loading && roleLabel && (
            <p className="px-2 py-1 text-xs text-muted-foreground">{roleLabel}</p>
          )}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Выйти</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
