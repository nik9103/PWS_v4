"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type TableEmptyStateProps = {
  /** При наличии вызывается по клику «Очистить фильтр» */
  onClearFilters?: () => void;
};

export function TableEmptyState({ onClearFilters }: TableEmptyStateProps) {
  return (
    <div className="flex h-[var(--height-table-empty)] w-full min-w-0 flex-col items-center justify-center gap-2 py-8 text-center">
      <p className="text-foreground font-medium">Данные не найдены</p>
      <p className="text-muted-foreground text-sm">
        Попробуйте изменить параметры поиска или сбросить фильтры
      </p>
      {onClearFilters != null && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 gap-2 rounded-lg bg-background"
          onClick={onClearFilters}
        >
          <XIcon className="size-4" aria-hidden />
          Очистить фильтр
        </Button>
      )}
    </div>
  );
}
