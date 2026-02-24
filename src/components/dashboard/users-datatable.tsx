"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  DumbbellIcon,
  GavelIcon,
  LockIcon,
  PencilLineIcon,
  Trash2Icon,
  UserCogIcon,
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
import { BADGE_USER_ACTIVE, SELECT_PAGE_SIZE_TRIGGER_CLASS } from "@/lib/constants";
import { TableEmptyState } from "@/components/shared/table-empty-state";
import { cn } from "@/lib/utils";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export type UserRole = "judge" | "manager" | "athlete";
export type UserStatus = "active" | "inactive";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  phone: string;
  lastLogin: string;
  status: UserStatus;
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  judge: "Судья",
  manager: "Спортивный менеджер",
  athlete: "Спортсмен",
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Активный",
  inactive: "Неактивный",
};

function RoleIcon({ role }: { role: UserRole }) {
  if (role === "judge") {
    return <GavelIcon className="size-4 shrink-0 text-warning" aria-hidden />;
  }
  if (role === "manager") {
    return <UserCogIcon className="size-4 shrink-0 text-chart-2" aria-hidden />;
  }
  return <DumbbellIcon className="size-4 shrink-0 text-primary" aria-hidden />;
}

function buildColumns(): ColumnDef<UserItem>[] {
  return [
    {
      header: "Пользователь",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0 border border-border">
            <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
            <AvatarFallback className="text-xs font-medium">
              {row.original.name
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="font-medium text-sm text-foreground truncate">{row.original.name}</span>
            <span className="text-xs text-muted-foreground truncate">{row.original.email}</span>
          </div>
        </div>
      ),
      size: 260,
    },
    {
      header: "Название",
      accessorKey: "role",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <RoleIcon role={row.original.role} />
          <span className="text-sm text-foreground">{USER_ROLE_LABELS[row.original.role]}</span>
        </div>
      ),
      size: 200,
    },
    {
      header: "Телефон",
      accessorKey: "phone",
      cell: ({ row }) => (
        <span className="text-sm text-foreground">{row.original.phone}</span>
      ),
      size: 160,
    },
    {
      header: "Последний вход",
      accessorKey: "lastLogin",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.lastLogin}</span>
      ),
      size: 180,
    },
    {
      header: "Статус",
      accessorKey: "status",
      cell: ({ row }) => {
        const { status } = row.original;
        if (status === "active") {
          return (
            <Badge variant="secondary" className={BADGE_USER_ACTIVE}>
              {USER_STATUS_LABELS.active}
            </Badge>
          );
        }
        return (
          <Badge variant="secondary" className="rounded-md">
            {USER_STATUS_LABELS.inactive}
          </Badge>
        );
      },
      size: 130,
    },
    {
      id: "actions",
      header: () => null,
      cell: () => (
        <div
          className="flex items-center justify-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9" aria-label="Редактировать">
                <PencilLineIcon className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Редактировать</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9" aria-label="Заблокировать">
                <LockIcon className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Заблокировать</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 hover:text-destructive"
                aria-label="Удалить"
              >
                <Trash2Icon className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Удалить</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
      size: 120,
      enableSorting: false,
    },
  ];
}

type UsersDatatableProps = {
  data: UserItem[];
  onClearFilters?: () => void;
};

export function UsersDatatable({ data, onClearFilters }: UsersDatatableProps) {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: ROWS_PER_PAGE_OPTIONS[1],
  });

  const columns = buildColumns();

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
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/users/${row.original.id}`)}
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
