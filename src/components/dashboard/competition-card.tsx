"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru as dateFnsRu } from "date-fns/locale";
import {
  Building2Icon,
  CalendarClockIcon,
  InfoIcon,
  MapPinIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

function StepIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
      {...props}
    >
      <path d="M7.36434 11.3044L6.03379 8.61516L4.98168 7.27008C4.82626 7.00709 4.74426 6.7072 4.74426 6.40172V3.375H5.11153C5.23534 3.37497 5.35794 3.39933 5.47234 3.44669C5.58673 3.49405 5.69068 3.56348 5.77824 3.65101C5.8658 3.73855 5.93525 3.84248 5.98264 3.95686C6.03003 4.07125 6.05442 4.19385 6.05442 4.31766V8.61516" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.99768 6.86836V5.1218C2.99768 5.1218 3.87096 3.375 4.74424 3.375" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.67422 6.43172L7.125 5.41406" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.99683 11.2116L5.25003 9.375" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.05443 2.50145C6.53673 2.50145 6.92771 2.11046 6.92771 1.62816C6.92771 1.14586 6.53673 0.754883 6.05443 0.754883C5.57213 0.754883 5.18115 1.14586 5.18115 1.62816C5.18115 2.11046 5.57213 2.50145 6.05443 2.50145Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CompetitionStatusBlock } from "@/components/dashboard/competition-status-block";
import type { CompetitionItem } from "@/components/dashboard/competitions-datatable";

function formatCompetitionId(id: string): string {
  const num = Number.parseInt(id, 10);
  if (Number.isNaN(num)) return id;
  return String(num).padStart(4, "0");
}

type CompetitionCardProps = {
  item: CompetitionItem;
  /** Ссылка для кнопки в блоке статуса (по умолчанию /competitions/{id}). */
  applicationHref?: string;
  /** Обработчик кнопки «Исправить» для статуса document_errors. */
  onCorrectClick?: () => void;
  /** Пункты меню (три точки) для статусов с меню. */
  menuItems?: React.ReactNode;
};

function formatPeriodRange(start: string, end: string): string {
  const from = new Date(start);
  const to = new Date(end);
  const fromStr = format(from, "d MMM yyyy", { locale: dateFnsRu });
  const toStr = format(to, "d MMM yyyy", { locale: dateFnsRu });
  if (fromStr === toStr) return fromStr;
  return `${format(from, "d MMM", { locale: dateFnsRu })} - ${format(to, "d MMM yyyy", { locale: dateFnsRu })}`;
}

/**
 * Мастер-компонент карточки соревнования в списке.
 * Используется на: «Все соревнования», «Мои соревнования», «Мои заявки».
 * Варианты блока статуса задаются через item.statusBlock (CompetitionStatusBlock).
 */
export function CompetitionCard({ item, applicationHref, onCorrectClick, menuItems }: CompetitionCardProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const startDate = new Date(item.periodStartDate);
  const dayShort = format(startDate, "EEEEEE", { locale: dateFnsRu });
  const dayNum = format(startDate, "d");
  const monthShort = format(startDate, "LLL", { locale: dateFnsRu });
  const idFormatted = formatCompetitionId(item.id);
  const periodText = formatPeriodRange(item.periodStartDate, item.periodEndDate);
  const organizerText = item.organizer ?? "Не указан";
  const registryText =
    item.registryIncluded !== false ? "Включен в реестр" : "Не включён в реестр";

  return (
    <Card className="w-full rounded-xl shadow-sm gap-0 py-0">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-40 shrink-0 p-2">
            <div className="bg-accent flex h-full flex-col justify-between rounded-lg p-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-card-foreground text-3xl font-semibold leading-9">
                  {dayShort}, {dayNum}
                </h2>
                <p className="text-muted-foreground text-sm">{monthShort}</p>
              </div>
              <p className="text-muted-foreground text-xs opacity-50">
                ID: {idFormatted}
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-7 p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <h3 className="text-card-foreground mb-3 text-xl font-semibold">
                  {item.competitionName}
                </h3>

                <div className="mb-2 flex gap-3">
                  <MapPinIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden />
                  <div className="flex flex-col gap-2">
                    <p className="text-foreground font-medium">Москва</p>
                    <p className="text-muted-foreground text-sm">
                      Место проведения уточняется
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1">
                        <span className="bg-destructive size-2 rounded-full" aria-hidden />
                        <span className="text-card-foreground text-xs font-medium">
                          м. Лужники
                        </span>
                        <StepIcon className="text-muted-foreground size-3" />
                        <span className="text-muted-foreground text-xs">
                          11 мин · 850 м
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="bg-destructive size-2 rounded-full" aria-hidden />
                        <span className="text-card-foreground text-xs font-medium">
                          м. Спортивная
                        </span>
                        <StepIcon className="text-muted-foreground size-3" />
                        <span className="text-muted-foreground text-xs">
                          11 мин · 850 м
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Popover open={infoOpen} onOpenChange={setInfoOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 shrink-0 p-1.5"
                    aria-label="Информация"
                  >
                    <InfoIcon className="size-4" aria-hidden />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  side="bottom"
                  className="w-80 rounded-lg p-0"
                >
                  <div className="flex flex-col">
                    <div className="flex items-start gap-3 p-4">
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
                        <TrophyIcon
                          className="text-muted-foreground size-5"
                          aria-hidden
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground font-medium">
                          {item.sportName}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Дисциплина
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 px-4 pb-4">
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
                        <CalendarClockIcon
                          className="text-muted-foreground size-5"
                          aria-hidden
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground font-medium">
                          {periodText}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Период проведения
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 px-4 pb-4">
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
                        <Building2Icon
                          className="text-muted-foreground size-5"
                          aria-hidden
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground font-medium">
                          {organizerText}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Организатор
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 px-4 pb-4">
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
                        <ShieldCheckIcon
                          className="text-muted-foreground size-5"
                          aria-hidden
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground font-medium">
                          {registryText}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Минспорт
                        </p>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <CompetitionStatusBlock
              variant={item.statusBlock?.variant ?? "available_places"}
              payload={
                item.statusBlock?.payload ?? { placesCount: item.participants }
              }
              applicationHref={applicationHref ?? `/competitions/${item.id}`}
              onCorrectClick={onCorrectClick}
              menuItems={menuItems}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
