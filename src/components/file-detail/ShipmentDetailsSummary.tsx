import React from "react";
import { ShipmentData } from "@/types/api";

interface ShipmentDetailsSummaryProps {
    shipmentDetails: ShipmentData;
}

/** Formats a unit value with its unit string, e.g. 12 + "kg" → "12 kgs" */
function fmtWeight(value: number | "", unit: string) {
    if (value === "") return "—";
    const unitLabel = unit === "lb" ? "lbs" : "kgs";
    return `${value} ${unitLabel}`;
}

function fmtDim(value: number | "", unit: string) {
    if (value === "") return "—";
    if (unit === "m") return `${value} m`;
    if (unit === "inch") return `${value} inch`;
    return `${value} cms`;
}

export function ShipmentDetailsSummary({ shipmentDetails }: ShipmentDetailsSummaryProps) {
    const { stats, rows } = shipmentDetails;

    const summaryRows = [
        { label: "Gross Weight",       value: `${stats.grossWeight.toFixed(1)} Kgs`       },
        { label: "Volumetric Weight",  value: `${stats.totalVolWeight.toFixed(1)} Kgs`    },
        { label: "Chargeable weight",  value: `${stats.chargeableWeight.toFixed(1)} Kgs`  },
        { label: "Volume",             value: `${stats.totalVolume.toFixed(2)} cbms`       },
        { label: "Units",              value: `${stats.totalQty}`                          },
    ];

    return (
        <div className="bg-surface border border-border rounded-2xl shadow-sm mb-6 overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-bold text-textPrimary">Shipment details</h3>
            </div>

            <div className="flex flex-col lg:flex-row gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
                {/* Left: per-row dimensions table */}
                {rows && rows.length > 0 && (
                    <div className="flex-1 overflow-x-auto p-4">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 px-3 font-semibold text-textSecondary text-xs uppercase tracking-wide">Quantity</th>
                                    <th className="text-left py-2 px-3 font-semibold text-textSecondary text-xs uppercase tracking-wide">Weight</th>
                                    <th className="text-left py-2 px-3 font-semibold text-textSecondary text-xs uppercase tracking-wide">Length</th>
                                    <th className="text-left py-2 px-3 font-semibold text-textSecondary text-xs uppercase tracking-wide">Width</th>
                                    <th className="text-left py-2 px-3 font-semibold text-textSecondary text-xs uppercase tracking-wide">Height</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr
                                        key={row.id || idx}
                                        className={`border-b border-border/40 last:border-0 ${idx % 2 === 0 ? "bg-background/60" : ""}`}
                                    >
                                        <td className="py-2.5 px-3 text-textPrimary">{row.qty}</td>
                                        <td className="py-2.5 px-3 text-textPrimary">{fmtWeight(row.weight, row.weightUnit)}</td>
                                        <td className="py-2.5 px-3 text-textPrimary">{fmtDim(row.length, row.lengthUnit)}</td>
                                        <td className="py-2.5 px-3 text-textPrimary">{fmtDim(row.width, row.widthUnit)}</td>
                                        <td className="py-2.5 px-3 text-textPrimary">{fmtDim(row.height, row.heightUnit)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Right: aggregated stats */}
                <div className="w-full lg:w-60 shrink-0 p-4 bg-background/40">
                    <p className="text-xs font-semibold text-textSecondary uppercase tracking-wide mb-3">Summary</p>
                    <div className="flex flex-col gap-1">
                        {summaryRows.map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between py-2 px-3 rounded-lg odd:bg-surface even:bg-transparent">
                                <span className="text-sm font-semibold text-textPrimary">{label}</span>
                                <span className="text-sm text-textSecondary font-medium">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
