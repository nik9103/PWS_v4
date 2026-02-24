"use client";

import {
  Calendar,
  Footprints,
  Home,
  HousePlus,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CompetitionParticipantsTable } from "@/components/dashboard/competition-participants-table";

type Props = {
  competitionId: string;
  competitionName?: string;
  status?: string;
};

export function CompetitionCardPageContent(_props: Props) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-6 sm:flex-row w-full">
        {/* Карточка с датой, организатором и местом */}
      <Card className="flex-1 rounded-xl shadow-sm min-w-0 py-0">
        <CardContent className="p-0">
          {/* Верхняя секция: дата + разделитель + организатор */}
          <div className="flex flex-col sm:flex-row">
            {/* Дата проведения */}
            <div className="flex flex-col gap-2 p-6 w-full">
              <div className="flex flex-row gap-2 items-center">
                <Calendar className="text-primary size-5 shrink-0" aria-hidden />
                <p className="text-muted-foreground text-sm font-medium">
                  Дата проведения
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-card-foreground text-xl font-medium">
                  28 дек. 2026 – 3 янв. 2027
                </h3>
                <p className="text-muted-foreground text-sm">
                  Начало в 10:00
                </p>
              </div>
            </div>

            {/* Вертикальный разделитель */}
            <div className="hidden sm:block w-px bg-border shrink-0" />

            {/* Организатор и соорганизатор */}
            <div className="flex flex-col gap-4 p-6 w-full">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <Home className="text-primary size-5 shrink-0" aria-hidden />
                  <p className="text-muted-foreground text-sm font-medium">
                    Организатор
                  </p>
                </div>
                <p className="text-card-foreground text-sm font-medium">
                  Федерация легкой атлетики России
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <HousePlus className="text-primary size-5 shrink-0" aria-hidden />
                  <p className="text-muted-foreground text-sm font-medium">
                    Соорганизатор
                  </p>
                </div>
                <p className="text-card-foreground text-sm font-medium">
                  ООО "Вилпилком Спорт "
                </p>
              </div>
            </div>
          </div>

          {/* Горизонтальный разделитель */}
          <div className="border-t border-border" />

          {/* Место проведения */}
          <div className="flex flex-col gap-2 p-6">
            <div className="flex flex-row gap-2 items-center">
              <MapPin className="text-primary size-5 shrink-0" aria-hidden />
              <p className="text-muted-foreground text-sm font-medium">
                Место проведения
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-foreground text-sm font-medium">
                Москва, Лужники, Большая спортивная арена, ул. Лужники, 24
              </p>
              <div className="flex flex-row flex-wrap gap-4">
                <div className="flex flex-row gap-1 items-center">
                  <div className="size-3 shrink-0 rounded-full bg-destructive" aria-hidden />
                  <p className="text-card-foreground text-xs font-medium">
                    м. Лужники
                  </p>
                  <Footprints className="text-muted-foreground size-3 shrink-0 ml-0.5" aria-hidden />
                  <p className="text-muted-foreground text-xs">
                    11 мин · 850 м
                  </p>
                </div>
                <div className="flex flex-row gap-1 items-center">
                  <div className="size-3 shrink-0 rounded-full bg-destructive" aria-hidden />
                  <p className="text-card-foreground text-xs font-medium">
                    м. Спортивная
                  </p>
                  <Footprints className="text-muted-foreground size-3 shrink-0 ml-0.5" aria-hidden />
                  <p className="text-muted-foreground text-xs">
                    11 мин · 850 м
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Карточка параметров: отступы строк 52px, разделители с отступом 24px */}
      <Card className="shrink-0 w-full sm:w-80 rounded-xl shadow-sm py-0">
        <CardContent className="py-6 px-0">
          <h2 className="text-card-foreground text-lg font-semibold px-6 pb-4">
            Параметры
          </h2>
          <div className="flex flex-col">
            <div className="h-px bg-border mx-6" aria-hidden />
            <div className="flex flex-row justify-between items-center px-6 py-3">
              <p className="text-muted-foreground text-sm font-medium">
                Вид спорта
              </p>
              <p className="text-card-foreground text-sm font-medium">
                Легкая атлетика
              </p>
            </div>
            <div className="h-px bg-border mx-6" aria-hidden />
            <div className="flex flex-row justify-between items-center px-6 py-3">
              <p className="text-muted-foreground text-sm font-medium">
                Дисциплина
              </p>
              <p className="text-card-foreground text-sm font-medium">
                Бег 100 м.
              </p>
            </div>
            <div className="h-px bg-border mx-6" aria-hidden />
            <div className="flex flex-row justify-between items-center px-6 py-3">
              <p className="text-muted-foreground text-sm font-medium">
                Формат
              </p>
              <Badge
                variant="secondary"
                className="rounded-md bg-primary/10 text-primary border-none focus-visible:outline-none"
              >
                Очное
              </Badge>
            </div>
            <div className="h-px bg-border mx-6" aria-hidden />
            <div className="flex flex-row justify-between items-center px-6 py-3">
              <p className="text-muted-foreground text-sm font-medium">
                Реестр Минспорта РФ
              </p>
              <Badge
                variant="secondary"
                className="rounded-md bg-warning/10 text-warning border-none focus-visible:outline-none"
              >
                Не включен
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
      <CompetitionParticipantsTable />
    </div>
  );
}
