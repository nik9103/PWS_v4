"use client";

import { useMemo, useState } from "react";
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";
import { ru as dateFnsRu } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { ru as dayPickerRu } from "react-day-picker/locale";
import { CalendarIcon, ChevronDownIcon, Funnel, SearchIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CompetitionCard } from "@/components/dashboard/competition-card";
import CompetitionsDatatable, { type CompetitionItem } from "@/components/dashboard/competitions-datatable";
import {
  CompetitionsFilterPopover,
  type CompetitionsFilterState,
} from "@/components/dashboard/competitions-filter-popover";
import { useCompetitionModal } from "@/contexts/competition-modal-context";
import { useUserProfile } from "@/hooks/use-user-profile";

function formatPeriodLabel(range: DateRange | undefined): string {
  if (!range?.from) return "";
  const fromStr = format(range.from, "d MMM yyyy", { locale: dateFnsRu });
  if (!range.to || range.from.getTime() === range.to.getTime()) return fromStr;
  return `${fromStr} – ${format(range.to, "d MMM yyyy", { locale: dateFnsRu })}`;
}

// TODO: REMOVE BEFORE RELEASE — демо-данные, заменить на выборку из Supabase
const DEMO_COMPETITIONS: CompetitionItem[] = [
  {
    id: "1",
    competitionName: "Международный турнир по фехтованию",
    sportName: "Фехтование",
    participants: 20,
    period: "12 фев. 2026",
    startTime: "Начало в 18:00",
    status: "ongoing",
    periodStartDate: "2026-02-12",
    periodEndDate: "2026-02-12",
  },
  {
    id: "2",
    competitionName: "Чемпионат Европы по волейболу 2026",
    sportName: "Волейбол",
    participants: 10,
    period: "12 фев. 2026 – 21 мар. 2026",
    startTime: "Начало в 18:00",
    status: "planned",
    periodStartDate: "2026-02-12",
    periodEndDate: "2026-03-21",
  },
  {
    id: "3",
    competitionName: "Кубок мира по гимнастике 2026",
    sportName: "Гимнастика",
    participants: 2,
    period: "28 дек. 2026 – 3 янв. 2027",
    startTime: "Начало в 18:00",
    status: "completed",
    periodStartDate: "2026-12-28",
    periodEndDate: "2027-01-03",
  },
  {
    id: "4",
    competitionName: "Кубок мира по гимнастике 2026",
    sportName: "Настольный теннис",
    participants: 3,
    period: "28 дек. 2026 – 3 янв. 2027",
    startTime: "Начало в 18:00",
    status: "completed",
    periodStartDate: "2026-12-28",
    periodEndDate: "2027-01-03",
  },
  {
    id: "5",
    competitionName: "Кубок мира по гимнастике 2026",
    sportName: "Хоккей",
    participants: 23,
    period: "28 дек. 2026 – 3 янв. 2027",
    startTime: "Начало в 18:00",
    status: "completed",
    periodStartDate: "2026-12-28",
    periodEndDate: "2027-01-03",
  },
  {
    id: "6",
    competitionName: "Кубок мира по гимнастике 2026",
    sportName: "Гимнастика",
    participants: 28,
    period: "28 дек. 2026 – 3 янв. 2027",
    startTime: "Начало в 18:00",
    status: "completed",
    periodStartDate: "2026-12-28",
    periodEndDate: "2027-01-03",
  },
  {
    id: "7",
    competitionName: "Турнир по бадминтону «Старт через 2 дня»",
    sportName: "Бадминтон",
    participants: 50,
    period: "26 фев. 2026",
    startTime: "Начало в 10:00",
    status: "planned",
    periodStartDate: "2026-02-26",
    periodEndDate: "2026-02-26",
    statusBlock: { variant: "days_until_start", payload: { daysCount: 2 } },
  },
  {
    id: "8",
    competitionName: "Открытый чемпионат по плаванию",
    sportName: "Плавание",
    participants: 2,
    period: "1 мар. 2026",
    startTime: "Начало в 09:00",
    status: "planned",
    periodStartDate: "2026-03-01",
    periodEndDate: "2026-03-01",
    statusBlock: { variant: "places_left", payload: { placesCount: 2 } },
  },
  {
    id: "9",
    competitionName: "Кубок по настольному теннису",
    sportName: "Настольный теннис",
    participants: 2,
    period: "5 мар. 2026",
    startTime: "Начало в 14:00",
    status: "planned",
    periodStartDate: "2026-03-05",
    periodEndDate: "2026-03-05",
    statusBlock: {
      variant: "places_and_days",
      payload: { placesCount: 2, daysCount: 2 },
    },
  },
];

