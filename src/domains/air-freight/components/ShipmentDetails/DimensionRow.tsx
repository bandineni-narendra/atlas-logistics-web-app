import React from "react";
import { Plus, Trash2 } from "lucide-react";

export interface DimensionRowData {
    id: string;
    qty: number | "";
    weight: number | "";
    weightUnit: "kg" | "lb";
    length: number | "";
    lengthUnit: "cm" | "m" | "inch";
    width: number | "";
    widthUnit: "cm" | "m" | "inch";
    height: number | "";
    heightUnit: "cm" | "m" | "inch";
}

interface DimensionRowProps {
    index: number;
    row: DimensionRowData;
    onChange: (id: string, field: keyof DimensionRowData, value: number | string) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
}

export function DimensionRow({ index, row, onChange, onRemove, canRemove }: DimensionRowProps) {
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof DimensionRowData) => {
        const val = e.target.value;
        onChange(row.id, field, val === "" ? "" : Number(val));
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof DimensionRowData) => {
        onChange(row.id, field, e.target.value);
    };

    return (
        <div className="flex items-center gap-3 py-2 border-b border-border/50 group">
            <div className="w-8 text-center text-sm font-medium text-textSecondary">
                {index + 1}
            </div>

            <div className="flex-1 grid grid-cols-5 gap-3">
                <input
                    type="number"
                    min="1"
                    value={row.qty}
                    onChange={(e) => handleNumberChange(e, "qty")}
                    placeholder="Qty"
                    className="w-full h-9 px-3 py-1.5 text-sm bg-surface border border-border rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                <div className="flex relative">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={row.weight}
                        onChange={(e) => handleNumberChange(e, "weight")}
                        placeholder="Weight"
                        className="w-full h-9 pl-2 pr-12 text-sm bg-surface border border-border rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                    <select
                        value={row.weightUnit}
                        onChange={(e) => handleUnitChange(e, "weightUnit")}
                        className="absolute right-0 top-0 bottom-0 py-0 pl-1 pr-6 bg-transparent text-xs text-textSecondary font-medium border-l border-border/50 focus:outline-none focus:ring-0 cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
                    >
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                    </select>
                </div>
                <div className="flex relative">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={row.length}
                        onChange={(e) => handleNumberChange(e, "length")}
                        placeholder="Length"
                        className="w-full h-9 pl-2 pr-12 text-sm bg-surface border border-border rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                    <select
                        value={row.lengthUnit}
                        onChange={(e) => handleUnitChange(e, "lengthUnit")}
                        className="absolute right-0 top-0 bottom-0 py-0 pl-1 pr-6 bg-transparent text-xs text-textSecondary font-medium border-l border-border/50 focus:outline-none focus:ring-0 cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
                    >
                        <option value="cm">cm</option>
                        <option value="m">m</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
                <div className="flex relative">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={row.width}
                        onChange={(e) => handleNumberChange(e, "width")}
                        placeholder="Width"
                        className="w-full h-9 pl-2 pr-12 text-sm bg-surface border border-border rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                    <select
                        value={row.widthUnit}
                        onChange={(e) => handleUnitChange(e, "widthUnit")}
                        className="absolute right-0 top-0 bottom-0 py-0 pl-1 pr-6 bg-transparent text-xs text-textSecondary font-medium border-l border-border/50 focus:outline-none focus:ring-0 cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
                    >
                        <option value="cm">cm</option>
                        <option value="m">m</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
                <div className="flex relative">
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={row.height}
                        onChange={(e) => handleNumberChange(e, "height")}
                        placeholder="Height"
                        className="w-full h-9 pl-2 pr-12 text-sm bg-surface border border-border rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                    <select
                        value={row.heightUnit}
                        onChange={(e) => handleUnitChange(e, "heightUnit")}
                        className="absolute right-0 top-0 bottom-0 py-0 pl-1 pr-6 bg-transparent text-xs text-textSecondary font-medium border-l border-border/50 focus:outline-none focus:ring-0 cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
                    >
                        <option value="cm">cm</option>
                        <option value="m">m</option>
                        <option value="inch">inch</option>
                    </select>
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
                    title="Remove row"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
