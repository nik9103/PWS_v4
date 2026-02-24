"use client";

import { useMemo, useState } from "react";
import { format, parse, startOfDay, endOfDay } from "date-fns";
import { ru as dateFnsRu } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { ru as dayPickerRu } from "react-day-picker/locale";
import { CalendarIcon, Funnel, SearchIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ApplicationsDatatable, type ApplicationItem } from "@/components/dashboard/applications-datatable";
import {
  ApplicationsFilterPopover,
  type ApplicationsFilterState,
} from "@/components/dashboard/applications-filter-popover";

function formatPeriodLabel(range: DateRange | undefined): string {
  if (!range?.from) return "";
  const fromStr = format(range.from, "d MMM yyyy", { locale: dateFnsRu });
  if (!range.to || range.from.getTime() === range.to.getTime()) return fromStr;
  return `${fromStr} – ${format(range.to, "d MMM yyyy", { locale: dateFnsRu })}`;
}

// TODO: REMOVE BEFORE RELEASE — демо-данные, заменить на выборку из Supabase
const DEMO_ATHLETE_NAMES = [
  "Белов Михаил Иванович",
  "Козлов Александр Дмитриевич",
  "Новиков Сергей Андреевич",
  "Морозов Дмитрий Павлович",
  "Петров Андрей Николаевич",
  "Волков Алексей Евгеньевич",
  "Соколов Иван Сергеевич",
  "Михайлов Павел Александрович",
  "Федоров Николай Дмитриевич",
  "Николаев Евгений Иванович",
  "Кузнецов Михаил Сергеевич",
  "Попов Александр Андреевич",
  "Васильев Дмитрий Николаевич",
  "Смирнов Сергей Павлович",
  "Кузнецова Анна Ивановна",
  "Орлова Елена Дмитриевна",
  "Волкова Мария Сергеевна",
  "Лебедев Олег Андреевич",
  "Семёнов Григорий Николаевич",
  "Егоров Виктор Павлович",
];

const DEMO_APPLICATIONS: ApplicationItem[] = [
  { id: "1", name: DEMO_ATHLETE_NAMES[0], email: "sport1@test.ru", competitionName: "Чемпионат России 2024", period: "10 фев. – 16 фев. 2025", applicationType: "participation", status: "under_review", decision: "approved" },
  { id: "2", name: DEMO_ATHLETE_NAMES[1], email: "sport2@test.ru", competitionName: "Гран-при России по автоспорту 2024", period: "10 фев. – 16 фев. 2025", applicationType: "participation", status: "documents_unsigned", decision: "pending" },
  { id: "3", name: DEMO_ATHLETE_NAMES[2], email: "sport1@test.ru", competitionName: "Зимний чемпионат России 2024", period: "10 фев. – 16 фев. 2025", applicationType: "participation", status: "document_check", decision: "approved" },
  { id: "4", name: DEMO_ATHLETE_NAMES[3], email: "sport2@test.ru", competitionName: "Чемпионат России 2024", period: "10 фев. – 16 фев. 2025", applicationType: "participation", status: "errors_found", decision: "pending" },
  { id: "5", name: DEMO_ATHLETE_NAMES[4], email: "sport3@test.ru", competitionName: "Гран-при России по автоспорту 2024", period: "10 фев. – 16 фев. 2025", applicationType: "participation", status: "accepted", decision: "approved" },
  { id: "6", name: DEMO_ATHLETE_NAMES[5], email: "sport1@test.ru", competitionName: "Зимний чемпионат России 2024", period: "10 фев. – 16 фев. 2025", applicationType: "participation", status: "rejected", decision: "rejected" },
  { id: "7", name: DEMO_ATHLETE_NAMES[6], email: "sport2@test.ru", competitionName: "Чемпионат России 2024", period: "10 фев. – 16 фев. 2025", applicationType: "refusal", status: "under_review", decision: "approved" },
  { id: "8", name: DEMO_ATHLETE_NAMES[7], email: "sport3@test.ru", competitionName: "Гран-при России по автоспорту 2024", period: "10 фев. – 16 фев. 2025", applicationType: "refusal", status: "accepted", decision: "approved" },
  { id: "9", name: DEMO_ATHLETE_NAMES[8], email: "sport1@test.ru", competitionName: "Зимний чемпионат России 2024", period: "10 фев. – 16 фев. 2025", applicationType: "refusal", status: "rejected", decision: "rejected" },
];

