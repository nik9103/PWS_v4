"use client";

import { useCallback, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BADGE_USER_ACTIVE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Calendar,
  CalendarClock,
  Check,
  Clock,
  Copy,
  Download,
  FilePen,
  Mail,
  MapPin,
  Phone,
  Send,
  Trophy,
} from "lucide-react";

const BANK_DETAILS_TEXT = `Серия и номер: 4111 1111 1111 1111
БИК банка: 044525225
Расчётный счёт: 40702810800000000001
Получатель: Иванов Иван Иванович
Корр. счёт: 30101810400000000225`;

export function UserProfileContent() {
  const [bankCopied, setBankCopied] = useState(false);

  const copyBankDetails = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(BANK_DETAILS_TEXT);
      setBankCopied(true);
      window.setTimeout(() => setBankCopied(false), 3000);
    } catch {
      setBankCopied(false);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Карточка профиля */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="flex flex-row items-start gap-4">
              <Avatar className="size-14 shrink-0">
                <AvatarImage
                  src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
                  alt="Смирнов Егор Егорович"
                />
                <AvatarFallback>СЕ</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <h2 className="text-base font-bold leading-6 text-card-foreground">
                  Смирнов Егор Егорович
                </h2>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-sm leading-5 text-muted-foreground">
                    34 года · 01 янв. 1990
                  </p>
                  <Badge variant="secondary" className="rounded-md">
                    Спортсмен
                  </Badge>
                  <Badge variant="secondary" className={BADGE_USER_ACTIVE}>
                    <span>Активный</span>
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-row items-center gap-7">
              <div className="flex flex-row items-center gap-2">
                <Calendar className="size-4 shrink-0 text-muted-foreground" />
                <p className="text-sm leading-5 text-foreground">
                  Дата регистрации: 01 янв. 2026, 00:00
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Clock className="size-4 shrink-0 text-muted-foreground" />
                <p className="text-sm leading-5 text-foreground">
                  Последний вход: 12 фев. 2026, 00:00
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="min-w-0">
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary/10">
                  <Trophy className="size-4 text-primary" />
                </div>
                <span className="text-2xl font-semibold leading-8 text-card-foreground">
                  150
                </span>
              </div>
              <p className="text-sm font-medium leading-5 text-card-foreground">
                Соревнований за все время
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-amber-600/10">
                  <FilePen className="size-4 text-amber-600" />
                </div>
                <span className="text-2xl font-semibold leading-8 text-card-foreground">
                  9
                </span>
              </div>
              <p className="text-sm font-medium leading-5 text-card-foreground">
                Новые заявки на участие
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-sky-600/10">
                  <CalendarClock className="size-4 text-sky-600" />
                </div>
                <span className="text-2xl font-semibold leading-8 text-card-foreground">
                  48
                </span>
              </div>
              <p className="text-sm font-medium leading-5 text-card-foreground">
                Всего документов
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Строка с контактами и паспортом */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
        {/* Контактная информация */}
        <Card className="flex min-w-0 flex-col h-full">
          <CardContent className="flex flex-1 flex-col min-h-0">
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-semibold leading-7 text-card-foreground">
                Контактная информация
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-muted-foreground/10">
                    <Mail className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-base leading-6 text-card-foreground">sport1@test.ru</p>
                    <p className="text-sm leading-5 text-muted-foreground">Email</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-muted-foreground/10">
                    <Phone className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-base leading-6 text-card-foreground">+7 (999) 999-99-99</p>
                    <p className="text-sm leading-5 text-muted-foreground">Телефон</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-muted-foreground/10">
                    <MapPin className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-base leading-6 text-card-foreground">Москва</p>
                    <p className="text-sm leading-5 text-muted-foreground">Город</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-muted-foreground/10">
                    <Send className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-base leading-6 text-card-foreground">@algo782</p>
                    <p className="text-sm leading-5 text-muted-foreground">Telegram</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Паспортные данные */}
        <Card className="flex min-w-0 flex-col h-full">
          <CardContent className="flex flex-1 flex-col min-h-0">
            <div className="flex flex-col gap-5 flex-1 min-h-0">
              <div className="flex flex-row items-start justify-between shrink-0">
                <h3 className="text-lg font-semibold leading-7 text-card-foreground">
                  Паспортные данные
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-lg"
                      aria-label="Скачать документы"
                    >
                      <Download className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Скачать документы</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-col divide-y divide-border flex-1 min-h-0">
                <div className="flex flex-row items-center justify-between py-3 flex-1 min-h-[52px]">
                  <p className="text-sm font-medium leading-5 text-muted-foreground shrink-0">
                    Серия и номер
                  </p>
                  <p className="text-sm font-medium leading-5 text-card-foreground text-right">
                    4512 678901
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between py-3 flex-1 min-h-[52px]">
                  <p className="text-sm font-medium leading-5 text-muted-foreground shrink-0">
                    Кем выдан
                  </p>
                  <p className="text-sm font-medium leading-5 text-card-foreground text-right">
                    УФМС России по Московской области
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between py-3 flex-1 min-h-[52px]">
                  <p className="text-sm font-medium leading-5 text-muted-foreground shrink-0">
                    Дата выдачи
                  </p>
                  <p className="text-sm font-medium leading-5 text-card-foreground text-right">
                    20 апр. 2015
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between py-3 flex-1 min-h-[52px]">
                  <p className="text-sm font-medium leading-5 text-muted-foreground shrink-0">
                    Место регистрации
                  </p>
                  <p className="text-sm font-medium leading-5 text-card-foreground text-right">
                    ул. Тверская, д. 12, кв. 45, г. Москва
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Нижняя строка */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Банковские реквизиты */}
        <Card className="min-w-0">
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="flex flex-row items-start justify-between">
                <h3 className="text-lg font-semibold leading-7 text-card-foreground">
                  Банковские реквизиты
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-lg"
                      onClick={copyBankDetails}
                      aria-label="Скопировать банковские реквизиты"
                    >
                      {bankCopied ? (
                        <Check className="size-4 text-success" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{bankCopied ? "Скопировано" : "Скопировать реквизиты"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-col divide-y divide-border">
                <div className="flex flex-row items-center justify-between py-3">
                  <p className="text-sm font-medium leading-5 text-muted-foreground">
                    Серия и номер
                  </p>
                  <p className="text-sm font-medium leading-5 text-card-foreground">
                    4111 1111 1111 1111
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between py-3">
                  <p className="text-sm font-medium leading-5 text-muted-foreground">
                    БИК банка
                  </p>
                  <p className="text-sm font-medium leading-5 text-card-foreground">
                    044525225
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between py-3">
                  <p className="text-sm font-medium leading-5 text-muted-foreground">
                    Расчётный счёт
                  </p>
                  <p className="text-sm font-medium leading-5 text-card-foreground">
                    40702810800000000001
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between py-3">
                  <p className="text-sm font-medium leading-5 text-muted-foreground">
                    Получатель
                  </p>
                  <p className="text-sm font-medium leading-5 text-card-foreground">
                    Иванов Иван Иванович
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between py-3">
                  <p className="text-sm font-medium leading-5 text-muted-foreground">
                    Корр. счёт
                  </p>
                  <p className="text-sm font-medium leading-5 text-card-foreground">
                    30101810400000000225
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Прочие данные */}
        <Card className="min-w-0 h-fit">
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="flex flex-row items-start justify-between">
                <h3 className="text-lg font-semibold leading-7 text-card-foreground">
                  Прочие данные
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-lg"
                      aria-label="Скачать документы"
                    >
                      <Download className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Скачать документы</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-col divide-y divide-border">
                <div className="flex flex-row items-center justify-between py-3">
                  <p className="text-sm font-medium leading-5 text-muted-foreground">ИНН</p>
                  <p className="text-sm font-medium leading-5 text-card-foreground">
                    123-456-789 01
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between py-3">
                  <p className="text-sm font-medium leading-5 text-muted-foreground">СНИЛС</p>
                  <p className="text-sm font-medium leading-5 text-card-foreground">
                    771234567890
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
