/**
 * Dashboard Constants
 * Centralized configuration for dashboard-related UI elements
 * TODO: These strings should be moved to i18n translations
 */

export const DASHBOARD_LABELS = {
  OVERVIEW_TITLE: 'Dashboard Overview',
  TOTAL_SHEETS: 'Total Sheets',
  TOTAL_SHEETS_SUBLABEL: 'All saved sheets',
  OCEAN_SHEETS: 'Ocean Sheets',
  OCEAN_SHEETS_SUBLABEL: '🚢 Freight rates',
  AIR_SHEETS: 'Air Sheets',
  AIR_SHEETS_SUBLABEL: '✈️ Freight rates',
  TOTAL_ROWS: 'Total Rows',
  TOTAL_ROWS_SUBLABEL: 'Data entries',
  LOADING_PLACEHOLDER: '—',
} as const;

export const STAT_CARD_COLORS = {
  DEFAULT: 'text-gray-900',
  BLUE: 'text-blue-600',
  EMERALD: 'text-emerald-600',
} as const;

export type StatCardColor = 'default' | 'blue' | 'emerald';
