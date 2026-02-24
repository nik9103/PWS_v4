"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronUpIcon,
  CheckIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import type { ColumnDef, ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CompetitionStatusVariant } from "@/components/dashboard/competition-status-block";
import { TableEmptyState } from "@/components/shared/table-empty-state";
import {
  BADGE_STATUS_BASE,
  BADGE_STATUS_COMPLETED,
  BADGE_STATUS_ONGOING,
  BADGE_STATUS_PLANNED,
  SELECT_PAGE_SIZE_TRIGGER_CLASS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export type CompetitionItem = {
  id: string;
  competitionName: string;
  sportName: string;
  participants: number;
  period: string;
  startTime: string;
  status: "ongoing" | "planned" | "completed";
  /** Начало периода (для фильтра по датам), ISO-строка */
  periodStartDate: string;
  /** Конец периода (для фильтра по датам), ISO-строка */
  periodEndDate: string;
  /** Опциональный блок статуса (для карточки). Если не задан — используется «Доступно N мест». */
  statusBlock?: {
    variant: CompetitionStatusVariant;
    payload?: { placesCount?: number; daysCount?: number; rejectReason?: string };
  };
  /** Организатор (для панели информации на карточке). */
  organizer?: string;
  /** Включён в реестр Минспорта (для панели информации). По умолчанию true. */
  registryIncluded?: boolean;
};

const STATUS_LABELS: Record<CompetitionItem["status"], string> = {
  ongoing: "Уже идет",
  planned: "Запланирован",
  completed: "Завершено",
};

const STATUS_OPTIONS: { value: CompetitionItem["status"]; label: string; dotClass: string }[] = [
  { value: "planned", label: STATUS_LABELS.planned, dotClass: "bg-primary" },
  { value: "ongoing", label: STATUS_LABELS.ongoing, dotClass: "bg-success" },
  { value: "completed", label: STATUS_LABELS.completed, dotClass: "bg-muted-foreground" },
];

function buildColumns(
  onStatusChange?: (id: string, status: CompetitionItem["status"]) => void,
  onEdit?: (row: CompetitionItem) => void
): ColumnDef<CompetitionItem>[] {
  return [
  {
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-sm">
        {String(row.getValue("id")).padStart(4, "0")}
      </span>
    ),
    size: 72,
  },
  {
    header: "Название",
    accessorKey: "competitionName",
    cell: ({ row }) => <span className="font-medium">{row.getValue("competitionName")}</span>,
    size: 280,
  },
  {
    header: "Название",
    accessorKey: "sportName",
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("sportName")}</span>,
    size: 160,
  },
  {
    header: "Участников",
    accessorKey: "participants",
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("participants")}</span>,
    size: 100,
  },
  {
    header: "Период проведения",
    accessorKey: "period",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue("period")}</span>
        <span className="text-muted-foreground text-sm">{row.original.startTime}</span>
      </div>
    ),
    size: 280,
  },
  {
    header: "Статус",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as CompetitionItem["status"];
      const label = STATUS_LABELS[status];
      const isCompleted = status === "completed";

      const badge = isCompleted ? (
        <Badge variant="outline" className={BADGE_STATUS_COMPLETED}>
          {label}
        </Badge>
      ) : (
        <Badge
          variant="secondary"
          className={cn(
            BADGE_STATUS_BASE,
            status === "ongoing" && BADGE_STATUS_ONGOING,
            status === "planned" && BADGE_STATUS_PLANNED
          )}
        >
          {label}
        </Badge>
      );

      if (!onStatusChange) {
        return badge;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="cursor-pointer rounded-md outline-none focus-visible:outline-none focus-visible:ring-0"
              onClick={(e) => e.stopPropagation()}
              aria-haspopup="listbox"
              aria-label={`Статус: ${label}. Изменить`}
            >
              {badge}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[10rem]">
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = status === opt.value;
              return (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(row.original.id, opt.value);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md",
                    isSelected && "bg-muted"
                  )}
                >
                  <span className={cn("size-2 shrink-0 rounded-full", opt.dotClass)} aria-hidden />
                  <span className="flex-1 text-left">{opt.label}</span>
                  {isSelected && <CheckIcon className="size-4 shrink-0 text-foreground" aria-hidden />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 140,
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Редактировать"
              onClick={() => onEdit?.(row.original)}
            >
              <PencilIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Редактировать</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Удалить">
              <Trash2Icon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Удалить</p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
];
}

function CompetitionsDatatable({
  data,
  onClearFilters,
  onStatusChange,
  onEdit,
}: {
  data: CompetitionItem[];
  onClearFilters?: () => void;
  onStatusChange?: (id: string, status: CompetitionItem["status"]) => void;
  onEdit?: (row: CompetitionItem) => void;
}) {
  const router = useRouter();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: ROWS_PER_PAGE_OPTIONS[1],
  });

  const columns = buildColumns(onStatusChange, onEdit);

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, pagination },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    enableSortingRemoval: false,
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
                    style={{ width: `${header.getSize()}px` }}
                    className="text-muted-foreground first:pl-4 last:px-4 last:text-center"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          if (header.column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
                          desc: <ChevronDownIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    router.push(
                      `/competitions/${row.original.id}?name=${encodeURIComponent(row.original.competitionName)}&status=${row.original.status}`
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="first:pl-4 last:px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0 align-middle">
                  <TableEmptyState onClearFilters={onClearFilters} />
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

export default CompetitionsDatatable;
