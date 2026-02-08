/**
 * Air Freight Domain - Create Air Sheet Page
 *
 * Domain-specific page that uses the generic SheetBuilder.
 * Injects Air Freight configuration and handles domain logic.
 */

"use client";

import { useState } from "react";
import { SheetBuilder, Sheet } from "@/core/sheet-builder";
import { airFreightColumns } from "../config";
import { mapToAirRate, AirRate } from "../models";
import { validateAirSheets } from "../validation";
import { useFeedbackModal } from "@/hooks";

export default function CreateAirSheet() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const {
    state,
    openSuccessModal,
    closeSuccessModal,
    openErrorModal,
    closeErrorModal,
  } = useFeedbackModal();

  const handleSheetChange = (updatedSheets: Sheet[]) => {
    setSheets(updatedSheets);
  };

  const handleSave = () => {
    // Run validation using domain adapter
    const validationResult = validateAirSheets(sheets, {
      skipEmptyRows: true,
    });

    // Show validation errors if any
    if (!validationResult.isValid) {
      if (validationResult.issues.length > 0) {
        // Validation error - show message
        openErrorModal(
          "Validation Error",
          "Please fix the validation errors and try again."
        );
      } else {
        openErrorModal(
          "Error",
          "Please add at least one complete row with all required fields filled."
        );
      }
      return;
    }

    // Collect valid rates for saving
    const rates: AirRate[] = [];
    sheets.forEach((sheet) => {
      sheet.rows.forEach((row) => {
        const hasData = Object.values(row.cells).some(
          (value) => value !== null && value !== "" && value !== undefined
        );
        if (!hasData) return;

        const airRate = mapToAirRate(row.cells);
        if (airRate) {
          rates.push(airRate);
        }
      });
    });

    // All valid - save the data
    console.log("✅ Saving valid air rates:", rates);
    openSuccessModal(
      `${rates.length} air freight rate${rates.length > 1 ? "s" : ""} saved successfully!`
    );
    // Here you would typically send rates to your API
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Air Freight Rate Sheet
        </h1>
        <p className="text-gray-600">
          Create and manage air freight rates using the generic sheet builder.
        </p>
      </div>

      {/* Sheet Builder */}
      <div className="mb-6">
        <SheetBuilder
          initialColumns={airFreightColumns}
          onChange={handleSheetChange}
          multiSheet={true}
          storageKey="air-freight-sheets"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
}
