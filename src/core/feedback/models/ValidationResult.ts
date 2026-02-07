/**
 * Core Feedback - Validation Result Models
 *
 * Generic validation result types used across all domains.
 * Domain-agnostic and reusable.
 */

export interface ValidationIssue {
  sheetName: string;
  rowIndex: number; // 1-based index for user display
  columnLabel: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  validCount?: number; // Number of valid rows
  totalCount?: number; // Total rows processed
}

export function createValidationIssue(
  sheetName: string,
  rowIndex: number,
  columnLabel: string,
  message: string,
  severity: "error" | "warning" = "error"
): ValidationIssue {
  return {
    sheetName,
    rowIndex,
    columnLabel,
    message,
    severity,
  };
}
