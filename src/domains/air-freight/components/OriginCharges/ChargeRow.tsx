import React from "react";
import { Trash2 } from "lucide-react";

export type ChargeUnit = "per shipment" | "per kg" | "per declaration" | "per AWB";

export interface ChargeData {
    id: string;
    name: string;
    rate: number | "";
    unit: ChargeUnit;
    minimum: number | "";
    quantity: number | "";
    applyToChargeableWeight: boolean;
}

interface ChargeRowProps {
    index: number;
    row: ChargeData;
    actualWeight: number;
    chargeableWeight: number;
    onChange: (id: string, field: keyof ChargeData, value: any) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
}

export function ChargeRow({
    index,
    row,
    actualWeight,
    chargeableWeight,
    onChange,
    onRemove,
    canRemove,
}: ChargeRowProps) {
    const handleNumberChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof ChargeData
    ) => {
        const val = e.target.value;
        onChange(row.id, field, val === "" ? "" : Number(val));
    };

    const handleSelectChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        field: keyof ChargeData
    ) => {
        onChange(row.id, field, e.target.value);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(row.id, "applyToChargeableWeight", e.target.checked);
    };

    // Calculation logic based on spec
    const calculateTotal = () => {
        const rate = typeof row.rate === "number" ? row.rate : 0;
        const qty = typeof row.quantity === "number" ? row.quantity : 0;
        const min = typeof row.minimum === "number" ? row.minimum : 0;

        if (row.unit === "per kg") {
            const weightToUse = row.applyToChargeableWeight ? chargeableWeight : actualWeight;
            return Math.max(rate * weightToUse, min);
        }

        return rate * qty;
    };

    const total = calculateTotal();

    return (
        <div className="flex items-center gap-3 py-2 border-b border-border/50 group">
            <div className="w-8 text-center text-sm font-medium text-textSecondary">
                {index + 1}
            </div>

            <div className="flex-1 grid grid-cols-6 gap-3 items-center">
                {/* Charge Name */}
                <input
                    type="text"
                    value={row.name}
                    onChange={(e) => onChange(row.id, "name", e.target.value)}
                    placeholder="Charge Name"
                    className="w-full h-9 px-3 py-1.5 text-sm bg-surface border border-border rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />

                {/* Rate */}
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.rate}
                    onChange={(e) => handleNumberChange(e, "rate")}
                    placeholder="Rate"
                    className="w-full h-9 px-3 py-1.5 text-sm bg-surface border border-border rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />

                {/* Unit */}
                <select
                    value={row.unit}
                    onChange={(e) => handleSelectChange(e, "unit")}
                    className="w-full h-9 px-2 text-sm bg-surface border border-border rounded-md text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                >
                    <option value="per shipment">per shipment</option>
                    <option value="per kg">per kg</option>
                    <option value="per declaration">per declaration</option>
                    <option value="per AWB">per AWB</option>
                </select>

                {/* Minimum / Qty Mixed Field */}
                <div className="flex flex-col gap-1">
                    {row.unit === "per kg" ? (
                        <input
                            type="number"
                            min="0"
                            value={row.minimum}
                            onChange={(e) => handleNumberChange(e, "minimum")}
                            placeholder="Min"
                            className="w-full h-9 px-3 py-1.5 text-sm bg-surface border border-border rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                    ) : (
                        <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) => handleNumberChange(e, "quantity")}
                            placeholder="Qty"
                            className="w-full h-9 px-3 py-1.5 text-sm bg-surface border border-border rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                    )}
                </div>

                {/* Weight Selection (only for per kg) */}
                <div className="flex items-center justify-center">
                    {row.unit === "per kg" ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`cw-${row.id}`}
                                checked={row.applyToChargeableWeight}
                                onChange={handleCheckboxChange}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                            />
                            <label htmlFor={`cw-${row.id}`} className="text-[10px] leading-tight text-textSecondary uppercase font-bold">
                                Use CW
                            </label>
                        </div>
                    ) : (
                        <span className="text-textMuted text-xs">-</span>
                    )}
                </div>

                {/* Total */}
                <div className="text-right pr-4 font-bold text-sm text-textPrimary">
                    {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            </div>

            <div className="w-8 flex justify-center">
                <button
                    type="button"
                    onClick={() => onRemove(row.id)}
                    disabled={!canRemove}
                    className={`p-1.5 rounded-md transition-colors ${canRemove
                            ? "text-error/70 hover:text-error hover:bg-error/10"
                            : "text-textMuted opacity-50 cursor-not-allowed"
                        } opacity-0 group-hover:opacity-100 focus:opacity-100`}
                    title="Remove charge"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
