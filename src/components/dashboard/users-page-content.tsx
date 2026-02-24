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
import { UsersDatatable, type UserItem } from "@/components/dashboard/users-datatable";
import {
  UsersFilterPopover,
  type UsersFilterState,
} from "@/components/dashboard/users-filter-popover";

function formatPeriodLabel(range: DateRange | undefined): string {
  if (!range?.from) return "";
  const fromStr = format(range.from, "d MMM yyyy", { locale: dateFnsRu });
  if (!range.to || range.from.getTime() === range.to.getTime()) return fromStr;
  return `${fromStr} – ${format(range.to, "d MMM yyyy", { locale: dateFnsRu })}`;
}

// TODO: REMOVE BEFORE RELEASE — демо-данные, заменить на выборку из Supabase
const DEMO_NAMES = [
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

function buildDemoUsers(count: number): UserItem[] {
  const roles: UserItem["role"][] = ["judge", "manager", "athlete"];
  const emailPrefixes = ["sud", "manager", "sport"];
  return Array.from({ length: count }, (_, i) => {
    const roleIndex = i % 3;
    const role = roles[roleIndex];
    const emailIndex = Math.floor(i / 3) + 1;
    const loginDate = new Date(2026, 0, 1);
    return {
      id: String(i + 1),
      name: DEMO_NAMES[i % DEMO_NAMES.length],
      email: `${emailPrefixes[roleIndex]}${emailIndex}@test.ru`,
      role,
      phone: "+7 (968) 123-45-67",
      lastLogin: format(loginDate, "dd MMM. yyyy, HH:mm", { locale: dateFnsRu }),
      status: i % 7 === 0 ? "active" : "inactive",
    };
  });
}

const DEMO_USERS_80 = buildDemoUsers(80);

function filterByPeriod(items: UserItem[], range: DateRange | undefined): UserItem[] {
  if (!range?.from) return items;
  const from = startOfDay(range.from);
  const to = endOfDay(range.to ?? range.from);
  return items.filter((item) => {
    try {
      const date = parse(item.lastLogin, "dd MMM. yyyy, HH:mm", new Date(), { locale: dateFnsRu });
      return isWithinInterval(date, { start: from, end: to });
    } catch {
      return true;
    }
  });
}

const initialFilterState: UsersFilterState = {
  roleIds: new Set(),
  statusIds: new Set(),
};

export function UsersPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [periodRange, setPeriodRange] = useState<DateRange | undefined>(undefined);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<UsersFilterState>(initialFilterState);

  const dataAfterPeriod = useMemo(
    () => filterByPeriod(DEMO_USERS_80, periodRange),
    [periodRange]
  );

  const dataAfterSearch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return dataAfterPeriod;
    return dataAfterPeriod.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.includes(q)
    );
  }, [dataAfterPeriod, searchQuery]);

  const filteredData = useMemo(() => {
    return dataAfterSearch.filter((item) => {
      if (filterState.roleIds.size > 0 && !filterState.roleIds.has(item.role)) return false;
      if (filterState.statusIds.size > 0 && !filterState.statusIds.has(item.status)) return false;
      return true;
    });
  }, [dataAfterSearch, filterState]);

  // Для каждого фильтра — данные с применёнными всеми остальными фильтрами
  const dataForRoleFilter = useMemo(
    () =>
      dataAfterSearch.filter((item) => {
        if (filterState.statusIds.size > 0 && !filterState.statusIds.has(item.status)) return false;
        return true;
      }),
    [dataAfterSearch, filterState.statusIds]
  );

  const dataForStatusFilter = useMemo(
    () =>
      dataAfterSearch.filter((item) => {
        if (filterState.roleIds.size > 0 && !filterState.roleIds.has(item.role)) return false;
        return true;
      }),
    [dataAfterSearch, filterState.roleIds]
  );

  const hasActiveFilters =
    filterState.roleIds.size > 0 ||
    filterState.statusIds.size > 0;

  const filterBadgeCount = filterState.roleIds.size + filterState.statusIds.size;

  const hasPeriodSelected = Boolean(periodRange?.from);
  const hasSearchQuery = searchQuery.length > 0;

  const clearAllFilters = () => {
    setFilterState(initialFilterState);
    setSearchQuery("");
    setPeriodRange(undefined);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-[var(--width-filter-search)] shrink-0">
          <SearchIcon
            className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
            aria-hidden
          />
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
        <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-[var(--width-filter-period)] shrink-0 cursor-pointer">
              <CalendarIcon
                className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
                aria-hidden
              />
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
              selected={periodRange}
              onSelect={setPeriodRange}
              defaultMonth={periodRange?.from}
              locale={dayPickerRu}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <UsersFilterPopover
          open={filterOpen}
          onOpenChange={setFilterOpen}
          filterState={filterState}
          onFilterChange={setFilterState}
          dataForRole={dataForRoleFilter}
          dataForStatus={dataForStatusFilter}
          trigger={
            <Button
              type="button"
              variant="outline"
              className="shrink-0 rounded-lg bg-card"
              aria-label="Фильтр"
              aria-expanded={filterOpen}
            >
              <Funnel className="size-4" aria-hidden />
              Фильтр
              {filterBadgeCount > 0 && (
                <Badge variant="default" className="shrink-0">
                  {filterBadgeCount}
                </Badge>
              )}
            </Button>
          }
        />
      </div>
      <Card className="w-full py-0">
        <UsersDatatable
          data={filteredData}
          onClearFilters={hasActiveFilters || hasPeriodSelected || hasSearchQuery ? clearAllFilters : undefined}
        />
      </Card>
    </div>
  );
}
