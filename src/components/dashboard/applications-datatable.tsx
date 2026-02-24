"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  TrophyIcon,
  MinusCircleIcon,
  ClipboardCheckIcon,
  HourglassIcon,
  CheckCheckIcon,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  SELECT_PAGE_SIZE_TRIGGER_CLASS,
  BADGE_APPLICATION_UNDER_REVIEW,
  BADGE_APPLICATION_DOCUMENT_CHECK,
  BADGE_APPLICATION_ERRORS_FOUND,
  BADGE_APPLICATION_REJECTED,
  BADGE_APPLICATION_ACCEPTED,
} from "@/lib/constants";
import { TableEmptyState } from "@/components/shared/table-empty-state";
import { cn } from "@/lib/utils";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export type ApplicationItem = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  /** Для страницы «Заявки» — название соревнования и период */
  competitionName?: string;
  period?: string;
  applicationType: "participation" | "refusal";
  status:
    | "under_review"
    | "documents_unsigned"
    | "document_check"
    | "errors_found"
    | "accepted"
    | "rejected";
  decision: "approved" | "pending" | "rejected";
};

const APPLICATION_TYPE_LABELS: Record<ApplicationItem["applicationType"], string> = {
  participation: "Участие",
  refusal: "Отказ от участия",
};

const APPLICATION_STATUS_LABELS: Record<ApplicationItem["status"], string> = {
  under_review: "На рассмотрении",
  documents_unsigned: "Документы не подписаны",
  document_check: "Проверка документов",
  errors_found: "Найдены ошибки",
  accepted: "Принята",
  rejected: "Отклонена",
};

function getApplicationColumns(showCompetition: boolean): ColumnDef<ApplicationItem>[] {
  const columns: ColumnDef<ApplicationItem>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-sm">
          {String(row.original.id).padStart(4, "0")}
        </span>
      ),
      size: 72,
    },
  ];

  if (showCompetition) {
    columns.push({
      header: "Соревнование",
      accessorKey: "competitionName",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.original.competitionName ?? "—"}</span>
          {row.original.period ? (
            <span className="text-muted-foreground text-sm">{row.original.period}</span>
          ) : null}
        </div>
      ),
      size: 220,
    });
  }

  columns.push(
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
      size: 240,
    },
    {
      header: "Тип заявки",
      accessorKey: "applicationType",
      cell: ({ row }) => {
        const type = row.original.applicationType;
        const label = APPLICATION_TYPE_LABELS[type];
        return (
          <div className="flex items-center gap-2">
            {type === "participation" ? (
              <TrophyIcon className="size-4 shrink-0 text-chart-4" aria-hidden />
            ) : (
              <MinusCircleIcon className="size-4 shrink-0 text-destructive" aria-hidden />
            )}
            <span className="text-sm text-foreground">{label}</span>
          </div>
        );
      },
      size: 180,
    },
    {
      header: "Статус",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        const label = APPLICATION_STATUS_LABELS[status];
        if (status === "documents_unsigned") {
          return (
            <Badge variant="secondary" className="rounded-md">
              {label}
            </Badge>
          );
        }
        const badgeClass =
          status === "under_review"
            ? BADGE_APPLICATION_UNDER_REVIEW
            : status === "document_check"
              ? BADGE_APPLICATION_DOCUMENT_CHECK
              : status === "errors_found"
                ? BADGE_APPLICATION_ERRORS_FOUND
                : status === "accepted"
                  ? BADGE_APPLICATION_ACCEPTED
                  : BADGE_APPLICATION_REJECTED;
        return (
          <Badge variant="secondary" className={cn("rounded-md", badgeClass)}>
            {label}
          </Badge>
        );
      },
      size: 180,
    },
    {
      header: "Решение",
      accessorKey: "decision",
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === "under_review") {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="shrink-0 size-9"
                  aria-label="Принять решение"
                >
                  <ClipboardCheckIcon className="size-5" aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Принять решение</TooltipContent>
            </Tooltip>
          );
        }
        if (status === "documents_unsigned") {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex shrink-0 cursor-not-allowed">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="shrink-0 size-9"
                    aria-label="Ожидаем загрузки подписанных документов"
                    disabled
                  >
                    <HourglassIcon className="size-5" aria-hidden />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Ожидаем загрузки подписанных документов</TooltipContent>
            </Tooltip>
          );
        }
        if (status === "document_check") {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="shrink-0 size-9"
                  aria-label="Проверить документы"
                >
                  <ClipboardCheckIcon className="size-5" aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Проверить документы</TooltipContent>
            </Tooltip>
          );
        }
        if (status === "errors_found") {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex shrink-0 cursor-not-allowed">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="shrink-0 size-9"
                    aria-label="Ожидаем исправлений"
                    disabled
                  >
                    <HourglassIcon className="size-5" aria-hidden />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Ожидаем исправлений</TooltipContent>
            </Tooltip>
          );
        }
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex shrink-0">
                <Button
                  variant="secondary"
                  size="icon"
                  className="shrink-0 size-9"
                  aria-label="Решение принято"
                  disabled
                >
                  <CheckCheckIcon className="size-5" aria-hidden />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Решение принято</TooltipContent>
          </Tooltip>
        );
      },
      size: 100,
    }
  );

  return columns;
}

type ApplicationsDatatableProps = {
  data: ApplicationItem[];
  showCompetition?: boolean;
  onClearFilters?: () => void;
};

export function ApplicationsDatatable({
  data,
  showCompetition = false,
  onClearFilters,
}: ApplicationsDatatableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: ROWS_PER_PAGE_OPTIONS[1],
  });

  const columns = getApplicationColumns(showCompetition);

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
                    style={header.column.columnDef.size ? { width: `${header.column.columnDef.size}px` } : undefined}
                    className="text-muted-foreground first:pl-4 last:px-4 last:text-center"
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
                    <TableCell key={cell.id} className="first:pl-4 last:px-4 last:text-center">
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

export { getApplicationColumns, APPLICATION_STATUS_LABELS, APPLICATION_TYPE_LABELS };
