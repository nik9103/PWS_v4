"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type AddUserModalContextValue = {
  isOpen: boolean;
  openAdd: () => void;
  close: () => void;
};

const AddUserModalContext = createContext<AddUserModalContextValue | null>(null);

export function AddUserModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openAdd = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AddUserModalContext.Provider value={{ isOpen, openAdd, close }}>
      {children}
    </AddUserModalContext.Provider>
  );
}

export function useAddUserModal(): AddUserModalContextValue {
  const ctx = useContext(AddUserModalContext);
  if (!ctx) {
    throw new Error(
      "useAddUserModal must be used within AddUserModalProvider"
    );
  }
  return ctx;
}
