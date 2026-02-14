/**
 * Air Freight - Validation Adapter
 *
 * Converts Air validation logic to generic ValidationResult format.
 */

import {
  ValidationResult,
  ValidationIssue,
  createValidationIssue,
} from "@/core/feedback";
import { Sheet } from "@/core/sheet-builder";
import { mapToAirRate, validateAirRate } from "../models/AirRate";

export interface AirValidationOptions {
  skipEmptyRows?: boolean;
}

export function validateAirSheets(
  sheets: Sheet[],
  options: AirValidationOptions = { skipEmptyRows: true },
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
      const airRate = mapToAirRate(row.cells);
      if (!airRate) {
        issues.push(
          createValidationIssue(
            sheetName,
            rowIndex + 1,
            "Row",
            "Failed to parse air freight rate data",
            "error",
          ),
        );
        return;
      }
      const errors = validateAirRate(airRate);

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
