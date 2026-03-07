/**
 * AirlineCombobox
 *
 * Searchable dropdown for airline name or IATA code fields.
 * - Search by name or code regardless of which field is displayed.
 * - Renders the dropdown via a React portal so it escapes table overflow clipping.
 * - Selecting a value calls onChange with the stored field value.
 *   The linked column auto-fill happens at SheetBuilder level via `linkedColumn`.
 */

"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, X } from "lucide-react";
import { AIRLINES, AirlineData } from "@/constants/airlines";

export interface AirlineComboboxProps {
  /** Currently stored value (airline name or IATA code). */
  value: string | null;
  /** Called with the newly selected primary field value. */
  onChange: (value: string | null) => void;
  /**
   * Which field this column stores.
   * 'name' → the cell holds the airline name.
   * 'code' → the cell holds the IATA code.
   */
  displayField: "name" | "code";
  placeholder?: string;
  /**
   * Called when the user presses Ctrl+D explicitly inside the combobox.
   * Helps bypass complex React Portal event bubbling issues.
   */
  onFillDown?: () => void;
}

const BASE_INPUT =
  "w-full h-full px-2 py-1.5 text-xs font-normal text-textPrimary placeholder:text-textSecondary bg-transparent border-0 outline-none focus:ring-0 cursor-pointer";

export function AirlineCombobox({
  value,
  onChange,
  displayField,
  placeholder,
  onFillDown,
}: AirlineComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const triggerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [rect, setRect] = useState<DOMRect | null>(null);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = AIRLINES.filter((a) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
    );
  });

  // ── Open / close helpers ───────────────────────────────────────────────────
  const openDropdown = useCallback(() => {
    if (!triggerRef.current) return;
    setRect(triggerRef.current.getBoundingClientRect());
    setOpen(true);
    setHighlighted(0);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  // ── Select an airline ──────────────────────────────────────────────────────
  const handleSelect = useCallback(
    (airline: AirlineData) => {
      onChange(displayField === "name" ? airline.name : airline.code);
      closeDropdown();
      setTimeout(() => triggerRef.current?.focus(), 0);
    },
    [onChange, displayField, closeDropdown],
  );

  // ── Clear selection ────────────────────────────────────────────────────────
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange],
  );

  // ── Click-outside to close ─────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    // Focus the search input once the dropdown renders
    setTimeout(() => searchRef.current?.focus(), 0);

    const onMousedown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        closeDropdown();
      }
    };

    const onFocusOut = (e: FocusEvent) => {
      const target = (e.relatedTarget as Node) || null;
      if (
        !triggerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", onMousedown);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("mousedown", onMousedown);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [open, closeDropdown]);

  // ── Re-position on scroll / resize while open ─────────────────────────────
  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  // ── Keyboard navigation ────────────────────────────────────────────────────
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Specifically block Ctrl+D from bubbling to the browser's bookmark shortcut
    // specifically bypass complex React Portal event bubbling issues.
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
      if (e.shiftKey) return; // Let Ctrl+Shift+D bubble to the global Row Duplicator
      e.preventDefault();
      closeDropdown();
      onFillDown?.();
      setTimeout(() => triggerRef.current?.focus(), 0);
      return;
    }

    // We strictly require Shift to cycle options, so bare arrows can be used for grid navigation
    if (e.shiftKey && e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.shiftKey && e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) handleSelect(filtered[highlighted]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown();
      setTimeout(() => triggerRef.current?.focus(), 0);
    }
  };

  // ── Compute dropdown rect ──────────────────────────────────────────────────
  const dropdownStyle: React.CSSProperties = rect
    ? {
      position: "fixed",
      top: rect.bottom + 2,
      left: rect.left,
      width: Math.max(rect.width, 240),
      zIndex: 99999,
    }
    : { display: "none" };

  const displayValue = value ?? "";

  return (
    <div ref={triggerRef} className="relative w-full h-full">
      {/* ── Trigger ───────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-1 w-full h-full px-2 py-1.5 cursor-pointer select-none focus:outline-none"
        onClick={openDropdown}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
            if (e.shiftKey) return; // Let Ctrl+Shift+D bubble to the global Row Duplicator
            e.preventDefault();
            onFillDown?.();
            return;
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDropdown();
          }
        }}
        role="combobox"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span
          className={`flex-1 text-xs truncate ${displayValue ? "text-textPrimary" : "text-textSecondary"
            }`}
        >
          {displayValue ||
            placeholder ||
            (displayField === "name" ? "Select airline…" : "Select code…")}
        </span>

        {displayValue && (
          <button
            type="button"
            className="flex-shrink-0 text-textSecondary hover:text-error transition-colors"
            onClick={handleClear}
            tabIndex={-1}
            aria-label="Clear"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        <ChevronDown
          className={`w-3 h-3 flex-shrink-0 text-textSecondary transition-transform duration-150 ${open ? "rotate-180" : ""
            }`}
        />
      </div>

      {/* ── Portal dropdown ───────────────────────────────────────────────── */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="bg-surface border border-border rounded-xl shadow-xl overflow-hidden"
            role="listbox"
          >
            {/* Search bar */}
            <div className="flex items-center gap-2.5 px-3 py-3 border-b border-border focus-within:ring-0 focus-within:outline-none focus-within:border-border">
              <Search className="w-4 h-4 text-textSecondary flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlighted(0);
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-0 text-base bg-transparent outline-none ring-0 focus:outline-none focus:ring-0 text-textPrimary placeholder:text-textSecondary"
                placeholder="Search by name or code…"
                aria-label="Search airlines"
              />
              <button
                type="button"
                onClick={() => setSearch("")}
                className={`flex-shrink-0 text-textSecondary hover:text-textPrimary transition-colors ${search ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                tabIndex={-1}
                aria-hidden={!search}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Results */}
            <div
              className="max-h-52 overflow-y-auto"
              role="presentation"
              onMouseDown={(e) => e.preventDefault()}
            >
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-xs text-textSecondary text-center">
                  No airlines found
                </div>
              ) : (
                filtered.map((airline, idx) => {
                  const isHighlighted = idx === highlighted;
                  const isSelected =
                    displayField === "name"
                      ? airline.name === displayValue
                      : airline.code === displayValue;

                  return (
                    <div
                      key={airline.code}
                      role="option"
                      aria-selected={isSelected}
                      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors duration-100 ${isHighlighted
                        ? "bg-primary-soft"
                        : isSelected
                          ? "bg-primary/10"
                          : "hover:bg-surface"
                        }`}
                      onMouseEnter={() => setHighlighted(idx)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(airline);
                      }}
                    >
                      {/* IATA code badge */}
                      <span className="inline-flex items-center justify-center w-9 h-5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary flex-shrink-0">
                        {airline.code}
                      </span>
                      {/* Airline name */}
                      <span className="text-xs text-textPrimary truncate">
                        {airline.name}
                      </span>
                      {/* Checkmark for active selection */}
                      {isSelected && (
                        <span className="ml-auto text-primary text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