function extendDemoApplications(base: ApplicationItem[], total: number): ApplicationItem[] {
  const result = [...base];
  const competitions = [
    { competitionName: "Чемпионат России 2024", period: "10 фев. – 16 фев. 2025" },
    { competitionName: "Гран-при России по автоспорту 2024", period: "10 фев. – 16 фев. 2025" },
    { competitionName: "Зимний чемпионат России 2024", period: "10 фев. – 16 фев. 2025" },
  ] as const;
  const statusesParticipation: ApplicationItem["status"][] = ["under_review", "documents_unsigned", "document_check", "errors_found", "accepted", "rejected"];
  const statusesRefusal: ApplicationItem["status"][] = ["under_review", "accepted", "rejected"];
  const types: ApplicationItem["applicationType"][] = ["participation", "refusal"];
  while (result.length < total) {
    const i = result.length;
    const comp = competitions[i % competitions.length];
    const applicationType = types[i % types.length];
    const statuses = applicationType === "refusal" ? statusesRefusal : statusesParticipation;
    const nameIndex = i % DEMO_ATHLETE_NAMES.length;
    const emailIndex = (i % 5) + 1;
    result.push({
      id: String(i + 1),
      name: DEMO_ATHLETE_NAMES[nameIndex],
      email: `sport${emailIndex}@test.ru`,
      competitionName: comp.competitionName,
      period: comp.period,
      applicationType,
      status: statuses[i % statuses.length],
      decision: i % 3 === 0 ? "pending" : i % 3 === 1 ? "approved" : "rejected",
    });
  }
  return result;
}

const DEMO_APPLICATIONS_80 = extendDemoApplications(DEMO_APPLICATIONS, 80);

/** Парсит период заявки "10 фев. – 16 фев. 2025" в { from, to } или null */
function parseApplicationPeriod(periodStr: string | undefined): { from: Date; to: Date } | null {
  if (!periodStr?.trim()) return null;
  const parts = periodStr.split(" – ").map((p) => p.trim());
  if (parts.length < 2) return null;
  const yearMatch = parts[1].match(/\d{4}/);
  const year = yearMatch ? yearMatch[0] : String(new Date().getFullYear());
  try {
    const fromStr = `${parts[0]} ${year}`;
    const from = parse(fromStr, "d MMM yyyy", new Date(), { locale: dateFnsRu });
    const to = parse(parts[1], "d MMM yyyy", new Date(), { locale: dateFnsRu });
    return { from: startOfDay(from), to: endOfDay(to) };
  } catch {
    return null;
  }
}

function filterByPeriod(
  items: ApplicationItem[],
  range: DateRange | undefined
): ApplicationItem[] {
  if (!range?.from) return items;
  const from = startOfDay(range.from);
  const to = range.to ? endOfDay(range.to) : endOfDay(range.from);
  return items.filter((item) => {
    const period = parseApplicationPeriod(item.period);
    if (!period) return false;
    return period.from <= to && period.to >= from;
  });
}

function filterBySearch(items: ApplicationItem[], query: string): ApplicationItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      (item.competitionName?.toLowerCase().includes(q) ?? false)
  );
}

