"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ru as dateFnsRu } from "date-fns/locale";
import { ru as dayPickerRu } from "react-day-picker/locale";
import {
  Trophy,
  Building,
  ClipboardList,
  Spline,
  Plus,
  CalendarIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CompetitionItem } from "@/components/dashboard/competitions-datatable";

const MENU_ITEMS = [
  { id: "main", icon: Trophy, text: "Основная информация" },
  { id: "organizer", icon: Building, text: "Организатор" },
  { id: "sports", icon: ClipboardList, text: "Спортивная информация" },
  { id: "params", icon: Spline, text: "Параметры проведения" },
] as const;

type AddCompetitionFormProps = {
  mode?: "add" | "edit";
  initialData?: CompetitionItem | null;
  onCancel?: () => void;
};

function mapSportNameToValue(sportName: string): string {
  if (sportName === "Хоккей") return "hockey";
  if (sportName === "Баскетбол") return "basketball";
  return "football";
}

export function AddCompetitionForm({
  mode = "add",
  initialData,
  onCancel,
}: AddCompetitionFormProps) {
  const [activeMenuId, setActiveMenuId] = useState<string>(MENU_ITEMS[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [fullName, setFullName] = useState("");
  const [shortName, setShortName] = useState("");
  const [formatType, setFormatType] = useState<"in-person" | "online">("online");
  const [competitionType, setCompetitionType] = useState<"one-day" | "multi-day">("one-day");
  const [conductDate, setConductDate] = useState<Date | undefined>(undefined);
  const [specifyTime, setSpecifyTime] = useState(false);
  const [participantsCount, setParticipantsCount] = useState("0");
  const [gender, setGender] = useState<"male" | "female" | "any">("male");
  const [minSportList, setMinSportList] = useState<"no" | "yes">("no");
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [sportValue, setSportValue] = useState<string>("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFullName(initialData.competitionName ?? "");
      setShortName(initialData.competitionName ?? "");
      setSportValue(mapSportNameToValue(initialData.sportName ?? ""));
      setParticipantsCount(String(initialData.participants ?? 0));
      setConductDate(
        initialData.periodStartDate
          ? new Date(initialData.periodStartDate)
          : undefined
      );
    }
    if (mode === "add") {
      setFullName("");
      setShortName("");
      setSportValue("");
      setParticipantsCount("0");
      setConductDate(undefined);
    }
  }, [mode, initialData]);

  const scrollToSection = (id: string) => {
    setActiveMenuId(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Card className="w-[800px] h-[600px] rounded-[14px] shadow-sm py-0 bg-popover border-border">
      <CardContent className="p-0">
        <div className="flex h-[600px]">
          <div className="w-[280px] h-full flex justify-center pt-6 pb-6 pl-6 shrink-0">
            <div className="w-64 h-[552px] border border-border rounded-lg bg-card">
              <div className="pt-3 pr-3 pl-4">
                <h2 className="text-card-foreground font-bold text-base leading-6">
                  {mode === "edit" ? "Редактировать соревнование" : "Добавить соревнование"}
                </h2>
              </div>
              <div className="flex flex-col gap-1 pt-3 pr-3 pl-3">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenuId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`flex w-full gap-2 p-2 rounded-md text-left ${
                        isActive ? "bg-accent" : ""
                      }`}
                    >
                      <Icon className="size-[18px] shrink-0 text-accent-foreground" />
                      <span
                        className={`text-sm leading-5 ${
                          isActive ? "text-card-foreground" : "text-accent-foreground"
                        }`}
                      >
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-0 pt-6 pr-6 pb-6 pl-7 min-w-0">
            <div className="w-full max-w-[468px] h-full min-h-0 flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-6 px-1 pr-2">
                <section
                  ref={(el) => {
                    sectionRefs.current.main = el;
                  }}
                  id="section-main"
                  className="flex flex-col gap-4"
                >
                  <h3 className="text-muted-foreground font-medium text-base leading-6">
                    Основная информация
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="full-name" className="text-foreground mt-1 mx-1">
                        Полное официальное наименование
                      </Label>
                      <Input
                        id="full-name"
                        placeholder="Полное наименование соревнования"
                        className="bg-card rounded-md"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="short-name" className="text-foreground mt-1 mx-1">
                        Короткое официальное наименование
                      </Label>
                      <Input
                        id="short-name"
                        placeholder="Короткое наименование соревнования"
                        className="bg-card rounded-md"
                        value={shortName}
                        onChange={(e) => setShortName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground mt-1 mx-1">Формат проведения</Label>
                      <RadioGroup
                        value={formatType}
                        onValueChange={(v) => setFormatType(v as "in-person" | "online")}
                        className="flex gap-4 ml-1"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="in-person" id="format-in-person" />
                          <Label htmlFor="format-in-person" className="text-foreground font-normal cursor-pointer">
                            Очное
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="online" id="format-online" />
                          <Label htmlFor="format-online" className="text-foreground font-normal cursor-pointer">
                            Онлайн
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="place" className="text-foreground mt-1 mx-1">
                        Место проведения
                      </Label>
                      <Input
                        id="place"
                        placeholder="Город, адрес или место"
                        className="bg-card rounded-md"
                      />
                    </div>
                  </div>
                </section>

                <section
                  ref={(el) => {
                    sectionRefs.current.organizer = el;
                  }}
                  id="section-organizer"
                  className="flex flex-col gap-4"
                >
                  <h3 className="text-muted-foreground font-medium text-base leading-6">
                    Организатор
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="org-full-name" className="text-foreground mt-1 mx-1">
                        Полное наименование
                      </Label>
                      <Input
                        id="org-full-name"
                        placeholder="Полное наименование"
                        className="bg-card rounded-md"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-1 flex-col gap-2 min-w-0">
                        <Label htmlFor="ogrn" className="text-foreground mt-1 mx-1">
                          ОГРН
                        </Label>
                        <Input
                          id="ogrn"
                          placeholder="1023456789001"
                          className="bg-card rounded-md"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-2 min-w-0">
                        <Label htmlFor="inn" className="text-foreground mt-1 mx-1">
                          ИНН
                        </Label>
                        <Input
                          id="inn"
                          placeholder="7701234567"
                          className="bg-card rounded-md"
                        />
                      </div>
                    </div>
                    <Button type="button" variant="ghost" className="w-fit h-9 gap-2 text-muted-foreground hover:text-foreground p-0">
                      <Plus className="size-4" />
                      Добавить соорганизатора
                    </Button>
                  </div>
                </section>

                <section
                  ref={(el) => {
                    sectionRefs.current.sports = el;
                  }}
                  id="section-sports"
                  className="flex flex-col gap-4"
                >
                  <h3 className="text-muted-foreground font-medium text-base leading-6">
                    Спортивная информация
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground mt-1 mx-1">Вид спорта</Label>
                      <Select
                        value={sportValue}
                        onValueChange={setSportValue}
                      >
                        <SelectTrigger className="w-full bg-card rounded-md">
                          <SelectValue placeholder="Выбрать" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="football">Футбол</SelectItem>
                          <SelectItem value="hockey">Хоккей</SelectItem>
                          <SelectItem value="basketball">Баскетбол</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground mt-1 mx-1">Спортивная дисциплина</Label>
                      <Select disabled>
                        <SelectTrigger className="w-full rounded-md bg-muted text-muted-foreground">
                          <SelectValue placeholder="Все" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                <section
                  ref={(el) => {
                    sectionRefs.current.params = el;
                  }}
                  id="section-params"
                  className="flex flex-col gap-4"
                >
                  <h3 className="text-muted-foreground font-medium text-base leading-6">
                    Параметры проведения
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground mt-1 mx-1">Тип соревнования</Label>
                      <RadioGroup
                        value={competitionType}
                        onValueChange={(v) => setCompetitionType(v as "one-day" | "multi-day")}
                        className="flex gap-4 ml-1"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="one-day" id="type-one-day" />
                          <Label htmlFor="type-one-day" className="text-foreground font-normal cursor-pointer">
                            Один день
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="multi-day" id="type-multi-day" />
                          <Label htmlFor="type-multi-day" className="text-foreground font-normal cursor-pointer">
                            Несколько дней
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground mt-1 mx-1">Дата проведения</Label>
                      <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-9 rounded-md bg-card pl-3"
                          >
                            <CalendarIcon className="text-muted-foreground mr-2 size-4 shrink-0" />
                            {conductDate
                              ? format(conductDate, "d MMM yyyy", { locale: dateFnsRu })
                              : "Выберите дату"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={conductDate}
                            onSelect={(date) => {
                              setConductDate(date);
                              setDatePopoverOpen(false);
                            }}
                            locale={dayPickerRu}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center gap-2 ml-1">
                      <Switch
                        id="specify-time"
                        checked={specifyTime}
                        onCheckedChange={setSpecifyTime}
                      />
                      <Label htmlFor="specify-time" className="text-foreground font-normal cursor-pointer mt-1 mx-1">
                        Указать время проведения
                      </Label>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="participants" className="text-foreground mt-1 mx-1">
                        Количество участников
                      </Label>
                      <Input
                        id="participants"
                        type="number"
                        min={0}
                        value={participantsCount}
                        onChange={(e) => setParticipantsCount(e.target.value)}
                        className="bg-card rounded-md"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground mt-1 mx-1">Пол участников</Label>
                      <RadioGroup
                        value={gender}
                        onValueChange={(v) => setGender(v as "male" | "female" | "any")}
                        className="flex gap-4 ml-1"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="male" id="gender-male" />
                          <Label htmlFor="gender-male" className="text-foreground font-normal cursor-pointer">
                            Мужчины
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="female" id="gender-female" />
                          <Label htmlFor="gender-female" className="text-foreground font-normal cursor-pointer">
                            Женщины
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="any" id="gender-any" />
                          <Label htmlFor="gender-any" className="text-foreground font-normal cursor-pointer">
                            Любой
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground mt-1 mx-1">
                        Включено в перечень минспорта России
                      </Label>
                      <RadioGroup
                        value={minSportList}
                        onValueChange={(v) => setMinSportList(v as "no" | "yes")}
                        className="flex gap-4 ml-1"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="minsport-no" />
                          <Label htmlFor="minsport-no" className="text-foreground font-normal cursor-pointer">
                            Нет
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="yes" id="minsport-yes" />
                          <Label htmlFor="minsport-yes" className="text-foreground font-normal cursor-pointer">
                            Да
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </section>
              </div>

              <div className="w-full shrink-0 flex gap-4 justify-end items-center pt-4">
                <Button variant="secondary" className="h-9" onClick={onCancel}>
                  Отмена
                </Button>
                <Button className="h-9">
                  {mode === "edit" ? "Сохранить" : "Добавить"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