function filterByPeriodRange(
  items: CompetitionItem[],
  range: DateRange | undefined
): CompetitionItem[] {
  if (!range?.from) return items;
  const fromTime = startOfDay(range.from).getTime();
  const toTime = range.to ? startOfDay(range.to).getTime() : fromTime;
  return items.filter((item) => {
    const itemStart = new Date(item.periodStartDate).getTime();
    const itemEnd = new Date(item.periodEndDate).getTime();
    return itemEnd >= fromTime && itemStart <= toTime;
  });
}

function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

function filterBySearch(
  items: CompetitionItem[],
  query: string
): CompetitionItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.competitionName.toLowerCase().includes(q) ||
      item.sportName.toLowerCase().includes(q)
  );
}

function filterByFilterState(
  items: CompetitionItem[],
  state: CompetitionsFilterState
): CompetitionItem[] {
  let result = items;
  if (state.competitionIds.size > 0) {
    result = result.filter((item) => state.competitionIds.has(item.competitionName));
  }
  if (state.disciplineIds.size > 0) {
    result = result.filter((item) => state.disciplineIds.has(item.sportName));
  }
  if (state.statusIds.size > 0) {
    result = result.filter((item) => state.statusIds.has(item.status));
  }
  return result;
}

type NearestVariant = "all" | "week" | "month";

function filterByNearest(
  items: CompetitionItem[],
  variant: NearestVariant
): CompetitionItem[] {
  if (variant === "all") return items;
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  return items.filter((item) => {
    const start = new Date(item.periodStartDate).getTime();
    const end = new Date(item.periodEndDate).getTime();
    if (variant === "week") {
      return end >= weekStart.getTime() && start <= weekEnd.getTime();
    }
    return end >= monthStart.getTime() && start <= monthEnd.getTime();
  });
}

/** Выборка для списка «Соревнование»: только по дисциплине и статусу */
function dataForCompetitionFilter(
  items: CompetitionItem[],
  state: CompetitionsFilterState
): CompetitionItem[] {
  let result = items;
  if (state.disciplineIds.size > 0) {
    result = result.filter((item) => state.disciplineIds.has(item.sportName));
  }
  if (state.statusIds.size > 0) {
    result = result.filter((item) => state.statusIds.has(item.status));
  }
  return result;
}

/** Выборка для списка «Дисциплина»: только по соревнованию и статусу */
function dataForDisciplineFilter(
  items: CompetitionItem[],
  state: CompetitionsFilterState
): CompetitionItem[] {
  let result = items;
  if (state.competitionIds.size > 0) {
    result = result.filter((item) => state.competitionIds.has(item.competitionName));
  }
  if (state.statusIds.size > 0) {
    result = result.filter((item) => state.statusIds.has(item.status));
  }
  return result;
}

/** Выборка для списка «Статус»: только по соревнованию и дисциплине */
function dataForStatusFilter(
  items: CompetitionItem[],
  state: CompetitionsFilterState
): CompetitionItem[] {
  let result = items;
  if (state.competitionIds.size > 0) {
    result = result.filter((item) => state.competitionIds.has(item.competitionName));
  }
  if (state.disciplineIds.size > 0) {
    result = result.filter((item) => state.disciplineIds.has(item.sportName));
  }
  return result;
}

const initialFilterState: CompetitionsFilterState = {
  competitionIds: new Set(),
  disciplineIds: new Set(),
  statusIds: new Set(),
};

