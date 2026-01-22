// Formatting utilities (framework-agnostic)

export function formatSheetName(name: string, fallback: string): string {
  if (typeof name === "string" && name.length > 0) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  return fallback;
}

/**
 * Format a number as currency (USD)
 * Returns "—" if value is null/undefined
 */
export function formatCurrency(value: number | null | undefined): string {
  return value != null ? `$${value.toLocaleString()}` : "—";
}

/**
 * Get confidence color class based on percentage
 */
export function getConfidenceColor(confidencePercent: number): string {
  if (confidencePercent >= 80) return "text-green-600";
  if (confidencePercent >= 60) return "text-yellow-600";
  return "text-red-600";
}
