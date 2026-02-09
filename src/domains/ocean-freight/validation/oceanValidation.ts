/**
 * Ocean Freight - Validation Adapter
 *
 * Converts Ocean validation logic to generic ValidationResult format.
 */

import {
  ValidationResult,
  ValidationIssue,
  createValidationIssue,
} from "@/core/feedback";
import { Sheet } from "@/core/sheet-builder";
import { mapToOceanRate, validateOceanRate } from "../models/OceanRate";

export interface OceanValidationOptions {
  skipEmptyRows?: boolean;
}

export function validateOceanSheets(
  sheets: Sheet[],
  options: OceanValidationOptions = { skipEmptyRows: true },
): ValidationResult {
  const issues: ValidationIssue[] = [];
  let validCount = 0;
  let totalProcessed = 0;

  sheets.forEach((sheet, sheetIndex) => {
    const sheetName = sheet.name || `Sheet ${sheetIndex + 1}`;

    sheet.rows.forEach((row: any, rowIndex: number) => {
      // Check if row has any data
      const hasData = Object.values(row.cells).some(
        (value) => value !== null && value !== "" && value !== undefined,
      );

      if (!hasData && options.skipEmptyRows) {
        return; // Skip completely empty rows
      }

      totalProcessed++;

      // Always validate all rows with data, don't skip
      const oceanRate = mapToOceanRate(row.cells);
      const errors = validateOceanRate(oceanRate);

      if (errors.length > 0) {
        // Convert domain errors to ValidationIssues
        errors.forEach((errorMessage) => {
          // Extract column name from error message (format: "Field name is required")
          const columnLabel = errorMessage.split(" is ")[0] || "Field";

          issues.push(
            createValidationIssue(
              sheetName,
              rowIndex + 1, // 1-based for user display
              columnLabel,
              errorMessage,
              "error",
            ),
          );
        });
      } else {
        validCount++;
      }
    });
  });

  return {
    isValid: issues.length === 0 && validCount > 0,
    issues,
    validCount,
    totalCount: totalProcessed,
  };
}