export function CompetitionsPageContent() {
  const { role, loading } = useUserProfile();
  const competitionModal = useCompetitionModal();
  const [competitions, setCompetitions] = useState<CompetitionItem[]>(DEMO_COMPETITIONS);
  const [periodRange, setPeriodRange] = useState<DateRange | undefined>(undefined);
  const [periodPopoverOpen, setPeriodPopoverOpen] = useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [nearestVariant, setNearestVariant] = useState<NearestVariant>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<CompetitionsFilterState>(initialFilterState);

  const isAthlete = role === "athlete";

  const filteredData = useMemo(() => {
    let result = filterByPeriodRange(competitions, periodRange);
    result = filterBySearch(result, searchQuery);
    result = filterByFilterState(result, filterState);
    if (role === "athlete") {
      result = filterByNearest(result, nearestVariant);
    }
    return result;
  }, [competitions, periodRange, searchQuery, filterState, role, nearestVariant]);

  const dataAfterSearch = useMemo(() => {
    const byPeriod = filterByPeriodRange(competitions, periodRange);
    return filterBySearch(byPeriod, searchQuery);
  }, [competitions, periodRange, searchQuery]);
  const dataForCompetition = useMemo(
    () => dataForCompetitionFilter(dataAfterSearch, filterState),
    [dataAfterSearch, filterState]
  );
  const dataForDiscipline = useMemo(
    () => dataForDisciplineFilter(dataAfterSearch, filterState),
    [dataAfterSearch, filterState]
  );
  const dataForStatus = useMemo(
    () => dataForStatusFilter(dataAfterSearch, filterState),
    [dataAfterSearch, filterState]
  );

  const handleStatusChange = (id: string, status: CompetitionItem["status"]) => {
    setCompetitions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const hasPeriodSelected = Boolean(periodRange?.from);
  const hasSearchQuery = searchQuery.length > 0;

  const clearAllFilters = () => {
    setPeriodRange(undefined);
    setSearchQuery("");
    setFilterState(initialFilterState);
    setNearestVariant("all");
  };

  const periodTrigger = (
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
  );

  const filterTrigger = (
    <Button
      type="button"
      variant="outline"
      className="shrink-0 rounded-lg bg-card gap-2"
      aria-label="Фильтр"
      aria-expanded={filterPopoverOpen}
    >
      <Funnel className="size-4 shrink-0" aria-hidden />
      Фильтр
      {filterState.competitionIds.size +
        filterState.disciplineIds.size +
        filterState.statusIds.size >
        0 && (
        <Badge variant="default" className="shrink-0">
          {filterState.competitionIds.size +
            filterState.disciplineIds.size +
            filterState.statusIds.size}
        </Badge>
      )}
    </Button>
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-muted-foreground text-sm">Загрузка…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {isAthlete ? (
          <>
            <Popover open={periodPopoverOpen} onOpenChange={setPeriodPopoverOpen}>
              <PopoverTrigger asChild>{periodTrigger}</PopoverTrigger>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 rounded-lg bg-card gap-2"
                  aria-label="Ближайшие"
                >
                  Ближайшие
                  <ChevronDownIcon className="size-4 shrink-0 opacity-60" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[10rem]">
                <DropdownMenuItem
                  onClick={() => setNearestVariant("all")}
                >
                  Ближайшие
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setNearestVariant("week")}
                >
                  На этой неделе
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setNearestVariant("month")}
                >
                  В этом месяце
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CompetitionsFilterPopover
              open={filterPopoverOpen}
              onOpenChange={setFilterPopoverOpen}
              filterState={filterState}
              onFilterChange={setFilterState}
              dataForCompetition={dataForCompetition}
              dataForDiscipline={dataForDiscipline}
              dataForStatus={dataForStatus}
              trigger={filterTrigger}
            />
          </>
        ) : (
          <>
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
              <PopoverTrigger asChild>{periodTrigger}</PopoverTrigger>
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
            <CompetitionsFilterPopover
              open={filterPopoverOpen}
              onOpenChange={setFilterPopoverOpen}
              filterState={filterState}
              onFilterChange={setFilterState}
              dataForCompetition={dataForCompetition}
              dataForDiscipline={dataForDiscipline}
              dataForStatus={dataForStatus}
              trigger={filterTrigger}
            />
          </>
        )}
      </div>

      {isAthlete ? (
        <div className="flex flex-col gap-4">
          {filteredData.length === 0 ? (
            <p className="text-muted-foreground text-sm">Нет соревнований по выбранным условиям</p>
          ) : (
            filteredData.map((item) => (
              <CompetitionCard key={item.id} item={item} />
            ))
          )}
        </div>
      ) : (
        <Card className="w-full py-0">
          <CompetitionsDatatable
            data={filteredData}
            onClearFilters={clearAllFilters}
            onStatusChange={handleStatusChange}
            onEdit={competitionModal.openEdit}
          />
        </Card>
      )}
    </div>
  );
}
