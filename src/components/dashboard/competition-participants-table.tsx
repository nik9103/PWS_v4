"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SELECT_PAGE_SIZE_TRIGGER_CLASS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { TableEmptyState } from "@/components/shared/table-empty-state";
import { ApplicationsDatatable, type ApplicationItem } from "@/components/dashboard/applications-datatable";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export type ParticipantItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
};

export type JudgeItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
};

export type { ApplicationItem };

const MOCK_PARTICIPANT_NAMES = [
  "Белов Михаил Иванович", "Козлов Александр Дмитриевич", "Новиков Сергей Андреевич",
  "Морозов Дмитрий Павлович", "Петров Андрей Николаевич", "Волков Алексей Евгеньевич",
  "Соколов Иван Сергеевич", "Михайлов Павел Александрович", "Федоров Николай Дмитриевич",
  "Николаев Евгений Иванович", "Кузнецов Михаил Сергеевич", "Попов Александр Андреевич",
  "Васильев Дмитрий Николаевич", "Смирнов Сергей Павлович", "Кузнецова Анна Ивановна",
  "Орлова Елена Дмитриевна", "Волкова Мария Сергеевна", "Лебедев Олег Андреевич",
  "Семёнов Григорий Николаевич", "Егоров Виктор Павлович",
];

const MOCK_PARTICIPANTS: ParticipantItem[] = Array.from({ length: 80 }, (_, i) => ({
  id: String(i + 1),
  name: MOCK_PARTICIPANT_NAMES[i % MOCK_PARTICIPANT_NAMES.length],
  email: `sport${(i % 5) + 1}@test.ru`,
  phone: "+7 (968) 123-45-67",
  avatarUrl: undefined,
}));

const MOCK_JUDGES: JudgeItem[] = [
  { id: "1", name: "Козлов Александр Дмитриевич", email: "sport1@test.ru", phone: "+7 (968) 123-45-67", avatarUrl: undefined },
  { id: "2", name: "Новиков Сергей Андреевич", email: "sport2@test.ru", phone: "+7 (968) 123-45-67", avatarUrl: undefined },
];

const MOCK_APPLICATION_NAMES = [
  "Белов Михаил Иванович",
  "Козлов Александр Дмитриевич",
  "Новиков Сергей Андреевич",
  "Морозов Дмитрий Павлович",
  "Петров Андрей Николаевич",
  "Волков Алексей Евгеньевич",
  "Соколов Иван Сергеевич",
  "Михайлов Павел Александрович",
  "Федоров Николай Дмитриевич",
];

const MOCK_APPLICATIONS: ApplicationItem[] = [
  { id: "1", name: MOCK_APPLICATION_NAMES[0], email: "sport1@test.ru", applicationType: "participation", status: "under_review", decision: "approved" },
  { id: "2", name: MOCK_APPLICATION_NAMES[1], email: "sport2@test.ru", applicationType: "participation", status: "documents_unsigned", decision: "pending" },
  { id: "3", name: MOCK_APPLICATION_NAMES[2], email: "sport1@test.ru", applicationType: "participation", status: "document_check", decision: "approved" },
  { id: "4", name: MOCK_APPLICATION_NAMES[3], email: "sport2@test.ru", applicationType: "participation", status: "errors_found", decision: "pending" },
  { id: "5", name: MOCK_APPLICATION_NAMES[4], email: "sport3@test.ru", applicationType: "participation", status: "accepted", decision: "approved" },
  { id: "6", name: MOCK_APPLICATION_NAMES[5], email: "sport1@test.ru", applicationType: "participation", status: "rejected", decision: "rejected" },
  { id: "7", name: MOCK_APPLICATION_NAMES[6], email: "sport2@test.ru", applicationType: "refusal", status: "under_review", decision: "approved" },
  { id: "8", name: MOCK_APPLICATION_NAMES[7], email: "sport3@test.ru", applicationType: "refusal", status: "accepted", decision: "approved" },
  { id: "9", name: MOCK_APPLICATION_NAMES[8], email: "sport1@test.ru", applicationType: "refusal", status: "rejected", decision: "rejected" },
];

type PersonItem = { id: string; name: string; email: string; phone: string; avatarUrl?: string };

const personColumns: ColumnDef<PersonItem>[] = [
  {
    header: "Спортсмен",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-9 shrink-0 border border-border">
          <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
          <AvatarFallback className="text-xs font-medium">
            {row.original.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm text-foreground truncate">{row.original.name}</span>
          <span className="text-xs text-muted-foreground truncate">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Телефон",
    accessorKey: "phone",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue("phone")}</span>
    ),
  },
];

