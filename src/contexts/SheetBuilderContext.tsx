/**
 * Sheet Builder Context
 *
 * Provides persistent state for sheet builders across navigation.
 * Data persists in memory until page refresh.
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useRef,
  useEffect,
} from "react";
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
  undefined,
);

export function SheetBuilderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SheetBuilderState>({});
  const stateRef = useRef(state);

  // Keep ref in sync with state
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const contextValue = useMemo(
    () => ({
      getSheetState: (key: string) => stateRef.current[key],
      setSheetState: (key: string, newState: SheetBuilderState[string]) => {
        setState((prev) => ({
          ...prev,
          [key]: newState,
        }));
      },
    }),
    [],
  ); // Empty deps - functions are stable

  return (
    <SheetBuilderContext.Provider value={contextValue}>
      {children}
    </SheetBuilderContext.Provider>
  );
}

export function useSheetBuilderContext() {
  const context = useContext(SheetBuilderContext);
  if (!context) {
    throw new Error(
      "useSheetBuilderContext must be used within SheetBuilderProvider",
    );
  }
  return context;
}