function filterByFilterState(
  items: ApplicationItem[],
  state: ApplicationsFilterState
): ApplicationItem[] {
  let result = items;
  if (state.competitionIds.size > 0) {
    result = result.filter((item) => item.competitionName != null && state.competitionIds.has(item.competitionName));
  }
  if (state.applicationTypeIds.size > 0) {
    result = result.filter((item) => state.applicationTypeIds.has(item.applicationType));
  }
  if (state.statusIds.size > 0) {
    result = result.filter((item) => state.statusIds.has(item.status));
  }
  if (state.athleteIds.size > 0) {
    result = result.filter((item) => state.athleteIds.has(item.name));
  }
  return result;
}

/** Выборка для списка «Соревнование»: только по типу заявки, статусу и спортсмену (без фильтра по соревнованию) */
function dataForCompetitionFilter(
  items: ApplicationItem[],
  state: ApplicationsFilterState
): ApplicationItem[] {
  let result = items;
  if (state.applicationTypeIds.size > 0) {
    result = result.filter((item) => state.applicationTypeIds.has(item.applicationType));
  }
  if (state.statusIds.size > 0) {
    result = result.filter((item) => state.statusIds.has(item.status));
  }
  if (state.athleteIds.size > 0) {
    result = result.filter((item) => state.athleteIds.has(item.name));
  }
  return result;
}

/** Выборка для списка «Тип заявки»: только по соревнованию, статусу и спортсмену */
function dataForApplicationTypeFilter(
  items: ApplicationItem[],
  state: ApplicationsFilterState
): ApplicationItem[] {
  let result = items;
  if (state.competitionIds.size > 0) {
    result = result.filter((item) => item.competitionName != null && state.competitionIds.has(item.competitionName));
  }
  if (state.statusIds.size > 0) {
    result = result.filter((item) => state.statusIds.has(item.status));
  }
  if (state.athleteIds.size > 0) {
    result = result.filter((item) => state.athleteIds.has(item.name));
  }
  return result;
}

/** Выборка для списка «Статус»: только по соревнованию, типу заявки и спортсмену */
function dataForStatusFilter(
  items: ApplicationItem[],
  state: ApplicationsFilterState
): ApplicationItem[] {
  let result = items;
  if (state.competitionIds.size > 0) {
    result = result.filter((item) => item.competitionName != null && state.competitionIds.has(item.competitionName));
  }
  if (state.applicationTypeIds.size > 0) {
    result = result.filter((item) => state.applicationTypeIds.has(item.applicationType));
  }
  if (state.athleteIds.size > 0) {
    result = result.filter((item) => state.athleteIds.has(item.name));
  }
  return result;
}

/** Выборка для списка «Спортсмен»: только по соревнованию, типу заявки и статусу */
function dataForAthleteFilter(
  items: ApplicationItem[],
  state: ApplicationsFilterState
): ApplicationItem[] {
  let result = items;
  if (state.competitionIds.size > 0) {
    result = result.filter((item) => item.competitionName != null && state.competitionIds.has(item.competitionName));
  }
  if (state.applicationTypeIds.size > 0) {
    result = result.filter((item) => state.applicationTypeIds.has(item.applicationType));
  }
  if (state.statusIds.size > 0) {
    result = result.filter((item) => state.statusIds.has(item.status));
  }
  return result;
}

const initialFilterState: ApplicationsFilterState = {
  competitionIds: new Set(),
  applicationTypeIds: new Set(),
  statusIds: new Set(),
  athleteIds: new Set(),
};

