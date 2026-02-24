"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
} from "lucide-react";
import type { ColumnDef, PaginationState, RowSelectionState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  BADGE_DOCUMENT_SIGNED,
  BADGE_DOCUMENT_UNSIGNED,
  SELECT_PAGE_SIZE_TRIGGER_CLASS,
} from "@/lib/constants";
import { TableEmptyState } from "@/components/shared/table-empty-state";
import { cn } from "@/lib/utils";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export type DocumentItem = {
  id: string;
  title: string;
  documentType: string;
  date: string;
  fileSize: string;
  status: "signed" | "unsigned";
  athleteName: string;
  athleteEmail: string;
  athleteAvatarUrl?: string;
  competitionName: string;
  disciplineName: string;
};

const STATUS_LABELS: Record<DocumentItem["status"], string> = {
  signed: "Подписан",
  unsigned: "Не подписан",
};

export { STATUS_LABELS };

function buildColumns(): ColumnDef<DocumentItem>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Выбрать все"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Выбрать строку"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 50,
      enableSorting: false,
    },
    {
      header: "Документ",
      accessorKey: "title",
      cell: ({ row }) => {
        const doc = row.original;
        const isSigned = doc.status === "signed";
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                "size-9 shrink-0 rounded-sm flex items-center justify-center",
                isSigned
                  ? "bg-success/10 border-success/20"
                  : "bg-primary/10 border-primary/20"
              )}
            >
              <FileTextIcon
                className={cn("size-4", isSigned ? "text-success" : "text-primary")}
                aria-hidden
              />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-medium text-foreground truncate">{doc.title}</span>
              <span className="text-muted-foreground text-sm truncate">
                {doc.documentType} • {doc.date} • {doc.fileSize}
              </span>
            </div>
          </div>
        );
      },
      size: 280,
    },
    {
      header: "Статус",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        const label = STATUS_LABELS[status];
        return (
          <Badge
            variant="secondary"
            className={status === "signed" ? BADGE_DOCUMENT_SIGNED : BADGE_DOCUMENT_UNSIGNED}
          >
            {label}
          </Badge>
        );
      },
      size: 120,
    },
    {
      header: "Спортсмен",
      accessorKey: "athleteName",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0 border border-border">
            <AvatarImage src={row.original.athleteAvatarUrl} alt={row.original.athleteName} />
            <AvatarFallback className="text-xs font-medium">
              {row.original.athleteName
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm text-foreground truncate">
              {row.original.athleteName}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {row.original.athleteEmail}
            </span>
          </div>
        </div>
      ),
      size: 220,
    },
    {
      header: "Соревнование",
      accessorKey: "competitionName",
      cell: ({ row }) => (
        <span className="text-foreground text-sm">{row.original.competitionName}</span>
      ),
      size: 200,
    },
    {
      header: "Дисциплина",
      accessorKey: "disciplineName",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.disciplineName}</span>
      ),
      size: 120,
    },
    {
      id: "actions",
      header: () => null,
      cell: () => (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9" aria-label="Просмотр">
                <EyeIcon className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Просмотр</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9" aria-label="Скачать">
                <DownloadIcon className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Скачать</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
      size: 100,
      enableSorting: false,
    },
  ];
}

type DocumentsDatatableProps = {
  data: DocumentItem[];
  onClearFilters?: () => void;
};

export function DocumentsDatatable({ data, onClearFilters }: DocumentsDatatableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: ROWS_PER_PAGE_OPTIONS[1],
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = buildColumns();

  const table = useReactTable({
    data,
    columns,
    state: { pagination, rowSelection },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const start = table.getState().pagination.pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalRows);
  const selectedCount = table.getSelectedRowModel().rows.length;
  const showSelectionHeader = selectedCount > 0;

  const handleDownloadSelected = () => {
    const rows = table.getSelectedRowModel().rows;
    const ids = rows.map((row) => row.original.id);
    // Заглушка: в реальном приложении — запрос на скачивание по ids
    console.log("Скачать выбранные:", ids);
  };

  return (
    <div className="w-full">
      <div className="border-b">
        <Table>
          <TableHeader>
            {showSelectionHeader ? (
              <TableRow>
                <TableHead
                  style={{ width: "50px", minWidth: "50px" }}
                  className="text-muted-foreground pl-4"
                >
                  <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Снять выделение"
                  />
                </TableHead>
                <TableHead colSpan={columns.length - 1} className="py-3">
                  <div className="flex flex-1 items-center gap-3">
                    <span className="text-sm font-medium text-foreground">
                      Выбрано: {selectedCount}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-lg"
                      onClick={handleDownloadSelected}
                    >
                      <DownloadIcon className="size-4" aria-hidden />
                      Скачать выбранные
                    </Button>
                  </div>
                </TableHead>
              </TableRow>
            ) : (
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={
                        header.column.columnDef.size
                          ? { width: `${header.column.columnDef.size}px`, minWidth: `${header.column.columnDef.size}px` }
                          : undefined
                      }
                      className="text-muted-foreground first:pl-4 last:px-4 last:text-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))
            )}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/50 data-[state=selected]:bg-muted/50"
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={
                        cell.column.columnDef.size
                          ? { width: `${cell.column.columnDef.size}px`, minWidth: `${cell.column.columnDef.size}px` }
                          : undefined
                      }
                      className="first:pl-4 last:px-4 last:text-center"
                    >
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
