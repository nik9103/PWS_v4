"use client";

import { useMemo, useState } from "react";
import { CompetitionCard } from "@/components/dashboard/competition-card";
import type { CompetitionItem } from "@/components/dashboard/competitions-datatable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/hooks/use-user-profile";

// TODO: REMOVE BEFORE RELEASE — демо-данные, заменить на выборку из Supabase (мои заявки/участия)
const DEMO_MY_COMPETITIONS: CompetitionItem[] = [
  {
    id: "1",
    competitionName: "Чемпионат России по шахматам 2026",
    sportName: "Шахматы",
    participants: 64,
    period: "20 фев. 2026",
    startTime: "Начало в 10:00",
    status: "ongoing",
    periodStartDate: "2026-02-20",
    periodEndDate: "2026-02-20",
    statusBlock: { variant: "in_progress" },
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
    statusBlock: { variant: "scheduled" },
  },
  {
    id: "3",
    competitionName: "Чемпионат России по шахматам 2026",
    sportName: "Шахматы",
    participants: 64,
    period: "20 фев. 2026",
    startTime: "Начало в 10:00",
    status: "completed",
    periodStartDate: "2026-02-20",
    periodEndDate: "2026-02-20",
    statusBlock: { variant: "completed" },
  },
];

type TabValue = "all" | "planned" | "ongoing" | "completed";

function filterByTab(items: CompetitionItem[], tab: TabValue): CompetitionItem[] {
  if (tab === "all") return items;
  return items.filter((item) => item.status === tab);
}

function MyCompetitionsList({ tab }: { tab: TabValue }) {
  const items = useMemo(
    () => filterByTab(DEMO_MY_COMPETITIONS, tab),
    [tab]
  );
  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Нет соревнований по выбранному фильтру
        </p>
      ) : (
        items.map((item) => <CompetitionCard key={item.id} item={item} />)
      )}
    </div>
  );
}

export function MyCompetitionsPageContent() {
  const { role, loading } = useUserProfile();
  const [activeTab, setActiveTab] = useState<TabValue>("all");

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
        <h1 className="text-foreground text-2xl font-semibold">Мои соревнования</h1>
        <p className="text-muted-foreground text-sm">
          Раздел доступен только для роли «Спортсмен».
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabValue)}
        className="w-full"
      >
        <TabsList variant="default" className="w-fit rounded-lg bg-muted p-1">
          <TabsTrigger value="all" className="rounded-md px-4">
            Все
          </TabsTrigger>
          <TabsTrigger value="planned" className="rounded-md px-4">
            Запланирован
          </TabsTrigger>
          <TabsTrigger value="ongoing" className="rounded-md px-4">
            Активный
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-md px-4">
            Завершён
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <MyCompetitionsList tab="all" />
        </TabsContent>
        <TabsContent value="planned" className="mt-6">
          <MyCompetitionsList tab="planned" />
        </TabsContent>
        <TabsContent value="ongoing" className="mt-6">
          <MyCompetitionsList tab="ongoing" />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <MyCompetitionsList tab="completed" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
