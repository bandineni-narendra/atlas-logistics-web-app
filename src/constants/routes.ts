/**
 * Application Routes
 * Centralized route definitions
 */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  
  // Freight routes
  AIR: "/air",
  OCEAN: "/ocean",
  AIR_FREIGHT_SHEET: "/air-freight-sheet",
  OCEAN_FREIGHT_SHEET: "/ocean-freight-sheet",
  
  // File routes
  FILES: "/files",
  FILE_DETAIL: (id: string) => `/files/${id}`,
  
  // Excel flow
  EXCEL_FLOW: "/excel-flow",
} as const;
