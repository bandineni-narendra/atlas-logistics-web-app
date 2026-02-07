/**
 * Ocean Freight Domain - Create Ocean Sheet Page
 *
 * Domain-specific page that uses the generic SheetBuilder.
 * Injects Ocean Freight configuration and handles domain logic.
 */

"use client";

import { useState } from "react";
import { SheetBuilder, Sheet } from "@/core/sheet-builder";
import { oceanFreightColumns } from "../config";
import { mapToOceanRate, OceanRate } from "../models";
import { validateOceanSheets } from "../validation";
import {
  useFeedbackModal,
  ValidationModal,
  SuccessModal,
  ErrorModal,
} from "@/core/feedback";

export default function CreateOceanSheet() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const {
    state,
    openValidationModal,
    closeValidationModal,
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
    const validationResult = validateOceanSheets(sheets, {
      skipEmptyRows: true,
    });

    // Show validation errors if any
    if (!validationResult.isValid) {
      if (validationResult.issues.length > 0) {
        openValidationModal(validationResult);
      } else {
        openErrorModal(
          "Please add at least one complete row with all required fields filled."
        );
      }
      return;
    }

    // Collect valid rates for saving
    const rates: OceanRate[] = [];
    sheets.forEach((sheet) => {
      sheet.rows.forEach((row) => {
        const hasData = Object.values(row.cells).some(
          (value) => value !== null && value !== "" && value !== undefined
        );
        if (!hasData) return;

        const oceanRate = mapToOceanRate(row.cells);
        if (oceanRate) {
          rates.push(oceanRate);
        }
      });
    });

    // All valid - save the data
    console.log("✅ Saving valid ocean rates:", rates);
    openSuccessModal(
      `${rates.length} ocean freight rate${rates.length > 1 ? "s" : ""} saved successfully!`
    );
    // Here you would typically send rates to your API
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ocean Freight Rate Sheet
        </h1>
        <p className="text-gray-600">
          Create and manage ocean freight rates using the generic sheet builder.
        </p>
      </div>

      {/* Sheet Builder */}
      <div className="mb-6">
        <SheetBuilder
          initialColumns={oceanFreightColumns}
          onChange={handleSheetChange}
          multiSheet={true}
          storageKey="ocean-freight-sheets"
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

      {/* Modals */}
      <ValidationModal
        isOpen={state.validation.isOpen}
        onClose={closeValidationModal}
        result={state.validation.result!}
      />
      <SuccessModal
        isOpen={state.success.isOpen}
        onClose={closeSuccessModal}
        message={state.success.message}
        title={state.success.title}
      />
      <ErrorModal
        isOpen={state.error.isOpen}
        onClose={closeErrorModal}
        message={state.error.message}
        title={state.error.title}
        detail={state.error.detail}
      />
    </div>
  );
}
