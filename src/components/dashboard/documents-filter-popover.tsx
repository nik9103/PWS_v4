"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ClockIcon,
  DumbbellIcon,
  TrophyIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { DocumentItem } from "@/components/dashboard/documents-datatable";
import { STATUS_LABELS } from "@/components/dashboard/documents-datatable";

export type DocumentsFilterState = {
  statusIds: Set<DocumentItem["status"]>;
  competitionIds: Set<string>;
  disciplineIds: Set<string>;
  athleteIds: Set<string>;
};

type FilterView = "categories" | "status" | "competition" | "discipline" | "athlete";

type DocumentsFilterPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterState: DocumentsFilterState;
  onFilterChange: (state: DocumentsFilterState) => void;
  dataForStatus: DocumentItem[];
  dataForCompetition: DocumentItem[];
  dataForDiscipline: DocumentItem[];
  dataForAthlete: DocumentItem[];
  trigger: React.ReactNode;
};

function getUniqueCompetitions(data: DocumentItem[]): { id: string; label: string }[] {
  const seen = new Set<string>();
  return data
    .map((item) => ({ id: item.competitionName, label: item.competitionName }))
    .filter(({ id }) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
}

function getUniqueDisciplines(data: DocumentItem[]): { id: string; label: string }[] {
  const seen = new Set<string>();
  return data
    .map((item) => ({ id: item.disciplineName, label: item.disciplineName }))
    .filter(({ id }) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
}

function getStatusOptions(): { id: DocumentItem["status"]; label: string }[] {
  return (["signed", "unsigned"] as const).map((id) => ({
    id,
    label: STATUS_LABELS[id],
  }));
}

function getCountForCompetition(data: DocumentItem[], name: string): number {
  return data.filter((item) => item.competitionName === name).length;
}

function getCountForDiscipline(data: DocumentItem[], name: string): number {
  return data.filter((item) => item.disciplineName === name).length;
}

function getUniqueAthletes(data: DocumentItem[]): { id: string; label: string }[] {
  const seen = new Set<string>();
  return data
    .map((item) => ({ id: item.athleteName, label: item.athleteName }))
    .filter(({ id }) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
}

function getCountForAthlete(data: DocumentItem[], name: string): number {
  return data.filter((item) => item.athleteName === name).length;
}

export function DocumentsFilterPopover({
  open,
  onOpenChange,
  filterState,
  onFilterChange,
  dataForStatus,
  dataForCompetition,
  dataForDiscipline,
  dataForAthlete,
  trigger,
}: DocumentsFilterPopoverProps) {
  const [view, setView] = useState<FilterView>("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setView("categories");
      setSearchQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (view !== "categories" && open) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [view, open]);

  const competitions = useMemo(() => getUniqueCompetitions(dataForCompetition), [dataForCompetition]);
  const disciplines = useMemo(() => getUniqueDisciplines(dataForDiscipline), [dataForDiscipline]);
  const athletes = useMemo(() => getUniqueAthletes(dataForAthlete), [dataForAthlete]);
  const statusOptions = useMemo(() => getStatusOptions(), []);

  const toggleStatus = (id: DocumentItem["status"]) => {
    const next = new Set(filterState.statusIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onFilterChange({ ...filterState, statusIds: next });
  };

  const toggleCompetition = (id: string) => {
    const next = new Set(filterState.competitionIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onFilterChange({ ...filterState, competitionIds: next });
  };

  const toggleDiscipline = (id: string) => {
    const next = new Set(filterState.disciplineIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onFilterChange({ ...filterState, disciplineIds: next });
  };

  const toggleAthlete = (id: string) => {
    const next = new Set(filterState.athleteIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onFilterChange({ ...filterState, athleteIds: next });
  };

  const handleBack = () => {
    setView("categories");
    setSearchQuery("");
  };

  const categories = [
    { id: "status" as const, label: "Статус", Icon: ClockIcon, count: filterState.statusIds.size },
    {
      id: "competition" as const,
      label: "Соревнование",
      Icon: TrophyIcon,
      count: filterState.competitionIds.size,
    },
    {
      id: "discipline" as const,
      label: "Дисциплина",
      Icon: DumbbellIcon,
      count: filterState.disciplineIds.size,
    },
    {
      id: "athlete" as const,
      label: "Спортсмен",
      Icon: UserIcon,
      count: filterState.athleteIds.size,
    },
  ];

  const filterOptions = <T extends { id: string; label: string }>(
    options: T[],
    query: string
  ): T[] => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  };

  const renderList = <T extends { id: string; label: string }>(
    options: T[],
    searchQuery: string,
    getSelected: (id: string) => boolean,
    getCount: (id: string) => number,
    onToggle: (id: string) => void
  ) => {
    const filtered = filterOptions(options, searchQuery);
    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <p className="text-muted-foreground text-sm">Нет данных</p>
        </div>
      );
    }
    return filtered.map(({ id, label }) => {
      const selected = getSelected(id);
      const count = getCount(id);
      return (
        <button
          key={id}
          type="button"
          onClick={() => onToggle(id)}
          className={cn(
            "focus-visible:bg-accent focus-visible:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex h-9 w-full cursor-default select-none items-center gap-2 rounded-md px-2 py-0 text-left text-sm outline-hidden",
            selected && "bg-accent/50"
          )}
        >
          <span className="min-w-0 flex-1 truncate text-foreground">{label}</span>
          {selected ? (
            <CheckIcon className="text-foreground size-4 shrink-0" aria-hidden />
          ) : (
            <span className="text-muted-foreground shrink-0 text-sm">{count}</span>
          )}
        </button>
      );
    });
  };

  const subHeader = (placeholderLabel: string) => (
    <div className="flex h-11 items-center gap-2 border-b border-border px-3 py-2">
      <button
        type="button"
        onClick={handleBack}
        className="text-muted-foreground hover:text-foreground shrink-0 rounded p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Назад"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
      </button>
      <div className="relative flex min-w-0 flex-1 items-center">
        <Input
          ref={searchInputRef}
          type="text"
          placeholder={placeholderLabel}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 min-w-0 border-0 bg-transparent pr-8 pl-0 shadow-none focus-visible:ring-0"
          aria-label={`Поиск: ${placeholderLabel}`}
        />
        {searchQuery.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground absolute right-0 top-1/2 -translate-y-1/2 rounded-sm p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Очистить ввод"
              >
                <XIcon className="size-4" aria-hidden />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Очистить ввод</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-[var(--width-filter-search)] rounded-xl border border-border bg-card p-0 shadow-md"
        align="start"
      >
        {view === "categories" && (
          <div className="flex flex-col px-1 py-1">
            {categories.map(({ id, label, Icon, count }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                className="focus-visible:bg-accent focus-visible:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex h-9 w-full cursor-default select-none items-center gap-2 rounded-md px-2 py-0 text-left text-sm text-foreground outline-hidden"
              >
                <Icon className="text-muted-foreground size-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                {count > 0 && (
                  <Badge variant="default" className="shrink-0">
                    {count}
                  </Badge>
                )}
                <ChevronRightIcon className="text-muted-foreground size-4 shrink-0" aria-hidden />
              </button>
            ))}
          </div>
        )}

        {view === "status" && (
          <div className="flex flex-col">
            {subHeader("Статус")}
            <div className="max-h-64 overflow-y-auto px-1 py-1">
              {(() => {
                const optionsWithCount = statusOptions
                  .map((opt) => ({
                    ...opt,
                    count: dataForStatus.filter((item) => item.status === opt.id).length,
                  }))
                  .filter((opt) => opt.count > 0);
                const options = filterOptions(optionsWithCount, searchQuery);
                if (options.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                      <p className="text-muted-foreground text-sm">Нет данных</p>
                    </div>
                  );
                }
                return options.map(({ id, label, count }) => {
                  const selected = filterState.statusIds.has(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleStatus(id)}
                      className={cn(
                        "focus-visible:bg-accent focus-visible:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex h-9 w-full cursor-default select-none items-center gap-2 rounded-md px-2 py-0 text-left text-sm outline-hidden",
                        selected && "bg-accent/50"
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate text-foreground">{label}</span>
                      {selected ? (
                        <CheckIcon className="text-foreground size-4 shrink-0" aria-hidden />
                      ) : (
                        <span className="text-muted-foreground shrink-0 text-sm">{count}</span>
                      )}
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {view === "competition" && (
          <div className="flex flex-col">
            {subHeader("Соревнование")}
            <div className="max-h-64 overflow-y-auto px-1 py-1">
              {renderList(
                competitions,
                searchQuery,
                (id) => filterState.competitionIds.has(id),
                (id) => getCountForCompetition(dataForCompetition, id),
                toggleCompetition
              )}
            </div>
          </div>
        )}

        {view === "discipline" && (
          <div className="flex flex-col">
            {subHeader("Дисциплина")}
            <div className="max-h-64 overflow-y-auto px-1 py-1">
              {renderList(
                disciplines,
                searchQuery,
                (id) => filterState.disciplineIds.has(id),
                (id) => getCountForDiscipline(dataForDiscipline, id),
                toggleDiscipline
              )}
            </div>
          </div>
        )}

        {view === "athlete" && (
          <div className="flex flex-col">
            {subHeader("Спортсмен")}
            <div className="max-h-64 overflow-y-auto px-1 py-1">
              {renderList(
                athletes,
                searchQuery,
                (id) => filterState.athleteIds.has(id),
                (id) => getCountForAthlete(dataForAthlete, id),
                toggleAthlete
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
