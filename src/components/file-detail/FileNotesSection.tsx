"use client";
import { StickyNote } from "lucide-react";

interface FileNotesSectionProps {
    notes?: string;
}

export function FileNotesSection({ notes }: FileNotesSectionProps) {
    if (!notes) return null;

    return (
        <div className="mt-4 bg-surface text-textPrimary p-5 rounded-r-2xl border border-border border-l-4 border-l-primary shadow-sm">
            <div className="flex items-start gap-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                    <StickyNote className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-textSecondary mb-2">Terms & Conditions / Notes</h3>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-textPrimary max-h-64 overflow-y-auto custom-scrollbar pr-2">
                        {notes}
                    </div>
                </div>
            </div>
        </div>
    );
}
