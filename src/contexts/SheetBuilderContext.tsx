/**
 * Sheet Builder Context
 * 
 * Provides persistent state for sheet builders across navigation.
 * Data persists in memory until page refresh.
 */

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Sheet } from "@/core/sheet-builder";

interface SheetBuilderState {
  [key: string]: {
    sheets: Sheet[];
    activeSheetId: string;
    nextSheetId: number;
  };
}

interface SheetBuilderContextType {
  getSheetState: (key: string) => SheetBuilderState[string] | undefined;
  setSheetState: (key: string, state: SheetBuilderState[string]) => void;
}

const SheetBuilderContext = createContext<SheetBuilderContextType | undefined>(
  undefined
);

export function SheetBuilderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SheetBuilderState>({});

  const getSheetState = (key: string) => state[key];

  const setSheetState = (key: string, newState: SheetBuilderState[string]) => {
    setState((prev) => ({
      ...prev,
      [key]: newState,
    }));
  };

  return (
    <SheetBuilderContext.Provider value={{ getSheetState, setSheetState }}>
      {children}
    </SheetBuilderContext.Provider>
  );
}

export function useSheetBuilderContext() {
  const context = useContext(SheetBuilderContext);
  if (!context) {
    throw new Error(
      "useSheetBuilderContext must be used within SheetBuilderProvider"
    );
  }
  return context;
}
