import React, { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { ChargeRow, ChargeData } from "./ChargeRow";

export interface OriginChargesData {
    charges: ChargeData[];
}

interface OriginChargesProps {
    actualWeight: number;
    chargeableWeight: number;
    onChange?: (data: OriginChargesData) => void;
    initialData?: Partial<OriginChargesData>;
}

const DEFAULT_CHARGES: Partial<ChargeData>[] = [
    { name: "Pickup Charges", rate: 0, unit: "per shipment", quantity: 1 },
    { name: "Handling Charges", rate: 0, unit: "per kg", minimum: 0, applyToChargeableWeight: true },
    { name: "Security Charges", rate: 0, unit: "per kg", minimum: 0, applyToChargeableWeight: true },
    { name: "Export Formalities", rate: 0, unit: "per declaration", quantity: 1 },
    { name: "ECS Formalities", rate: 0, unit: "per declaration", quantity: 1 },
    { name: "AWB Fee", rate: 0, unit: "per AWB", quantity: 1 },
];

export function OriginCharges({
    actualWeight,
    chargeableWeight,
    onChange,
    initialData,
}: OriginChargesProps) {
    const [charges, setCharges] = useState<ChargeData[]>(() => {
        if (initialData?.charges && initialData.charges.length > 0) {
            return initialData.charges;
        }
        return DEFAULT_CHARGES.map((c, i) => ({
            id: `charge-${i}`,
            name: c.name || "",
            rate: c.rate ?? "",
            unit: c.unit || "per shipment",
            minimum: c.minimum ?? "",
            quantity: c.quantity ?? "",
            applyToChargeableWeight: c.applyToChargeableWeight ?? false,
        }));
    });

    const handleAddCharge = () => {
        const newCharge: ChargeData = {
            id: `charge-${Date.now()}`,
            name: "",
            rate: "",
            unit: "per shipment",
            minimum: "",
            quantity: 1,
            applyToChargeableWeight: false,
        };
        const updated = [...charges, newCharge];
        setCharges(updated);
        if (onChange) onChange({ charges: updated });
    };

    const handleRemoveCharge = (id: string) => {
        if (charges.length <= 1) return;
        const updated = charges.filter((c) => c.id !== id);
        setCharges(updated);
        if (onChange) onChange({ charges: updated });
    };

    const handleChargeChange = (id: string, field: keyof ChargeData, value: any) => {
        const updated = charges.map((c) => (c.id === id ? { ...c, [field]: value } : c));
        setCharges(updated);
        if (onChange) onChange({ charges: updated });
    };

    const totalOriginCharges = useMemo(() => {
        return charges.reduce((acc, row) => {
            const rate = typeof row.rate === "number" ? row.rate : 0;
            const qty = typeof row.quantity === "number" ? row.quantity : 0;
            const min = typeof row.minimum === "number" ? row.minimum : 0;

            if (row.unit === "per kg") {
                const weightToUse = row.applyToChargeableWeight ? chargeableWeight : actualWeight;
                return acc + Math.max(rate * weightToUse, min);
            }
            return acc + (rate * qty);
        }, 0);
    }, [charges, actualWeight, chargeableWeight]);

    return (
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-border bg-surface/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-textPrimary">Origin charges</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-textSecondary font-medium">Total Origin:</span>
                    <span className="text-lg font-bold text-primary">
                        {totalOriginCharges.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <div className="min-w-[600px]">
                    {/* Headers */}
                    <div className="flex items-center gap-3 pb-2 border-b-2 border-border/60">
                        <div className="w-8"></div>
                        <div className="flex-1 grid grid-cols-6 gap-3">
                            <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Charge Name</div>
                            <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Rate</div>
                            <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Unit</div>
                            <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider text-center">Qty / Min</div>
                            <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider text-center">Chargeable</div>
                            <div className="text-xs font-semibold text-textSecondary uppercase tracking-wider text-right pr-4">Total</div>
                        </div>
                        <div className="w-8"></div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-border/30">
                        {charges.map((row, index) => (
                            <ChargeRow
                                key={row.id}
                                index={index}
                                row={row}
                                actualWeight={actualWeight}
                                chargeableWeight={chargeableWeight}
                                onChange={handleChargeChange}
                                onRemove={handleRemoveCharge}
                                canRemove={charges.length > 1}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={handleAddCharge}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add charge
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
