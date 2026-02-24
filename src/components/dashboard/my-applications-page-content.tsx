"use client";

import { useMemo, useState } from "react";
import type { CompetitionStatusVariant } from "@/components/dashboard/competition-status-block";
import { CompetitionCard } from "@/components/dashboard/competition-card";
import type { CompetitionItem } from "@/components/dashboard/competitions-datatable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserProfile } from "@/hooks/use-user-profile";

// Варианты статусов для страницы «Мои заявки»
const APPLICATION_VARIANTS: CompetitionStatusVariant[] = [
  "under_review",
  "rejected",
  "sign_documents",
  "document_errors",
  "admitted",
];

// TODO: REMOVE BEFORE RELEASE — демо-данные, заменить на выборку из Supabase (мои заявки)
const DEMO_MY_APPLICATIONS: CompetitionItem[] = [
  {
    id: "1",
    competitionName: "Чемпионат России по шахматам 2026",
    sportName: "Шахматы",
    participants: 64,
    period: "20 фев. 2026",
    startTime: "Начало в 10:00",
    status: "planned",
    periodStartDate: "2026-02-20",
    periodEndDate: "2026-02-20",
    statusBlock: { variant: "under_review" },
  },
  {
    id: "2",
    competitionName: "Чемпионат России по шахматам 2026",
    sportName: "Шахматы",
    participants: 64,
    period: "20 фев. 2026",
    startTime: "Начало в 10:00",
    status: "planned",
    periodStartDate: "2026-02-20",
    periodEndDate: "2026-02-20",
    statusBlock: { variant: "rejected", payload: { rejectReason: "Без указания причин" } },
  },
  {
    id: "3",
    competitionName: "Чемпионат России по шахматам 2026",
    sportName: "Шахматы",
    participants: 64,
    period: "20 фев. 2026",
    startTime: "Начало в 10:00",
    status: "planned",
    periodStartDate: "2026-02-20",
    periodEndDate: "2026-02-20",
    statusBlock: { variant: "sign_documents" },
  },
  {
    id: "4",
    competitionName: "Чемпионат России по шахматам 2026",
    sportName: "Шахматы",
    participants: 64,
    period: "20 фев. 2026",
    startTime: "Начало в 10:00",
    status: "planned",
    periodStartDate: "2026-02-20",
    periodEndDate: "2026-02-20",
    statusBlock: { variant: "document_errors" },
  },
  {
    id: "5",
    competitionName: "Чемпионат России по шахматам 2026",
    sportName: "Шахматы",
    participants: 64,
    period: "20 фев. 2026",
    startTime: "Начало в 10:00",
    status: "planned",
    periodStartDate: "2026-02-20",
    periodEndDate: "2026-02-20",
    statusBlock: { variant: "admitted" },
  },
];

type FilterValue = "all" | CompetitionStatusVariant;
type SortValue = "nearest" | "late";

const FILTER_LABELS: Record<FilterValue, string> = {
  all: "Все заявки",
  under_review: "На рассмотрении",
  rejected: "Отклонённые",
  sign_documents: "Требуется подпись",
  document_errors: "Ошибки в документах",
  admitted: "Допущен",
};

function filterApplications(
  items: CompetitionItem[],
  filter: FilterValue
): CompetitionItem[] {
  if (filter === "all") return items;
  return items.filter((item) => item.statusBlock?.variant === filter);
}

function sortApplications(
  items: CompetitionItem[],
  sort: SortValue
): CompetitionItem[] {
  const copy = [...items];
  copy.sort((a, b) => {
    const dateA = new Date(a.periodStartDate).getTime();
    const dateB = new Date(b.periodStartDate).getTime();
    return sort === "nearest" ? dateA - dateB : dateB - dateA;
  });
  return copy;
}

export function MyApplicationsPageContent() {
  const { role, loading } = useUserProfile();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sort, setSort] = useState<SortValue>("nearest");

  const items = useMemo(() => {
    const filtered = filterApplications(DEMO_MY_APPLICATIONS, filter);
    return sortApplications(filtered, sort);
  }, [filter, sort]);

  const handleCorrectClick = (id: string) => {
    // TODO: открыть страницу/модалку исправления документов по заявке id
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-muted-foreground text-sm">Загрузка…</p>
      </div>
    );
  }

  if (role !== "athlete") {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-foreground text-2xl font-semibold">Мои заявки</h1>
        <p className="text-muted-foreground text-sm">
          Раздел доступен только для роли «Спортсмен».
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
          <SelectTrigger className="w-[11.25rem] rounded-lg bg-card">
            <SelectValue placeholder="Все заявки" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{FILTER_LABELS.all}</SelectItem>
            {APPLICATION_VARIANTS.map((v) => (
              <SelectItem key={v} value={v}>
                {FILTER_LABELS[v]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortValue)}>
          <SelectTrigger className="w-fit rounded-lg bg-card">
            <SelectValue placeholder="По дате" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nearest">Сначала ближайшие события</SelectItem>
            <SelectItem value="late">Сначала поздние события</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Нет заявок по выбранному фильтру
          </p>
        ) : (
          items.map((item) => (
            <CompetitionCard
              key={item.id}
              item={item}
              applicationHref={
                item.statusBlock?.variant === "sign_documents"
                  ? `/competitions/${item.id}`
                  : undefined
              }
              onCorrectClick={
                item.statusBlock?.variant === "document_errors"
                  ? () => handleCorrectClick(item.id)
                  : undefined
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
