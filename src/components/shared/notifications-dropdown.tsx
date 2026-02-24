"use client";

import type { ReactNode } from "react";
import { useState, useMemo } from "react";
import {
  Check,
  FilePen,
  X,
  BellOff,
} from "lucide-react";
import { format } from "date-fns";
import { ru as dateFnsRu } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "info" | "rejected";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  date: Date;
  read: boolean;
}

const NOTIFICATION_ICONS = {
  success: Check,
  error: FilePen,
  info: FilePen,
  rejected: X,
} as const;

const NOTIFICATION_ICON_STYLES = {
  success: "bg-success/10 text-success",
  error: "bg-destructive/10 text-destructive",
  info: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
} as const;

const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "success",
    title: "Вы участник",
    description:
      "Ваша заявка на «Чемпионат России по баскетболу 2026» полностью одобрена. Вы зарегистрированы как участник.",
    date: new Date(2026, 7, 20, 16, 1),
    read: false,
  },
  {
    id: "2",
    type: "error",
    title: "В документах найдены ошибки",
    description:
      "В заявке на «Чемпионат города по плаванию» требуются правки. Причина: Не в том месте подпись",
    date: new Date(2026, 7, 20, 16, 1),
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "Документы готовы к подписанию",
    description:
      "Документы для участия в соревновании «Турнир по бадминтону» готовы к подписанию.",
    date: new Date(2026, 7, 20, 16, 1),
    read: false,
  },
  {
    id: "4",
    type: "rejected",
    title: "Заявка отклонена",
    description:
      "Ваша заявка на «Кубок по настольному теннису» отклонена. Причина: Отсутствие медицинской справки",
    date: new Date(2026, 7, 20, 16, 1),
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Заявка принята",
    description: "Заявка на «Открытый турнир по шахматам» принята.",
    date: new Date(2026, 7, 19, 12, 0),
    read: true,
  },
];

function formatNotificationDate(date: Date): string {
  const raw = format(date, "d MMM yyyy, HH:mm", { locale: dateFnsRu });
  // date-fns ru locale returns lowercase month: "авг." → capitalize to "Авг."
  return raw.replace(/(\d+\s)([а-яё]+)/, (_, day, month) => `${day}${month.charAt(0).toUpperCase()}${month.slice(1)}`);
}

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

export function NotificationsDropdown({
  trigger,
  defaultOpen,
  align = "start",
}: Props) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");

  const unread = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications]
  );
  const read = useMemo(
    () => notifications.filter((n) => n.read),
    [notifications]
  );
  const hasAny = notifications.length > 0;
  const hasUnread = unread.length > 0;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setActiveTab("read");
  }

  function clearAllRead() {
    setNotifications((prev) => prev.filter((n) => !n.read));
  }

  function markOneRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function dismissNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const showTabs = hasAny;
  const showUnreadButton = activeTab === "unread";
  const showClearReadButton = activeTab === "read" && read.length > 0;

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side="bottom"
        className="w-[520px] rounded-xl border-0 p-0 shadow-lg"
      >
        <div className="flex flex-col gap-4 px-6 pt-6 pb-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-card-foreground text-2xl font-medium">
              Уведомления
            </h2>
            {showUnreadButton && (
              <button
                type="button"
                onClick={markAllRead}
                disabled={unread.length === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none text-sm outline-none transition-colors"
              >
                Прочитать все
              </button>
            )}
            {showClearReadButton && (
              <button
                type="button"
                onClick={clearAllRead}
                className="text-muted-foreground hover:text-foreground text-sm outline-none transition-colors"
              >
                Очистить все
              </button>
            )}
          </div>

          {showTabs && (
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "unread" | "read")}
              className="w-full"
            >
              <TabsList className="border border-border bg-muted">
                <TabsTrigger
                  value="unread"
                  className="data-[state=active]:bg-card"
                >
                  <span className="text-base font-medium">
                    Непрочитанные
                  </span>
                  <Badge
                    className={cn(
                      "ml-1.5",
                      activeTab === "unread"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground"
                    )}
                  >
                    {unread.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="read" className="data-[state=active]:bg-card">
                  <span className="text-base font-medium">
                    Прочитанные
                  </span>
                  <Badge
                    className={cn(
                      "ml-1.5",
                      activeTab === "read"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground"
                    )}
                  >
                    {read.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="unread" className="mt-4 border-0 p-0">
                {unread.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-12">
                    <BellOff className="text-muted-foreground size-6" />
                    <p className="text-muted-foreground text-sm">
                      Нет уведомлений
                    </p>
                  </div>
                ) : (
                  <ul className="flex max-h-96 flex-col gap-3 overflow-y-auto">
                    {unread.map((n) => (
                      <NotificationRow
                        key={n.id}
                        item={n}
                        onSelect={() => markOneRead(n.id)}
                        onClose={dismissNotification}
                      />
                    ))}
                  </ul>
                )}
              </TabsContent>

              <TabsContent value="read" className="mt-4 border-0 p-0">
                {read.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-12">
                    <BellOff className="text-muted-foreground size-6" />
                    <p className="text-muted-foreground text-sm">
                      Нет прочитанных уведомлений
                    </p>
                  </div>
                ) : (
                  <ul className="flex max-h-96 flex-col gap-3 overflow-y-auto">
                    {read.map((n) => (
                      <NotificationRow
                        key={n.id}
                        item={n}
                        onSelect={() => {}}
                        onClose={dismissNotification}
                      />
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          )}

          {!showTabs && (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <BellOff className="text-muted-foreground size-6" />
              <p className="text-muted-foreground text-sm">
                Нет уведомлений
              </p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationRow({
  item,
  onSelect,
  onClose,
}: {
  item: NotificationItem;
  onSelect: () => void;
  onClose: (id: string) => void;
}) {
  const typeKey = item.type === "rejected" ? "rejected" : item.type;
  const Icon = NOTIFICATION_ICONS[typeKey];
  const iconStyle = NOTIFICATION_ICON_STYLES[typeKey];

  return (
    <li className="group relative">
      <button
        type="button"
        onClick={onSelect}
        className="group-hover:bg-secondary/30 flex w-full flex-row items-start gap-4 rounded-lg p-2 pr-8 text-left outline-none transition-colors"
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-md",
            iconStyle
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-foreground text-base font-semibold w-full">
            {item.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-5">
            {item.description}
          </p>
          <p className="text-muted-foreground text-sm opacity-50">
            {formatNotificationDate(item.date)}
          </p>
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose(item.id);
        }}
        aria-label="Закрыть уведомление"
        className="text-foreground hover:bg-secondary/30 absolute top-2 right-2 flex size-8 shrink-0 items-center justify-center rounded-md opacity-0 outline-none transition-opacity group-hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </li>
  );
}
