import React from "react";
import { Popover } from "./Popover";
import { X } from "lucide-react";

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface DateRangePickerProps {
    isOpen: boolean;
    onClose: () => void;
    range: DateRange;
    onChange: (range: DateRange) => void;
    anchorRef: React.RefObject<HTMLElement | null>;
}

/**
 * Simple Date Range Picker Popover
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    isOpen,
    onClose,
    range,
    onChange,
    anchorRef,
}) => {
    // Popover now handles click-outside and positioning

    return (
        <Popover
            isOpen={isOpen}
            onClose={onClose}
            anchorRef={anchorRef}
            className="p-4 bg-[var(--surface-container)] rounded-xl shadow-lg border border-[var(--outline-variant)] w-72"
        >
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-[var(--on-surface)]">Select Date Range</h4>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-[var(--on-surface-variant)] mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={range.startDate}
                        onChange={(e) => onChange({ ...range, startDate: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--surface-container-highest)] border border-[var(--outline)] rounded-md text-sm text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-[var(--on-surface-variant)] mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={range.endDate}
                        onChange={(e) => onChange({ ...range, endDate: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--surface-container-highest)] border border-[var(--outline)] rounded-md text-sm text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>
            </div>
        </Popover>
    );
};
