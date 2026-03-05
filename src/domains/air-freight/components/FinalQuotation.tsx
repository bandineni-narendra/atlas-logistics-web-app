import React from "react";

interface FinalQuotationProps {
    originTotal: number;
    freightTotal: number;
    destinationTotal?: number;
    currency?: string;
}

export function FinalQuotation({
    originTotal,
    freightTotal,
    destinationTotal = 0,
    currency = "€",
}: FinalQuotationProps) {
    const grandTotal = originTotal + freightTotal + destinationTotal;

    return (
        <div className="bg-surface border-t-4 border-primary rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="px-6 py-5 border-b border-border bg-background/50">
                <h2 className="text-xl font-bold text-textPrimary uppercase tracking-tight">Final Quotation Summary</h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-1">
                    <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">Origin Charges</span>
                    <div className="text-2xl font-bold text-textPrimary">
                        {currency} {originTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">Airfreight Cost</span>
                    <div className="text-2xl font-bold text-textPrimary">
                        {currency} {freightTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">Destination</span>
                    <div className="text-2xl font-bold text-textPrimary">
                        {currency} {destinationTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="bg-primary p-4 rounded-lg shadow-inner flex flex-col justify-center items-end">
                    <span className="text-xs font-bold text-white/80 uppercase tracking-widest mb-1">Grand Total</span>
                    <div className="text-3xl font-black text-white">
                        {currency} {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            </div>
        </div>
    );
}
