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
import { useFeedbackModal, useFileSave } from "@/hooks";
import { FeedbackModal } from "@/components/ui";
import { useUI } from "@/contexts/UIContext";
import { useTranslations } from "next-intl";

export default function CreateOceanSheet() {
  const t = useTranslations("ocean");
  const { isSidebarCollapsed } = useUI();
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const {
    state,
    openSuccessModal,
    closeSuccessModal,
    openErrorModal,
  } = useFeedbackModal();

  // File save flow with modal
  const { handleSaveFile, FileNameModalComponent } = useFileSave({
    fileType: "OCEAN",
    effectiveDate: new Date().toISOString().split("T")[0],
    validateSheets: (sheets) => validateOceanSheets(sheets, { skipEmptyRows: true }),
    onSuccess: (fileId, sheetIds) => {
      // Collect valid rates for logging
      const rates: OceanRate[] = [];
      sheets.forEach((sheet) => {
        sheet.rows.forEach((row) => {
          const hasData = Object.values(row.cells).some(
            (value) => value !== null && value !== "" && value !== undefined,
          );
          if (!hasData) return;

          const oceanRate = mapToOceanRate(row.cells);
          if (oceanRate) {
            rates.push(oceanRate);
          }
        });
      });

      console.log("✅ File saved:", { fileId, sheetIds, rates });
      openSuccessModal(
        "Success",
        `File saved successfully with ${sheetIds.length} sheet${sheetIds.length > 1 ? "s" : ""} and ${rates.length} ocean freight rate${rates.length > 1 ? "s" : ""}!`,
      );
    },
    onError: (error, issues) => {
      openErrorModal("Validation Error", error, issues);
    },
  });

  const handleSheetChange = (updatedSheets: Sheet[]) => {
    setSheets(updatedSheets);
  };

  const handleSave = () => {
    handleSaveFile(sheets);
  };

  return (
    <div className={`container mx-auto transition-all duration-300 ${isSidebarCollapsed ? "max-w-[98%] px-2 py-4" : "max-w-7xl p-6"}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--on-surface)] mb-2">
          {t("createTitle")}
        </h1>
        <p className="text-[var(--on-surface-variant)]">
          {t("createDescription")}
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
          className="px-8 py-3 bg-[var(--primary)] text-[var(--on-primary)] font-semibold rounded-md hover:bg-[var(--primary-hover)] transition-colors shadow-md hover:shadow-lg"
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
