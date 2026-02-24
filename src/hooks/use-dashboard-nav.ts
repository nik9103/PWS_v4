"use client";

import { usePathname } from "next/navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import type { UserRole } from "@/types/profile";

/** Последняя известная роль — на уровне модуля, не сбрасывается при ремаунте/переходе */
let lastKnownRole: UserRole | null = null;

export interface DashboardNavItem {
  href: string;
  label: string;
  /** Заголовок в шапке (если не задан — используется label) */
  pageTitle?: string;
  roles: UserRole[];
}

/** Главная = «Все соревнования» (первый пункт) */
const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { href: "/competitions", label: "Все соревнования", pageTitle: "Все соревнования", roles: ["admin", "manager", "athlete"] },
  { href: "/my-competitions", label: "Мои соревнования", pageTitle: "Мои соревнования", roles: ["athlete"] },
  { href: "/my-applications", label: "Мои заявки", pageTitle: "Мои заявки", roles: ["athlete"] },
  { href: "/applications", label: "Заявки", roles: ["admin", "manager"] },
  { href: "/users", label: "Пользователи", roles: ["admin", "manager"] },
  { href: "/documents", label: "Документы", roles: ["admin", "manager"] },
];

/** Заголовок в шапке по pathname — не зависит от роли, нет проскальзывания «Привет» при загрузке */
const PATH_PAGE_TITLES: Record<string, string> = Object.fromEntries(
  DASHBOARD_NAV_ITEMS.map((item) => [item.href, item.pageTitle ?? item.label])
);

export function useDashboardNav() {
  const { role } = useUserProfile();
  const pathname = usePathname();

  if (role != null) lastKnownRole = role;
  const effectiveRole = role ?? lastKnownRole;

  const visibleItems = effectiveRole
    ? DASHBOARD_NAV_ITEMS.filter((item) => item.roles.includes(effectiveRole))
    : [];

  const isUserProfilePath =
    pathname !== "/users" && pathname.startsWith("/users/");

  const currentPageTitle = isUserProfilePath
    ? "Профиль пользователя"
    : (PATH_PAGE_TITLES[pathname] ?? "");

  return { items: visibleItems, pathname, currentPageTitle };
}
