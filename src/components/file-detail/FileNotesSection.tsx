"use client";
import { StickyNote } from "lucide-react";

interface FileNotesSectionProps {
    notes?: string;
}

export function FileNotesSection({ notes }: FileNotesSectionProps) {
    if (!notes) return null;

    return (
        <div className="mt-4 bg-[var(--secondary-container)] text-[var(--on-secondary-container)] p-4 rounded-2xl border border-[var(--outline-variant)] shadow-sm">
            <div className="flex items-start gap-3">
                <div className="mt-0.5">
                    <StickyNote className="w-5 h-5 opacity-70" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-1">Session Notes</h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {notes}
                    </p>
                </div>
            </div>
        </div>
    );
}
