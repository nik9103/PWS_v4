"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ClipboardListIcon,
  FolderOpenIcon,
  HomeIcon,
  LockIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BADGE_STATUS_COMPLETED,
  BADGE_STATUS_ONGOING,
  BADGE_STATUS_PLANNED,
} from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddCompetitionForm } from "@/components/dashboard/add-competition-form";
import { AddUserForm } from "@/components/dashboard/add-user-form";
import { useAddUserModal } from "@/contexts/add-user-modal-context";
import { useCompetitionModal } from "@/contexts/competition-modal-context";
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
} from "@/components/ui/sidebar";
import MenuTrigger from "@/components/shadcn-studio/blocks/menu-trigger";
import { NotificationsDropdown } from "@/components/shared/notifications-dropdown";
import SidebarUserDropdown from "@/components/shadcn-studio/blocks/sidebar-user-dropdown";
import { useDashboardNav } from "@/hooks/use-dashboard-nav";
import { useUserProfile } from "@/hooks/use-user-profile";

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/competitions": TrophyIcon,
  "/my-competitions": CalendarIcon,
  "/my-applications": ClipboardListIcon,
  "/applications": ClipboardListIcon,
  "/users": UsersIcon,
  "/documents": FolderOpenIcon,
};

export function AppShell({
  children,
  defaultSidebarOpen = true,
}: {
  children: React.ReactNode;
  defaultSidebarOpen?: boolean;
}) {
  const searchParams = useSearchParams();
  const { role, loading } = useUserProfile();
  const { items, pathname, currentPageTitle } = useDashboardNav();
  const competitionModal = useCompetitionModal();
  const addUserModal = useAddUserModal();
  const isAthlete = role === "athlete";

  const isCompetitionCard =
    pathname !== "/competitions" && pathname.startsWith("/competitions/");
  const competitionId = isCompetitionCard
    ? pathname.replace(/^\/competitions\//, "").split("/")[0] ?? ""
    : "";
  const competitionName = isCompetitionCard ? searchParams.get("name") : null;
  const headerTitle = competitionName ?? currentPageTitle ?? "";

  function formatCompetitionId(id: string): string {
    const num = Number.parseInt(id, 10);
    if (Number.isNaN(num)) return id;
    return String(num).padStart(4, "0");
  }

  const competitionIdFormatted = isCompetitionCard
    ? formatCompetitionId(competitionId)
    : "";
  const isUserProfilePath =
    pathname !== "/users" && pathname.startsWith("/users/");

  type CompetitionStatus = "ongoing" | "planned" | "completed";
  const competitionStatusRaw = isCompetitionCard
    ? searchParams.get("status")
    : null;
  const competitionStatus: CompetitionStatus =
    competitionStatusRaw === "ongoing" ||
    competitionStatusRaw === "planned" ||
    competitionStatusRaw === "completed"
      ? competitionStatusRaw
      : "planned";

  const COMPETITION_STATUS_LABELS: Record<CompetitionStatus, string> = {
    ongoing: "Уже идет",
    planned: "Запланирован",
    completed: "Завершено",
  };

  const STATUS_OPTIONS: { value: CompetitionStatus; label: string; dotClass: string }[] = [
    { value: "planned", label: COMPETITION_STATUS_LABELS.planned, dotClass: "bg-primary" },
    { value: "ongoing", label: COMPETITION_STATUS_LABELS.ongoing, dotClass: "bg-success" },
    { value: "completed", label: COMPETITION_STATUS_LABELS.completed, dotClass: "bg-muted-foreground" },
  ];

  const router = useRouter();

  function setCompetitionStatus(status: CompetitionStatus) {
    if (!isCompetitionCard) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="font-sans bg-background relative flex min-h-dvh w-full">
      <SidebarProvider
        defaultOpen={defaultSidebarOpen}
        className="sidebar-provider-app flex-row [&>:first-child]:shrink-0"
        style={{ "--sidebar-width-icon": "58px" } as React.CSSProperties}
      >
        <Sidebar
          variant="floating"
          collapsible="icon"
          className="font-sans p-6 pr-0 [&>[data-slot=sidebar-inner]]:group-data-[variant=floating]:rounded-xl [&>[data-slot=sidebar-inner]]:group-data-[variant=floating]:border-0"
        >
          <SidebarHeader>
            <div className="flex w-full flex-row items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    className="gap-2.5 !bg-transparent [&>svg]:size-8"
                    asChild
                  >
                    <a href="/competitions" className="flex items-center gap-2.5 text-foreground">
                      <span
                        role="img"
                        aria-label="PWS"
                        className="size-10 shrink-0 bg-foreground group-data-[collapsible=icon]:size-8 [mask-image:url('/assets/logo.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url('/assets/logo.svg')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
                      />
                      <span className="sr-only">PWS</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <NotificationsDropdown
                trigger={
                  <Button variant="ghost" size="icon" className="relative shrink-0">
                    <BellIcon />
                    <span className="bg-destructive absolute top-2 right-2.5 size-2 rounded-full" />
                  </Button>
                }
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const Icon = NAV_ICONS[item.href];
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          tooltip={item.label}
                        >
                          <a href={item.href}>
                            {Icon ? <Icon /> : null}
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t-0">
            <SidebarUserDropdown />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="min-w-0 font-sans flex flex-col py-6 bg-transparent">
          <header className="text-primary-foreground shrink-0">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pt-2 sm:px-6">
              <div className="flex min-w-0 items-start justify-start gap-6">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex min-w-0 items-start justify-start gap-4">
                    <MenuTrigger variant="outline" className="text-foreground shrink-0" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex h-10 min-w-0 w-full flex-nowrap items-center justify-start gap-2">
                        <p className="text-foreground text-lg font-semibold shrink-0">
                          {headerTitle}
                        </p>
                        {isCompetitionCard && competitionIdFormatted ? (
                          <span className="text-muted-foreground text-sm font-medium">
                            ID: {competitionIdFormatted}
                          </span>
                        ) : null}
                      </div>
                      {isCompetitionCard ? (
                        <div className="flex min-w-0 w-full">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="cursor-pointer rounded-md outline-none focus-visible:outline-none focus-visible:ring-0"
                                aria-haspopup="listbox"
                                aria-label={`Статус: ${COMPETITION_STATUS_LABELS[competitionStatus]}. Изменить`}
                              >
                                {competitionStatus === "completed" ? (
                                  <Badge
                                    variant="outline"
                                    size="lg"
                                    className={cn("rounded-md", BADGE_STATUS_COMPLETED)}
                                  >
                                    <span className="size-2 rounded-full bg-current" aria-hidden />
                                    {COMPETITION_STATUS_LABELS[competitionStatus]}
                                    <ChevronDownIcon className="size-4 opacity-60" aria-hidden />
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    size="lg"
                                    className={cn(
                                      "rounded-md border-none focus-visible:outline-none",
                                      competitionStatus === "ongoing" && BADGE_STATUS_ONGOING,
                                      competitionStatus === "planned" && BADGE_STATUS_PLANNED
                                    )}
                                  >
                                    <span className="size-2 rounded-full bg-current" aria-hidden />
                                    {COMPETITION_STATUS_LABELS[competitionStatus]}
                                    <ChevronDownIcon className="size-4 opacity-60" aria-hidden />
                                  </Badge>
                                )}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="min-w-[10rem]">
                              {STATUS_OPTIONS.map((opt) => {
                                const isSelected = competitionStatus === opt.value;
                                return (
                                  <DropdownMenuItem
                                    key={opt.value}
                                    onClick={() => setCompetitionStatus(opt.value)}
                                    className={cn(
                                      "flex cursor-pointer items-center gap-2 rounded-md",
                                      isSelected && "bg-muted"
                                    )}
                                  >
                                    <span className={cn("size-2 shrink-0 rounded-full", opt.dotClass)} aria-hidden />
                                    <span className="flex-1 text-left">{opt.label}</span>
                                    {isSelected && <CheckIcon className="size-4 shrink-0 text-foreground" aria-hidden />}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                {isCompetitionCard ? (
                  <div className="flex shrink-0 gap-4">
                    <Button
                      variant="outline"
                      className="gap-2 rounded-lg bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
                      onClick={() =>
                        competitionModal.openEdit({
                          id: competitionId,
                          competitionName: competitionName ?? headerTitle ?? "",
                          sportName: "",
                          participants: 0,
                          period: "",
                          startTime: "",
                          status: "planned",
                          periodStartDate: "",
                          periodEndDate: "",
                        })
                      }
                    >
                      <PencilIcon className="size-4" aria-hidden />
                      Редактировать
                    </Button>
                    <Button variant="outline" className="gap-2 rounded-lg bg-card text-foreground hover:bg-accent hover:text-accent-foreground">
                      <Trash2Icon className="size-4" aria-hidden />
                      Удалить
                    </Button>
                  </div>
                ) : isUserProfilePath ? (
                  <div className="flex shrink-0 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      className="gap-2 rounded-lg border-destructive bg-card text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Заблокировать"
                    >
                      <LockIcon className="size-4" aria-hidden />
                      Заблокировать
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      className="gap-2 rounded-lg bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
                      aria-label="Редактировать"
                    >
                      <PencilIcon className="size-4" aria-hidden />
                      Редактировать
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      className="gap-2 rounded-lg bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
                      aria-label="Удалить"
                    >
                      <Trash2Icon className="size-4" aria-hidden />
                      Удалить
                    </Button>
                  </div>
                ) : pathname === "/competitions" && !loading && !isAthlete ? (
                  <Button
                    size="lg"
                    className="shrink-0 gap-2"
                    onClick={() => competitionModal.openAdd()}
                  >
                    <PlusIcon className="size-4" aria-hidden />
                    Добавить соревнование
                  </Button>
                ) : pathname === "/users" ? (
                  <Button
                    size="lg"
                    className="shrink-0 gap-2"
                    onClick={() => addUserModal.openAdd()}
                  >
                    <PlusIcon className="size-4" aria-hidden />
                    Добавить пользователя
                  </Button>
                ) : null}
              </div>
            </div>
          </header>
          <Dialog
            open={competitionModal.isOpen}
            onOpenChange={(open) => !open && competitionModal.close()}
          >
            <DialogContent
              showCloseButton={false}
              className="p-0 border-0 shadow-none bg-transparent max-w-fit"
            >
              <DialogTitle className="sr-only">
                {competitionModal.mode === "edit"
                  ? "Редактировать соревнование"
                  : "Добавить соревнование"}
              </DialogTitle>
              <AddCompetitionForm
                mode={competitionModal.mode}
                initialData={competitionModal.editRow}
                onCancel={competitionModal.close}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={addUserModal.isOpen}
            onOpenChange={(open) => !open && addUserModal.close()}
          >
            <DialogContent showCloseButton={false} className="sm:max-w-xl">
              <AddUserForm
                onCancel={addUserModal.close}
                onSuccess={addUserModal.close}
              />
            </DialogContent>
          </Dialog>
          <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6 min-h-0">
            {children}
          </main>
          <footer className="shrink-0">
            <div className="text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-center gap-3 px-4 max-sm:flex-col sm:gap-6 sm:px-6">
              <p className="text-sm text-balance max-sm:text-center">
                {`©${new Date().getFullYear()}`} PWS
              </p>
              <div className="flex items-center gap-5">
                <a href="#">
                  <span className="size-4" />
                </a>
              </div>
            </div>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