function getJudgeColumns(onDelete: (id: string) => void): ColumnDef<PersonItem>[] {
  return [
    {
      header: "Судья",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0 border border-border">
            <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
            <AvatarFallback className="text-xs font-medium">
              {row.original.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm text-foreground truncate">{row.original.name}</span>
            <span className="text-xs text-muted-foreground truncate">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Телефон",
      accessorKey: "phone",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.getValue("phone")}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground rounded-md"
          onClick={() => onDelete(row.original.id)}
          aria-label="Удалить судью"
        >
          <Trash2Icon className="size-4" aria-hidden />
        </Button>
      ),
    },
  ];
}

function PersonTable<T extends { id: string }>({
  data,
  columns,
}: {
  data: T[];
  columns: ColumnDef<T>[];
}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: ROWS_PER_PAGE_OPTIONS[1],
  });

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const start = table.getState().pagination.pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalRows);

  return (
    <div className="w-full">
      <div className="border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-muted-foreground text-sm font-medium first:pl-6 last:pr-6 last:text-center",
                      headerGroup.headers.indexOf(header) === headerGroup.headers.length - 1 && "w-20"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "first:pl-6 last:pr-6 last:text-center",
                        row.getVisibleCells().indexOf(cell) === row.getVisibleCells().length - 1 && "w-20"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0 align-middle">
                  <TableEmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
            table.setPageIndex(0);
          }}
        >
          <SelectTrigger
            className={cn("w-auto rounded-lg bg-background", SELECT_PAGE_SIZE_TRIGGER_CLASS)}
            aria-label="Строк на странице"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROWS_PER_PAGE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}/строк
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
            {totalRows === 0 ? "0 из 0" : `${start}-${end} из ${totalRows}`}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="Первая страница"
            >
              <ChevronsLeftIcon className="size-4" aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Предыдущая страница"
            >
              <ChevronLeftIcon className="size-4" aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Следующая страница"
            >
              <ChevronRightIcon className="size-4" aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Последняя страница"
            >
              <ChevronsRightIcon className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompetitionParticipantsTable() {
  const [judges, setJudges] = useState<JudgeItem[]>(MOCK_JUDGES);
  const [assignJudgeOpen, setAssignJudgeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("participants");

  const judgeColumns = getJudgeColumns((id) => setJudges((prev) => prev.filter((j) => j.id !== id)));

  useEffect(() => {
    if (activeTab !== "judges") setAssignJudgeOpen(false);
  }, [activeTab]);

  return (
    <Card className="w-full rounded-xl shadow-sm py-0">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} variant="line" className="w-full">
          <div className="flex items-center justify-between border-b border-border px-6">
            <TabsList
              variant="line"
              className="w-full max-w-fit justify-start border-0 rounded-none px-0 gap-6 bg-transparent min-h-[68px]"
            >
              <TabsTrigger
                value="participants"
                className="group gap-2 flex-none px-0 h-full min-h-9 text-foreground data-[state=active]:text-primary data-[state=active]:after:bg-primary"
              >
                Участников
                <Badge
                  variant="secondary"
                  className="group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground group-data-[state=active]:border-primary"
                >
                  {MOCK_PARTICIPANTS.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="judges"
                className="group gap-2 flex-none px-0 h-full min-h-9 text-foreground data-[state=active]:text-primary data-[state=active]:after:bg-primary"
              >
                Судейский состав
                <Badge
                  variant="secondary"
                  className="group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground group-data-[state=active]:border-primary"
                >
                  {judges.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="group gap-2 flex-none px-0 h-full min-h-9 text-foreground data-[state=active]:text-primary data-[state=active]:after:bg-primary"
              >
                Заявки
                <Badge
                  variant="secondary"
                  className="group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground group-data-[state=active]:border-primary"
                >
                  {MOCK_APPLICATIONS.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            {activeTab === "judges" && (
              <Dialog open={assignJudgeOpen} onOpenChange={setAssignJudgeOpen}>
                <DialogTrigger asChild>
                  <Button className="shrink-0 rounded-lg" size="default">
                    <UserPlusIcon className="size-4 shrink-0" aria-hidden />
                    Назначить судью
                  </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false} className="rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Назначить судью</DialogTitle>
                  </DialogHeader>
                  <p className="text-muted-foreground text-sm">Функция в разработке.</p>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <TabsContent value="participants">
            <PersonTable data={MOCK_PARTICIPANTS} columns={personColumns} />
          </TabsContent>
          <TabsContent value="judges">
            <PersonTable data={judges} columns={judgeColumns} />
          </TabsContent>
          <TabsContent value="applications">
            <ApplicationsDatatable data={MOCK_APPLICATIONS} showCompetition={false} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
