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
import { ShipmentData } from "@/types/api";

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

export function validateShipmentDetails(
  shipment: ShipmentData | undefined,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!shipment || !shipment.rows || shipment.rows.length === 0) {
    return {
      isValid: false,
      issues: [
        createValidationIssue(
          "Shipment",
          1,
          "General",
          "At least one shipment dimension row is required",
          "error",
        ),
      ],
      validCount: 0,
      totalCount: 0,
    };
  }

  shipment.rows.forEach((row, index) => {
    const rowNum = index + 1;
    const sectionName = "Shipment";

    if (row.qty === "" || row.qty === undefined || row.qty <= 0) {
      issues.push(createValidationIssue(sectionName, rowNum, "Quantity", "Quantity must be a positive number", "error"));
    }

    if (row.weight === "" || row.weight === undefined || row.weight <= 0) {
      issues.push(createValidationIssue(sectionName, rowNum, "Weight", "Weight must be a positive number", "error"));
    }

    if (row.length === "" || row.length === undefined || row.length <= 0) {
      issues.push(createValidationIssue(sectionName, rowNum, "Length", "Length must be a positive number", "error"));
    }

    if (row.width === "" || row.width === undefined || row.width <= 0) {
      issues.push(createValidationIssue(sectionName, rowNum, "Width", "Width must be a positive number", "error"));
    }

    if (row.height === "" || row.height === undefined || row.height <= 0) {
      issues.push(createValidationIssue(sectionName, rowNum, "Height", "Height must be a positive number", "error"));
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
    validCount: issues.length === 0 ? 1 : 0,
    totalCount: 1,
  };
}
