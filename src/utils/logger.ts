/**
 * Logger Utility
 * Conditional logging based on environment
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors
    console.error(...args);
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment && process.env.NEXT_PUBLIC_DEBUG === "true") {
      console.debug(...args);
    }
  },
} as const;
