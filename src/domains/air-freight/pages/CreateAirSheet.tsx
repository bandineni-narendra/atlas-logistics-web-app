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
import { useFeedbackModal, useFileSave } from "@/hooks";
import { FeedbackModal } from "@/components/ui";

export default function CreateAirSheet() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const {
    state,
    openSuccessModal,
    closeSuccessModal,
    openErrorModal,
    closeErrorModal,
  } = useFeedbackModal();

  // File save flow with modal
  const { handleSaveFile, isSaving, FileNameModalComponent } = useFileSave({
    fileType: "AIR",
    effectiveDate: new Date().toISOString().split("T")[0],
    validateSheets: (sheets) =>
      validateAirSheets(sheets, { skipEmptyRows: true }),
    onSuccess: (fileId, sheetIds) => {
      // Collect valid rates for logging
      const rates: AirRate[] = [];
      sheets.forEach((sheet) => {
        sheet.rows.forEach((row) => {
          const hasData = Object.values(row.cells).some(
            (value) => value !== null && value !== "" && value !== undefined,
          );
          if (!hasData) return;

          const airRate = mapToAirRate(row.cells);
          if (airRate) {
            rates.push(airRate);
          }
        });
      });

      console.log("✅ File saved:", { fileId, sheetIds, rates });
      openSuccessModal(
        "Success",
        `File saved successfully with ${sheetIds.length} sheet${sheetIds.length > 1 ? "s" : ""} and ${rates.length} air freight rate${rates.length > 1 ? "s" : ""}!`,
      );
    },
    onError: (error) => {
      openErrorModal("Validation Error", error);
    },
  });

  const handleSheetChange = (updatedSheets: Sheet[]) => {
    setSheets(updatedSheets);
  };

  const handleSave = () => {
    handleSaveFile(sheets);
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

      {/* Feedback Modal */}
      <FeedbackModal state={state} onClose={closeSuccessModal} />

      {/* File Name Modal */}
      {FileNameModalComponent}
    </div>
  );
}
