/**
 * Dashboard Constants
 * Centralized configuration for dashboard-related UI elements
 * TODO: These strings should be moved to i18n translations
 */

export const DASHBOARD_LABELS = {
  OVERVIEW_TITLE: 'Overview',
  TOTAL_SHEETS: 'Total Files',
  TOTAL_SHEETS_SUBLABEL: 'All saved files',
  OCEAN_SHEETS: 'Ocean Files',
  OCEAN_SHEETS_SUBLABEL: 'Freight rates',
  AIR_SHEETS: 'Air Files',
  AIR_SHEETS_SUBLABEL: 'Freight rates',
  LOADING_PLACEHOLDER: '—',
} as const;

export const STAT_CARD_COLORS = {
  DEFAULT: 'text-textPrimary',
  BLUE: 'text-primary',
  EMERALD: 'text-success',
} as const;

export type StatCardColor = 'default' | 'blue' | 'emerald';
