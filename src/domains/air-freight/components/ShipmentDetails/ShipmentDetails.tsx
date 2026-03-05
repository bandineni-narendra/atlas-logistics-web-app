"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { DimensionRow, DimensionRowData } from "./DimensionRow";

export interface ShipmentData {
    rows: DimensionRowData[];
    stats: {
        totalQty: number;
        grossWeight: number;
        totalVolWeight: number;
        chargeableWeight: number;
        totalVolume: number;
    };
}

export interface ShipmentDetailsProps {
    onChange?: (data: ShipmentData) => void;
    initialData?: Partial<ShipmentData>;
}

// Configurable constants
const DIM_FACTOR_CM_KG = 6000;

// Conversion helpers
const convertToCm = (length: number, unit: "cm" | "m" | "inch") => {
    if (unit === "m") return length * 100;
    if (unit === "inch") return length * 2.54;
    return length;
};

export function ShipmentDetails({ onChange, initialData }: ShipmentDetailsProps) {
    const [rows, setRows] = useState<DimensionRowData[]>(
        initialData?.rows && initialData.rows.length > 0
            ? initialData.rows
            : [{ id: "row-1", qty: 1, weight: "", weightUnit: "kg", length: "", lengthUnit: "cm", width: "", widthUnit: "cm", height: "", heightUnit: "cm" }]
    );

    // Manually entered fields
    const [manualGrossWeight, setManualGrossWeight] = useState<string>(
        initialData?.stats?.grossWeight != null && initialData.stats.grossWeight > 0
            ? String(initialData.stats.grossWeight)
            : ""
    );
    const [manualVolume, setManualVolume] = useState<string>(
        initialData?.stats?.totalVolume != null && initialData.stats.totalVolume > 0
            ? String(initialData.stats.totalVolume)
            : ""
    );

    // Handlers
    const handleAddRow = () => {
        const newRow: DimensionRowData = {
            id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            qty: 1,
            weight: "", weightUnit: "kg",
            length: "", lengthUnit: "cm",
            width: "", widthUnit: "cm",
            height: "", heightUnit: "cm",
        };
        const updated = [...rows, newRow];
        setRows(updated);
    };

    const handleRemoveRow = (id: string) => {
        if (rows.length <= 1) return;
        const updated = rows.filter((r) => r.id !== id);
        setRows(updated);
    };

    const handleRowChange = (id: string, field: keyof DimensionRowData, value: number | string) => {
        const updated = rows.map((r) => (r.id === id ? { ...r, [field]: value } : r));
        setRows(updated);
    };



    // Calculations based on spec
    const calculatedStats = useMemo(() => {
        let totalQty = 0;
        let totalVolWeightKgs = 0;

        rows.forEach((row) => {
            const q = typeof row.qty === "number" ? row.qty : 0;
            totalQty += q;

            // Volumetric Weight & Volume from dimensions
            if (
                typeof row.length === "number" &&
                typeof row.width === "number" &&
                typeof row.height === "number" &&
                q > 0
            ) {
                const lCm = convertToCm(row.length, row.lengthUnit);
                const wCm = convertToCm(row.width, row.widthUnit);
                const hCm = convertToCm(row.height, row.heightUnit);
                const vwKg = (lCm * wCm * hCm) / DIM_FACTOR_CM_KG;
                totalVolWeightKgs += vwKg * q;
            }
        });

        // Manual inputs
        const grossWeightKgs = manualGrossWeight !== "" ? parseFloat(manualGrossWeight) || 0 : 0;
        const totalVolumeCbm = manualVolume !== "" ? parseFloat(manualVolume) || 0 : 0;

        // Chargeable Weight = max(gross, volumetric)
        const chargeableWeightKgs = Math.max(grossWeightKgs, totalVolWeightKgs);

        return {
            totalQty,
            grossWeight: grossWeightKgs,
            totalVolWeight: totalVolWeightKgs > 0 ? Number(totalVolWeightKgs.toFixed(2)) : 0,
            chargeableWeight: chargeableWeightKgs > 0 ? Number(chargeableWeightKgs.toFixed(2)) : 0,
            totalVolume: totalVolumeCbm,
        };
    }, [rows, manualGrossWeight, manualVolume]);

    // Sync with parent when calculatedStats changes
    useEffect(() => {
        if (onChange) {
            onChange({
                rows,
                stats: calculatedStats,
            });
        }
    }, [rows, calculatedStats, onChange]);

    return (
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-border bg-surface/50">
                <h2 className="text-lg font-bold text-textPrimary">Shipment details</h2>
            </div>

            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border">
                {/* Left Side: Dimensions Table */}
                <div className="flex-[2] p-5">
                    <div className="min-w-[500px]">
                        {/* Headers */}
                        <div className="flex items-center gap-3 pb-2 border-b-2 border-border/60">
                            <div className="w-8"></div>
                            <div className="flex-1 grid grid-cols-5 gap-3">
                                <div className="text-xs font-semibold text-textSecondary">Quantity</div>
                                <div className="text-xs font-semibold text-textSecondary">Weight</div>
                                <div className="text-xs font-semibold text-textSecondary">Length</div>
                                <div className="text-xs font-semibold text-textSecondary">Width</div>
                                <div className="text-xs font-semibold text-textSecondary">Height</div>
                            </div>
                            <div className="w-8"></div>
                        </div>

                        {/* Rows */}
                        <div className="flex flex-col">
                            {rows.map((row, idx) => (
                                <DimensionRow
                                    key={row.id}
                                    index={idx}
                                    row={row}
                                    onChange={handleRowChange}
                                    onRemove={handleRemoveRow}
                                    canRemove={rows.length > 1}
                                />
                            ))}
                        </div>

                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={handleAddRow}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-md transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Row
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Summary Card */}
                <div className="flex-1 p-5 bg-background/30 flex flex-col justify-center">
                    <div className="bg-surface rounded-md border border-border overflow-hidden shadow-sm">
                        <div className="grid grid-cols-2 text-sm border-b border-border/50">
                            <div className="p-3 font-semibold text-textSecondary bg-background/50 border-r border-border/50 flex items-center">
                                Gross Weight
                            </div>
                            <div className="p-2 flex items-center gap-1">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={manualGrossWeight}
                                    onChange={(e) => setManualGrossWeight(e.target.value)}
                                    placeholder="0"
                                    className="w-full bg-transparent text-textPrimary font-medium text-sm outline-none focus:ring-1 focus:ring-primary/50 rounded px-1 py-0.5 border border-transparent focus:border-primary/40"
                                />
                                <span className="text-textMuted text-xs shrink-0">kg</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 text-sm border-b border-border/50">
                            <div className="p-3 font-semibold text-textSecondary bg-background/50 border-r border-border/50 flex items-center">
                                Volumetric Wgt
                            </div>
                            <div className="p-3 text-textPrimary font-medium flex items-center gap-1">
                                {calculatedStats.totalVolWeight} <span className="text-textMuted text-xs">kg</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 text-sm border-b border-border/50 bg-primary/5">
                            <div className="p-3 font-bold text-primary bg-background/50 border-r border-border/50 flex items-center">
                                Chargeable
                            </div>
                            <div className="p-3 text-primary font-bold flex items-center gap-1">
                                {calculatedStats.chargeableWeight} <span className="text-primary/60 text-xs">kg</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 text-sm border-b border-border/50">
                            <div className="p-3 font-semibold text-textSecondary bg-background/50 border-r border-border/50 flex items-center">
                                Volume
                            </div>
                            <div className="p-2 flex items-center gap-1">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.001"
                                    value={manualVolume}
                                    onChange={(e) => setManualVolume(e.target.value)}
                                    placeholder="0"
                                    className="w-full bg-transparent text-textPrimary font-medium text-sm outline-none focus:ring-1 focus:ring-primary/50 rounded px-1 py-0.5 border border-transparent focus:border-primary/40"
                                />
                                <span className="text-textMuted text-xs shrink-0">cbm</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 text-sm">
                            <div className="p-3 font-semibold text-textSecondary bg-background/50 border-r border-border/50 flex items-center">
                                Units
                            </div>
                            <div className="p-3 text-textPrimary font-medium flex items-center gap-1">
                                {calculatedStats.totalQty} <span className="text-textMuted text-xs">pieces</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
