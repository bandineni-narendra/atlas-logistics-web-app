/**
 * Dashboard Constants
 * Centralized configuration for dashboard-related UI elements
 * TODO: These strings should be moved to i18n translations
 */

export const DASHBOARD_LABELS = {
  OVERVIEW_TITLE: 'Overview',
  TOTAL_SHEETS: 'Total Files',
  TOTAL_SHEETS_SUBLABEL: 'All saved files',
  OCEAN_SHEETS: 'Ocean',
  OCEAN_SHEETS_SUBLABEL: 'Ocean freight files',
  AIR_SHEETS: 'Air',
  AIR_SHEETS_SUBLABEL: 'Air freight files',
  TOTAL_ROWS: 'Rows',
  TOTAL_ROWS_SUBLABEL: 'Data entries',
  LOADING_PLACEHOLDER: '—',
} as const;

export const STAT_CARD_COLORS = {
  DEFAULT: 'text-[#202124]',
  BLUE: 'text-[#1a73e8]',
  EMERALD: 'text-[#137333]',
} as const;

export type StatCardColor = 'default' | 'blue' | 'emerald';
