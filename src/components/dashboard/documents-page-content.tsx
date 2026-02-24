"use client";

import { useMemo, useState } from "react";
import { format, parse, startOfDay, endOfDay, isWithinInterval } from "date-fns";
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
import { DocumentsDatatable, type DocumentItem } from "@/components/dashboard/documents-datatable";
import {
  DocumentsFilterPopover,
  type DocumentsFilterState,
} from "@/components/dashboard/documents-filter-popover";

function formatPeriodLabel(range: DateRange | undefined): string {
  if (!range?.from) return "";
  const fromStr = format(range.from, "d MMM yyyy", { locale: dateFnsRu });
  if (!range.to || range.from.getTime() === range.to.getTime()) return fromStr;
  return `${fromStr} – ${format(range.to, "d MMM yyyy", { locale: dateFnsRu })}`;
}

const DOC_TYPES = ["Договор", "Страховка", "Соглашение"] as const;
const TITLES = [
  "Антидопинговая декларация",
  "Соглашение об участии в соревновании",
  "Этическая декларация",
] as const;
const COMPETITIONS = [
  "Чемпионат по волейболу России 2024",
  "Турнир по баскетболу России 2024",
  "Кубок России по гимнастике 2024",
] as const;
const DISCIPLINES = ["Волейбол", "Баскетбол", "Гимнастика"] as const;

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

// TODO: REMOVE BEFORE RELEASE — демо-данные, заменить на выборку из Supabase
function buildDemoDocuments(count: number): DocumentItem[] {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(2025, 0, 15 + (i % 30));
    const isSigned = i % 3 !== 1;
    const nameIndex = i % DEMO_ATHLETE_NAMES.length;
    const emailIndex = i % 5;
    return {
      id: String(i + 1),
      title: TITLES[i % TITLES.length],
      documentType: DOC_TYPES[i % DOC_TYPES.length],
      date: format(date, "d MMM yyyy", { locale: dateFnsRu }),
      fileSize: "1.20 МБ",
      status: isSigned ? "signed" : "unsigned",
      athleteName: DEMO_ATHLETE_NAMES[nameIndex],
      athleteEmail: `sport${emailIndex + 1}@test.ru`,
      competitionName: COMPETITIONS[i % COMPETITIONS.length],
      disciplineName: DISCIPLINES[i % DISCIPLINES.length],
    };
  });
}

const DEMO_DOCUMENTS = buildDemoDocuments(80);

function filterByPeriod(
  items: DocumentItem[],
  range: DateRange | undefined
): DocumentItem[] {
  if (!range?.from) return items;
  const from = startOfDay(range.from);
  const to = range.to ? endOfDay(range.to) : endOfDay(range.from);
  return items.filter((item) => {
    try {
      const itemDate = parse(item.date, "d MMM yyyy", new Date(), { locale: dateFnsRu });
      return isWithinInterval(itemDate, { start: from, end: to });
    } catch {
      return false;
    }
  });
}

function filterBySearch(items: DocumentItem[], query: string): DocumentItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.athleteName.toLowerCase().includes(q) ||
      item.athleteEmail.toLowerCase().includes(q) ||
      item.competitionName.toLowerCase().includes(q) ||
      item.disciplineName.toLowerCase().includes(q)
  );
}

function filterByFilterState(
  items: DocumentItem[],
  state: DocumentsFilterState
): DocumentItem[] {
  let result = items;
  if (state.statusIds.size > 0) {
    result = result.filter((item) => state.statusIds.has(item.status));
  }
  if (state.competitionIds.size > 0) {
    result = result.filter((item) => state.competitionIds.has(item.competitionName));
  }
  if (state.disciplineIds.size > 0) {
    result = result.filter((item) => state.disciplineIds.has(item.disciplineName));
  }
  if (state.athleteIds.size > 0) {
    result = result.filter((item) => state.athleteIds.has(item.athleteName));
  }
  return result;
}

function dataForStatusFilter(
  items: DocumentItem[],
  state: DocumentsFilterState
): DocumentItem[] {
  let result = items;
  if (state.competitionIds.size > 0) {
    result = result.filter((item) => state.competitionIds.has(item.competitionName));
  }
  if (state.disciplineIds.size > 0) {
    result = result.filter((item) => state.disciplineIds.has(item.disciplineName));
  }
  if (state.athleteIds.size > 0) {
    result = result.filter((item) => state.athleteIds.has(item.athleteName));
  }
  return result;
}

