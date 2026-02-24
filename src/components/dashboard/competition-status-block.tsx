"use client";

import {
  CalendarIcon,
  CalendarClockIcon,
  CheckCircleIcon,
  ClockIcon,
  FileSignatureIcon,
  FileWarningIcon,
  FlagIcon,
  HourglassIcon,
  MoreVerticalIcon,
  TimerIcon,
  TrophyIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/** Варианты состояния карточки соревнования (12 состояний по дизайну). */
export type CompetitionStatusVariant =
  | "available_places"
  | "days_until_start"
  | "places_left"
  | "places_and_days"
  | "under_review"
  | "rejected"
  | "sign_documents"
  | "document_errors"
  | "admitted"
  | "scheduled"
  | "in_progress"
  | "completed";

type ActionType = "button_apply" | "button_urgent" | "button_correct" | "menu" | "none";

type StatusConfig = {
  icon: LucideIcon;
  iconBgClass: string;
  iconClass: string;
  titleClass: string;
  getTitle: (payload: CompetitionStatusPayload) => string;
  getSubtitle: (payload: CompetitionStatusPayload) => string;
  action: ActionType;
  buttonLabel?: string;
  buttonVariant?: "primary" | "warning" | "destructive";
};

type CompetitionStatusPayload = {
  placesCount?: number;
  daysCount?: number;
  rejectReason?: string;
};

/** Склонение для мест: 1 место, 2 места, 5 мест. */
function pluralPlaces(n: number): "место" | "места" | "мест" {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "место";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "места";
  return "мест";
}

/** Склонение для дней: 1 день, 2 дня, 5 дней. */
function pluralDays(n: number): "день" | "дня" | "дней" {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "дня";
  return "дней";
}

const STATUS_CONFIG: Record<CompetitionStatusVariant, StatusConfig> = {
  available_places: {
    icon: TrophyIcon,
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
    titleClass: "text-primary",
    getTitle: (p) => {
      const n = p.placesCount ?? 100;
      return `Доступно ${n} ${pluralPlaces(n)}`;
    },
    getSubtitle: () => "Подайте заявку и займите место — станьте победителем",
    action: "button_apply",
    buttonLabel: "Подать заявку",
    buttonVariant: "primary",
  },
  days_until_start: {
    icon: ClockIcon,
    iconBgClass: "bg-warning/10",
    iconClass: "text-warning",
    titleClass: "text-warning",
    getTitle: (p) => {
      const n = p.daysCount ?? 2;
      return `Осталось ${n} ${pluralDays(n)} до старта`;
    },
    getSubtitle: () => "Не упустите шанс подать заявку",
    action: "button_urgent",
    buttonLabel: "Успеть подать заявку",
    buttonVariant: "warning",
  },
  places_left: {
    icon: UsersIcon,
    iconBgClass: "bg-warning/10",
    iconClass: "text-warning",
    titleClass: "text-warning",
    getTitle: (p) => {
      const n = p.placesCount ?? 2;
      return `Осталось ${n} ${pluralPlaces(n)}`;
    },
    getSubtitle: () => "Заканчиваются места на соревнование",
    action: "button_urgent",
    buttonLabel: "Успеть подать заявку",
    buttonVariant: "warning",
  },
  places_and_days: {
    icon: CalendarClockIcon,
    iconBgClass: "bg-warning/10",
    iconClass: "text-warning",
    titleClass: "text-warning",
    getTitle: (p) => {
      const places = p.placesCount ?? 2;
      const days = p.daysCount ?? 2;
      return `Осталось ${places} ${pluralPlaces(places)} · Старт через ${days} ${pluralDays(days)}`;
    },
    getSubtitle: () => "Не упустите шанс подать заявку",
    action: "button_urgent",
    buttonLabel: "Успеть подать заявку",
    buttonVariant: "warning",
  },
  under_review: {
    icon: HourglassIcon,
    iconBgClass: "bg-warning/10",
    iconClass: "text-warning",
    titleClass: "text-warning",
    getTitle: () => "Заявка на рассмотрении",
    getSubtitle: () => "Ожидайте решения спортивного менеджера",
    action: "none",
  },
  rejected: {
    icon: XCircleIcon,
    iconBgClass: "bg-destructive/10",
    iconClass: "text-destructive",
    titleClass: "text-destructive",
    getTitle: () => "Отклонена",
    getSubtitle: (p) => p.rejectReason ?? "Без указания причин",
    action: "none",
  },
  sign_documents: {
    icon: FileSignatureIcon,
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
    titleClass: "text-primary",
    getTitle: () => "Требуется подпись документов",
    getSubtitle: () => "Подпишите документы для допуска к соревнованию",
    action: "button_apply",
    buttonLabel: "Подать заявку",
    buttonVariant: "primary",
  },
  document_errors: {
    icon: FileWarningIcon,
    iconBgClass: "bg-destructive/10",
    iconClass: "text-destructive",
    titleClass: "text-destructive",
    getTitle: () => "В документах найдены ошибки",
    getSubtitle: () => "Внесите исправления, чтобы продолжить",
    action: "button_correct",
    buttonLabel: "Исправить",
    buttonVariant: "destructive",
  },
  admitted: {
    icon: CheckCircleIcon,
    iconBgClass: "bg-success/10",
    iconClass: "text-success",
    titleClass: "text-success",
    getTitle: () => "Вы допущены к соревнованию",
    getSubtitle: () => "Заявка принята, вы участник",
    action: "menu",
  },
  scheduled: {
    icon: CalendarIcon,
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
    titleClass: "text-primary",
    getTitle: () => "Соревнование запланировано",
    getSubtitle: () => "Вы в списке участников",
    action: "menu",
  },
  in_progress: {
    icon: TimerIcon,
    iconBgClass: "bg-success/10",
    iconClass: "text-success",
    titleClass: "text-success",
    getTitle: () => "Соревнование идёт",
    getSubtitle: () => "Желаем удачи в участии в соревновании",
    action: "menu",
  },
  completed: {
    icon: FlagIcon,
    iconBgClass: "bg-muted",
    iconClass: "text-muted-foreground",
    titleClass: "text-muted-foreground",
    getTitle: () => "Соревнование завершено",
    getSubtitle: () => "Спасибо за участие! Результаты уже доступны",
    action: "menu",
  },
};

export type CompetitionStatusBlockProps = {
  variant: CompetitionStatusVariant;
  payload?: CompetitionStatusPayload;
  /** Ссылка для кнопки «Подать заявку» / «Успеть подать заявку» (asChild + Link). */
  applicationHref?: string;
  /** Обработчик кнопки «Исправить». */
  onCorrectClick?: () => void;
  /** Элементы меню (три точки) для состояний admitted, scheduled, in_progress, completed. */
  menuItems?: React.ReactNode;
  className?: string;
};

export function CompetitionStatusBlock({
  variant,
  payload = {},
  applicationHref,
  onCorrectClick,
  menuItems,
  className,
}: CompetitionStatusBlockProps) {
  const config = STATUS_CONFIG[variant];
  const Icon = config.icon;
  const title = config.getTitle(payload);
  const subtitle = config.getSubtitle(payload);

  const renderAction = () => {
    if (config.action === "none") return null;

    if (config.action === "menu") {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-10 shrink-0" aria-label="Ещё">
              <MoreVerticalIcon className="size-5" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem]">
            {menuItems ?? (
              <DropdownMenuItem disabled>Нет действий</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (config.action === "button_apply" && config.buttonLabel) {
      const button = (
        <Button
          asChild={Boolean(applicationHref)}
          size="default"
          className={cn(
            "h-10 shrink-0",
            !applicationHref && "pointer-events-none opacity-50"
          )}
          variant="default"
        >
          {applicationHref ? (
            <Link href={applicationHref}>{config.buttonLabel}</Link>
          ) : (
            <span>{config.buttonLabel}</span>
          )}
        </Button>
      );
      return button;
    }

    if (config.action === "button_urgent" && config.buttonLabel) {
      return (
        <Button
          asChild={Boolean(applicationHref)}
          size="default"
          className={cn(
            "h-10 shrink-0 bg-warning text-primary-foreground hover:bg-warning/90",
            !applicationHref && "pointer-events-none opacity-50"
          )}
        >
          {applicationHref ? (
            <Link href={applicationHref}>{config.buttonLabel}</Link>
          ) : (
            <span>{config.buttonLabel}</span>
          )}
        </Button>
      );
    }

    if (config.action === "button_correct" && config.buttonLabel) {
      return (
        <Button
          size="default"
          variant="destructive"
          className="h-10 shrink-0"
          onClick={onCorrectClick}
        >
          {config.buttonLabel}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className={cn("border-border border-t pt-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-md",
              config.iconBgClass
            )}
          >
            <Icon className={cn("size-5", config.iconClass)} aria-hidden />
          </div>
          <div>
            <p className={cn("font-medium", config.titleClass)}>{title}</p>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          </div>
        </div>
        {renderAction()}
      </div>
    </div>
  );
}
