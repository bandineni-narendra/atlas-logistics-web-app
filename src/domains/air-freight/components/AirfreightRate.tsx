import React, { useState, useEffect } from "react";

export interface AirfreightData {
    airline: string;
    ratePerKg: number | "";
    weightBreak: string;
}

interface AirfreightRateProps {
    chargeableWeight: number;
    onChange?: (data: AirfreightData) => void;
    initialData?: Partial<AirfreightData>;
}

export function AirfreightRate({
    chargeableWeight,
    onChange,
    initialData,
}: AirfreightRateProps) {
    const [airline, setAirline] = useState(initialData?.airline || "");
    const [ratePerKg, setRatePerKg] = useState<number | "">(initialData?.ratePerKg || "");
    const [weightBreak, setWeightBreak] = useState(initialData?.weightBreak || "+45kg");

    useEffect(() => {
        if (onChange) {
            onChange({ airline, ratePerKg, weightBreak });
        }
    }, [airline, ratePerKg, weightBreak, onChange]);

    const freightCost = (typeof ratePerKg === "number" ? ratePerKg : 0) * chargeableWeight;

    return (
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-border bg-surface/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-textPrimary">Airfreight</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-textSecondary font-medium">Freight Cost:</span>
                    <span className="text-lg font-bold text-primary">
                        {freightCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-wrap gap-6 items-end">
                <div className="flex flex-col gap-1.5 min-w-[200px]">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Airline</label>
                    <input
                        type="text"
                        value={airline}
                        onChange={(e) => setAirline(e.target.value)}
                        placeholder="e.g. Emirates"
                        className="w-full h-10 px-3 py-2 text-sm bg-surface border border-border rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-1.5 w-32">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Rate / Kg</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={ratePerKg}
                            onChange={(e) => setRatePerKg(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="0.00"
                            className="w-full h-10 pl-3 pr-8 text-sm bg-surface border border-border rounded-md text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-textMuted font-bold">€</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 w-40">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Weight Break</label>
                    <select
                        value={weightBreak}
                        onChange={(e) => setWeightBreak(e.target.value)}
                        className="w-full h-10 px-3 text-sm bg-surface border border-border rounded-md text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                    >
                        <option value="Min">Min</option>
                        <option value="Normal">Normal</option>
                        <option value="-45kg">-45kg</option>
                        <option value="+45kg">+45kg</option>
                        <option value="+100kg">+100kg</option>
                        <option value="+300kg">+300kg</option>
                        <option value="+500kg">+500kg</option>
                        <option value="+1000kg">+1000kg</option>
                    </select>
                </div>

                <div className="flex-1"></div>

                <div className="bg-primary/5 border border-primary/20 rounded-md p-3 px-5 flex flex-col items-end">
                    <span className="text-[10px] font-bold text-primary uppercase">Calculation Summary</span>
                    <div className="text-sm font-medium text-textSecondary">
                        {chargeableWeight} kg × {typeof ratePerKg === 'number' ? ratePerKg.toFixed(2) : '0.00'} €/kg
                    </div>
                </div>
            </div>
        </div>
    );
}
