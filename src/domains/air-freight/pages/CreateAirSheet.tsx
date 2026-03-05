/**
 * Air Freight Domain - Create Air Sheet Page
 *
 * Domain-specific page that uses the generic SheetBuilder.
 * Injects Air Freight configuration and handles domain logic.
 */

"use client";

import { useState, useEffect } from "react";
import { SheetBuilder, Sheet } from "@/core/sheet-builder";
import { airFreightColumns } from "../config";
import { mapToAirRate, AirRate } from "../models";
import { validateAirSheets, validateShipmentDetails } from "../validation";
import { useFeedbackModal, useFileSave } from "@/hooks";
import { FeedbackModal, FileNameModal, Button } from "@/components/ui";
import { useUI } from "@/contexts/UIContext";
import { useTranslations } from "next-intl";
import { ShipmentDetails, ShipmentData } from "../components/ShipmentDetails";
import { OriginCharges, OriginChargesData } from "../components/OriginCharges";
import { AirfreightRate, AirfreightData } from "../components/AirfreightRate";
import { FinalQuotation } from "../components/FinalQuotation";

export default function CreateAirSheet() {
  const t = useTranslations("air");
  const { isSidebarCollapsed } = useUI();
  const [sheets, setSheets] = useState<Sheet[]>([]);

  // ── Copy Draft ────────────────────────────────────────
  // When the user clicks "copy" in the home table, the source file's sheets +
  // shipmentDetails are serialised into sessionStorage under "atlas-copy-draft".
  // We read them ONCE synchronously here (lazy-initializer runs before first paint).
  const [copyDraft] = useState<{ sheets: Sheet[]; shipment: ShipmentData | null } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem("atlas-copy-draft");
      if (!raw) return null;
      const draft = JSON.parse(raw) as {
        fileType: string;
        shipmentDetails?: ShipmentData | null;
        sheets: { id: string; name: string; rows: Sheet["rows"] }[];
      };
      if (draft.fileType !== "AIR") return null;
      return {
        sheets: draft.sheets.map((s) => ({
          id: s.id,
          name: s.name,
          columns: airFreightColumns,
          rows: s.rows ?? [],
        })),
        shipment: draft.shipmentDetails ?? null,
      };
    } catch {
      return null;
    }
  });

  // Clear sessionStorage once consumed so refreshing doesn't re-apply it
  useEffect(() => {
    if (copyDraft) {
      sessionStorage.removeItem("atlas-copy-draft");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [shipmentData, setShipmentData] = useState<ShipmentData | undefined>();
  const [originChargesData, setOriginChargesData] = useState<OriginChargesData | undefined>();
  const [airfreightData, setAirfreightData] = useState<AirfreightData | undefined>();
  const {
    state,
    openSuccessModal,
    closeSuccessModal,
    openErrorModal,
    closeErrorModal,
  } = useFeedbackModal();

  // File save flow with modal
  const { handleSaveFile, isSaving, fileNameModalProps } = useFileSave({
    fileType: "AIR",
    effectiveDate: new Date().toISOString().split("T")[0],
    validateSheets: (sheets) =>
      validateAirSheets(sheets, { skipEmptyRows: true }),
    validateShipment: (shipment) =>
      validateShipmentDetails(shipment),
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
    onError: (error, issues) => {
      openErrorModal("Validation Error", error, issues);
    },
  });

  const handleSheetChange = (updatedSheets: Sheet[]) => {
    setSheets(updatedSheets);
  };

  const handleSave = () => {
    handleSaveFile(sheets, shipmentData);
  };

  return (
    <div className={`container mx-auto transition-all duration-300 ${isSidebarCollapsed ? "max-w-[98%] px-2 py-4" : "max-w-[98%] p-6"}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-textPrimary mb-2">
          {t("createTitle")}
        </h1>
        <p className="text-textSecondary">
          {t("createDescription")}
        </p>
      </div>

      {/* Shipment Details Metadata */}
      <ShipmentDetails onChange={setShipmentData} initialData={copyDraft?.shipment ?? undefined} />

      {/* Origin Charges */}
      {/* 
      <OriginCharges
        actualWeight={shipmentData?.stats.grossWeight || 0}
        chargeableWeight={shipmentData?.stats.chargeableWeight || 0}
        onChange={setOriginChargesData}
      />
      */}

      {/* Airfreight Rate */}
      {/* 
      <AirfreightRate
        chargeableWeight={shipmentData?.stats.chargeableWeight || 0}
        onChange={setAirfreightData}
      />
      */}

      {/* Final Totals */}
      {/* 
      <FinalQuotation
        originTotal={originChargesData?.charges.reduce((acc, row) => {
          const rate = typeof row.rate === "number" ? row.rate : 0;
          const qty = typeof row.quantity === "number" ? row.quantity : 0;
          const min = typeof row.minimum === "number" ? row.minimum : 0;
          if (row.unit === "per kg") {
            const weightToUse = row.applyToChargeableWeight ? (shipmentData?.stats.chargeableWeight || 0) : (shipmentData?.stats.grossWeight || 0);
            return acc + Math.max(rate * weightToUse, min);
          }
          return acc + (rate * qty);
        }, 0) || 0}
        freightTotal={(typeof airfreightData?.ratePerKg === 'number' ? airfreightData.ratePerKg : 0) * (shipmentData?.stats.chargeableWeight || 0)}
      />
      */}

      {/* Rate Management Header */}
      {/* 
      <div className="mt-12 mb-6 border-t pt-8">
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Rate Management</h2>
        <p className="text-textSecondary">Manage the individual tariffs for this quotation below.</p>
      </div>
      */}

      {/* Sheet Builder */}
      <div className="mb-6">
        <SheetBuilder
          initialColumns={airFreightColumns}
          initialSheets={copyDraft?.sheets ?? undefined}
          onChange={handleSheetChange}
          multiSheet={true}
          storageKey={copyDraft ? undefined : "air-freight-sheets"}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          className="px-8 py-3"
        >
          Save
        </Button>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal state={state} onClose={closeSuccessModal} />

      {/* File Name Modal */}
      <FileNameModal {...fileNameModalProps} />
    </div>
  );
}