function dataForCompetitionFilter(
  items: DocumentItem[],
  state: DocumentsFilterState
): DocumentItem[] {
  let result = items;
  if (state.statusIds.size > 0) {
    result = result.filter((item) => state.statusIds.has(item.status));
  }
  if (state.disciplineIds.size > 0) {
    result = result.filter((item) => state.disciplineIds.has(item.disciplineName));
  }
  if (state.athleteIds.size > 0) {
    result = result.filter((item) => state.athleteIds.has(item.athleteName));
  }
  return result;
}

function dataForDisciplineFilter(
  items: DocumentItem[],
  state: DocumentsFilterState
): DocumentItem[] {
  let result = items;
  if (state.statusIds.size > 0) {
    result = result.filter((item) => state.statusIds.has(item.status));
  }
  if (state.competitionIds.size > 0) {
    result = result.filter((item) => state.competitionIds.has(item.competitionName));
  }
  if (state.athleteIds.size > 0) {
    result = result.filter((item) => state.athleteIds.has(item.athleteName));
  }
  return result;
}

function dataForAthleteFilter(
  items: DocumentItem[],
  state: DocumentsFilterState
): DocumentItem[] {
  let result = items;
  if (state.statusIds.size > 0) {
    result = result.filter((item) => state.statusIds.has(item.status));
  }
  if (state.competitionIds.size > 0) {
    result = result.filter((item) => state.competitionIds.has(item.competitionName));
  }
  if (state.disciplineIds.size > 0) {
    result = result.filter((item) => state.disciplineIds.has(item.disciplineName));
  }
  return result;
}

const initialFilterState: DocumentsFilterState = {
  statusIds: new Set(),
  competitionIds: new Set(),
  disciplineIds: new Set(),
  athleteIds: new Set(),
};

export function DocumentsPageContent() {
  const [periodRange, setPeriodRange] = useState<DateRange | undefined>(undefined);
  const [periodPopoverOpen, setPeriodPopoverOpen] = useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<DocumentsFilterState>(initialFilterState);

  const filteredData = useMemo(() => {
    const byPeriod = filterByPeriod(DEMO_DOCUMENTS, periodRange);
    const bySearch = filterBySearch(byPeriod, searchQuery);
    return filterByFilterState(bySearch, filterState);
  }, [searchQuery, filterState, periodRange]);

  const dataAfterSearch = useMemo(
    () => filterBySearch(filterByPeriod(DEMO_DOCUMENTS, periodRange), searchQuery),
    [searchQuery, periodRange]
  );
  const dataForStatus = useMemo(
    () => dataForStatusFilter(dataAfterSearch, filterState),
    [dataAfterSearch, filterState]
  );
  const dataForCompetition = useMemo(
    () => dataForCompetitionFilter(dataAfterSearch, filterState),
    [dataAfterSearch, filterState]
  );
  const dataForDiscipline = useMemo(
    () => dataForDisciplineFilter(dataAfterSearch, filterState),
    [dataAfterSearch, filterState]
  );
  const dataForAthlete = useMemo(
    () => dataForAthleteFilter(dataAfterSearch, filterState),
    [dataAfterSearch, filterState]
  );

  const hasPeriodSelected = Boolean(periodRange?.from);
  const hasSearchQuery = searchQuery.length > 0;
  const hasActiveFilters =
    filterState.statusIds.size > 0 ||
    filterState.competitionIds.size > 0 ||
    filterState.disciplineIds.size > 0 ||
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
        <DocumentsFilterPopover
          open={filterPopoverOpen}
          onOpenChange={setFilterPopoverOpen}
          filterState={filterState}
          onFilterChange={setFilterState}
          dataForStatus={dataForStatus}
          dataForCompetition={dataForCompetition}
          dataForDiscipline={dataForDiscipline}
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
                  {filterState.statusIds.size +
                    filterState.competitionIds.size +
                    filterState.disciplineIds.size +
                    filterState.athleteIds.size}
                </Badge>
              )}
            </Button>
          }
        />
      </div>
      <Card className="w-full py-0">
        <DocumentsDatatable data={filteredData} onClearFilters={clearAllFilters} />
      </Card>
    </div>
  );
}
