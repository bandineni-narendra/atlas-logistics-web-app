/**
 * Dashboard Constants
 * Centralized configuration for dashboard-related UI elements
 * TODO: These strings should be moved to i18n translations
 */

export const DASHBOARD_LABELS = {
  OVERVIEW_TITLE: 'Overview',
  TOTAL_SHEETS: 'Total Sheets',
  TOTAL_SHEETS_SUBLABEL: 'All saved sheets',
  OCEAN_SHEETS: 'Ocean Sheets',
  OCEAN_SHEETS_SUBLABEL: 'Freight rates',
  AIR_SHEETS: 'Air Sheets',
  AIR_SHEETS_SUBLABEL: 'Freight rates',
  LOADING_PLACEHOLDER: '—',
} as const;

export const STAT_CARD_COLORS = {
  DEFAULT: 'text-textPrimary',
  BLUE: 'text-primary',
  EMERALD: 'text-success',
} as const;

export type StatCardColor = 'default' | 'blue' | 'emerald';
