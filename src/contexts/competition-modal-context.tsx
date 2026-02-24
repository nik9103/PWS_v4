"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { CompetitionItem } from "@/components/dashboard/competitions-datatable";

type CompetitionModalMode = "add" | "edit";

type CompetitionModalContextValue = {
  isOpen: boolean;
  mode: CompetitionModalMode;
  editRow: CompetitionItem | null;
  openAdd: () => void;
  openEdit: (row: CompetitionItem) => void;
  close: () => void;
};

const CompetitionModalContext = createContext<CompetitionModalContextValue | null>(
  null
);

export function CompetitionModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<CompetitionModalMode>("add");
  const [editRow, setEditRow] = useState<CompetitionItem | null>(null);

  const openAdd = useCallback(() => {
    setMode("add");
    setEditRow(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((row: CompetitionItem) => {
    setMode("edit");
    setEditRow(row);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setEditRow(null);
  }, []);

  return (
    <CompetitionModalContext.Provider
      value={{ isOpen, mode, editRow, openAdd, openEdit, close }}
    >
      {children}
    </CompetitionModalContext.Provider>
  );
}

export function useCompetitionModal(): CompetitionModalContextValue {
  const ctx = useContext(CompetitionModalContext);
  if (!ctx) {
    throw new Error(
      "useCompetitionModal must be used within CompetitionModalProvider"
    );
  }
  return ctx;
}
