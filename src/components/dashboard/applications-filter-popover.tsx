"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ClipboardListIcon,
  ClockIcon,
  TrophyIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ApplicationItem } from "@/components/dashboard/applications-datatable";
import { APPLICATION_STATUS_LABELS, APPLICATION_TYPE_LABELS } from "@/components/dashboard/applications-datatable";

export type ApplicationsFilterState = {
  competitionIds: Set<string>;
  applicationTypeIds: Set<ApplicationItem["applicationType"]>;
  statusIds: Set<ApplicationItem["status"]>;
  athleteIds: Set<string>;
};

type FilterView = "categories" | "competition" | "applicationType" | "status" | "athlete";

type ApplicationsFilterPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterState: ApplicationsFilterState;
  onFilterChange: (state: ApplicationsFilterState) => void;
  /** Данные для списка «Соревнование»: уже отфильтрованы по типу заявки, статусу и спортсмену */
  dataForCompetition: ApplicationItem[];
  /** Данные для списка «Тип заявки»: уже отфильтрованы по соревнованию, статусу и спортсмену */
  dataForApplicationType: ApplicationItem[];
  /** Данные для списка «Статус»: уже отфильтрованы по соревнованию, типу заявки и спортсмену */
  dataForStatus: ApplicationItem[];
  /** Данные для списка «Спортсмен»: уже отфильтрованы по соревнованию, типу заявки и статусу */
  dataForAthlete: ApplicationItem[];
  trigger: React.ReactNode;
};

function getUniqueCompetitions(data: ApplicationItem[]): { id: string; label: string }[] {
  const seen = new Set<string>();
  return data
    .filter((item) => item.competitionName != null)
    .map((item) => ({ id: item.competitionName!, label: item.competitionName! }))
    .filter(({ id }) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
}

function getApplicationTypeOptions(): { id: ApplicationItem["applicationType"]; label: string }[] {
  return (["participation", "refusal"] as const).map((id) => ({
    id,
    label: APPLICATION_TYPE_LABELS[id],
  }));
}

function getStatusOptions(): { id: ApplicationItem["status"]; label: string }[] {
  return (
    [
      "under_review",
      "documents_unsigned",
      "document_check",
      "errors_found",
      "accepted",
      "rejected",
    ] as const
  ).map((id) => ({
    id,
    label: APPLICATION_STATUS_LABELS[id],
  }));
}

function getCountForCompetition(data: ApplicationItem[], competitionName: string): number {
  return data.filter((item) => item.competitionName === competitionName).length;
}

function getUniqueAthletes(data: ApplicationItem[]): { id: string; label: string }[] {
  const seen = new Set<string>();
  return data
    .map((item) => ({ id: item.name, label: item.name }))
    .filter(({ id }) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
}

function getCountForAthlete(data: ApplicationItem[], name: string): number {
  return data.filter((item) => item.name === name).length;
}

export function ApplicationsFilterPopover({
  open,
  onOpenChange,
  filterState,
  onFilterChange,
  dataForCompetition,
  dataForApplicationType,
  dataForStatus,
  dataForAthlete,
  trigger,
}: ApplicationsFilterPopoverProps) {
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
  const athletes = useMemo(() => getUniqueAthletes(dataForAthlete), [dataForAthlete]);
  const applicationTypeOptions = useMemo(() => getApplicationTypeOptions(), []);
  const statusOptions = useMemo(() => getStatusOptions(), []);

  const toggleCompetition = (id: string) => {
    const next = new Set(filterState.competitionIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onFilterChange({ ...filterState, competitionIds: next });
  };

  const toggleApplicationType = (id: ApplicationItem["applicationType"]) => {
    const next = new Set(filterState.applicationTypeIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onFilterChange({ ...filterState, applicationTypeIds: next });
  };

  const toggleStatus = (id: ApplicationItem["status"]) => {
    const next = new Set(filterState.statusIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onFilterChange({ ...filterState, statusIds: next });
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
    {
      id: "competition" as const,
      label: "Соревнование",
      Icon: TrophyIcon,
      count: filterState.competitionIds.size,
    },
    {
      id: "applicationType" as const,
      label: "Тип заявки",
      Icon: ClipboardListIcon,
      count: filterState.applicationTypeIds.size,
    },
    {
      id: "status" as const,
      label: "Статус",
      Icon: ClockIcon,
      count: filterState.statusIds.size,
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

        {view === "competition" && (
          <div className="flex flex-col">
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
                  placeholder="Соревнование"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 min-w-0 border-0 border-transparent bg-transparent dark:bg-transparent pr-8 pl-0 shadow-none focus-visible:ring-0"
                  aria-label="Поиск соревнований"
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
            <div className="max-h-64 overflow-y-auto px-1 py-1">
              {(() => {
                const options = filterOptions(competitions, searchQuery);
                if (options.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                      <p className="text-muted-foreground text-sm">Нет данных</p>
                    </div>
                  );
                }
                return options.map(({ id, label }) => {
                  const selected = filterState.competitionIds.has(id);
                  const count = getCountForCompetition(dataForCompetition, id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleCompetition(id)}
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

        {view === "applicationType" && (
          <div className="flex flex-col">
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
                  placeholder="Тип заявки"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 min-w-0 border-0 border-transparent bg-transparent dark:bg-transparent pr-8 pl-0 shadow-none focus-visible:ring-0"
                  aria-label="Поиск по типу заявки"
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
            <div className="max-h-64 overflow-y-auto px-1 py-1">
              {(() => {
                const optionsWithCount = applicationTypeOptions
                  .map((opt) => ({ ...opt, count: dataForApplicationType.filter((item) => item.applicationType === opt.id).length }))
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
                  const selected = filterState.applicationTypeIds.has(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleApplicationType(id)}
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

        {view === "status" && (
          <div className="flex flex-col">
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
                  placeholder="Статус"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 min-w-0 border-0 border-transparent bg-transparent dark:bg-transparent pr-8 pl-0 shadow-none focus-visible:ring-0"
                  aria-label="Поиск статусов"
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
            <div className="max-h-64 overflow-y-auto px-1 py-1">
              {(() => {
                const optionsWithCount = statusOptions
                  .map((opt) => ({ ...opt, count: dataForStatus.filter((item) => item.status === opt.id).length }))
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

        {view === "athlete" && (
          <div className="flex flex-col">
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
                  placeholder="Спортсмен"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 min-w-0 border-0 border-transparent bg-transparent dark:bg-transparent pr-8 pl-0 shadow-none focus-visible:ring-0"
                  aria-label="Поиск спортсменов"
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
            <div className="max-h-64 overflow-y-auto px-1 py-1">
              {(() => {
                const options = filterOptions(athletes, searchQuery);
                if (options.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                      <p className="text-muted-foreground text-sm">Нет данных</p>
                    </div>
                  );
                }
                return options.map(({ id, label }) => {
                  const selected = filterState.athleteIds.has(id);
                  const count = getCountForAthlete(dataForAthlete, id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleAthlete(id)}
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
      </PopoverContent>
    </Popover>
  );
}