export function ApplicationsPageContent() {
  const [periodRange, setPeriodRange] = useState<DateRange | undefined>(undefined);
  const [periodPopoverOpen, setPeriodPopoverOpen] = useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<ApplicationsFilterState>(initialFilterState);

  const filteredData = useMemo(() => {
    const byPeriod = filterByPeriod(DEMO_APPLICATIONS_80, periodRange);
    const bySearch = filterBySearch(byPeriod, searchQuery);
    return filterByFilterState(bySearch, filterState);
  }, [searchQuery, filterState, periodRange]);

  const dataAfterSearch = useMemo(
    () => filterBySearch(filterByPeriod(DEMO_APPLICATIONS_80, periodRange), searchQuery),
    [searchQuery, periodRange]
  );
  const dataForCompetition = useMemo(
    () => dataForCompetitionFilter(dataAfterSearch, filterState),
    [dataAfterSearch, filterState]
  );
  const dataForApplicationType = useMemo(
    () => dataForApplicationTypeFilter(dataAfterSearch, filterState),
    [dataAfterSearch, filterState]
  );
  const dataForStatus = useMemo(
    () => dataForStatusFilter(dataAfterSearch, filterState),
    [dataAfterSearch, filterState]
  );
  const dataForAthlete = useMemo(
    () => dataForAthleteFilter(dataAfterSearch, filterState),
    [dataAfterSearch, filterState]
  );

  const hasPeriodSelected = Boolean(periodRange?.from);
  const hasSearchQuery = searchQuery.length > 0;
  const hasActiveFilters =
    filterState.competitionIds.size > 0 ||
    filterState.applicationTypeIds.size > 0 ||
    filterState.statusIds.size > 0 ||
    filterState.athleteIds.size > 0;

  const clearAllFilters = () => {
    setPeriodRange(undefined);
    setSearchQuery("");
    setFilterState(initialFilterState);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-[var(--width-filter-search)] shrink-0">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" aria-hidden />
          <Input
            type="text"
            role="search"
            placeholder="Поиск"
            className="rounded-lg bg-card pl-9 pr-9"
            aria-label="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {hasSearchQuery && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Очистить поиск"
                >
                  <XIcon className="size-4" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Очистить поиск</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <Popover open={periodPopoverOpen} onOpenChange={setPeriodPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-[var(--width-filter-period)] shrink-0 cursor-pointer">
              <CalendarIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" aria-hidden />
              <Input
                type="text"
                placeholder="Выбрать период"
                className="rounded-lg bg-card pl-9 read-only:cursor-pointer pr-9"
                readOnly
                aria-label="Выбрать период"
                value={formatPeriodLabel(periodRange)}
              />
              {hasPeriodSelected && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPeriodRange(undefined);
                      }}
                      className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Сбросить период"
                    >
                      <XIcon className="size-4" aria-hidden />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Сбросить период</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={periodRange}
              onSelect={setPeriodRange}
              defaultMonth={periodRange?.from}
              locale={dayPickerRu}
              captionLayout="dropdown"
              formatters={{
                formatMonthDropdown: (date) =>
                  date.toLocaleString("ru", { month: "short" }),
                formatYearDropdown: (date) =>
                  date.getFullYear().toString(),
              }}
            />
          </PopoverContent>
        </Popover>
        <ApplicationsFilterPopover
          open={filterPopoverOpen}
          onOpenChange={setFilterPopoverOpen}
          filterState={filterState}
          onFilterChange={setFilterState}
          dataForCompetition={dataForCompetition}
          dataForApplicationType={dataForApplicationType}
          dataForStatus={dataForStatus}
          dataForAthlete={dataForAthlete}
          trigger={
            <Button
              type="button"
              variant="outline"
              className="shrink-0 rounded-lg bg-card"
              aria-label="Фильтр"
              aria-expanded={filterPopoverOpen}
            >
              <Funnel className="size-4" aria-hidden />
              Фильтр
              {hasActiveFilters && (
                <Badge variant="default" className="shrink-0">
                  {filterState.competitionIds.size +
                    filterState.applicationTypeIds.size +
                    filterState.statusIds.size +
                    filterState.athleteIds.size}
                </Badge>
              )}
            </Button>
          }
        />
      </div>
      <Card className="w-full py-0">
        <ApplicationsDatatable
          data={filteredData}
          showCompetition
          onClearFilters={clearAllFilters}
        />
      </Card>
    </div>
  );
}
