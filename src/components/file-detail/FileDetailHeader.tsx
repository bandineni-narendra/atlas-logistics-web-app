"use client";

import { useState } from "react";
import { FILE_TYPE_CONFIG, FILE_STATUS_CONFIG } from "@/constants";
import type { FileDetail } from "@/types/api";
import { Calendar, Mail, Edit2, Info, X } from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui";

interface FileDetailHeaderProps {
    file: FileDetail;
}

/**
 * NotesRenderer component to parse and display notes in a structured way
 */
function NotesRenderer({ notes }: { notes?: string }) {
    if (!notes) return null;

    // Split by newlines and filter out empty lines
    const lines = notes.split("\n").map(line => line.trim()).filter(line => line.length > 0);

    return (
        <div className="space-y-4">
            {lines.map((line, index) => {
                // Check if line is a header (all caps ending with colon, or special headers)
                const isHeader = line.toUpperCase().startsWith("NOTE:") || (line.endsWith(":") && line.toUpperCase() === line);

                // Extract number if it starts with one (e.g., "1)", "1.")
                const numberMatch = line.match(/^(\d+)[).]\s+(.*)/);

                if (isHeader) {
                    return (
                        <h4 key={index} className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/10 pb-1 mb-2 mt-4 first:mt-0">
                            {line}
                        </h4>
                    );
                }

                if (numberMatch) {
                    const [, num, content] = numberMatch;
                    return (
                        <div key={index} className="flex gap-3 group">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                {num}
                            </div>
                            <p className="text-sm text-textPrimary leading-relaxed flex-1 pt-0.5">
                                {content}
                            </p>
                        </div>
                    );
                }

                // Regular text line
                return (
                    <div key={index} className="flex gap-3 pl-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 flex-shrink-0" />
                        <p className="text-sm text-textPrimary leading-relaxed">
                            {line}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export function FileDetailHeader({ file }: FileDetailHeaderProps) {
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

    return (
        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            {/* Top Row: Info and Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-textPrimary tracking-tight">
                        {file.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${FILE_TYPE_CONFIG[file.type.toLowerCase() as keyof typeof FILE_TYPE_CONFIG]?.color || ""
                                } ${FILE_TYPE_CONFIG[file.type.toLowerCase() as keyof typeof FILE_TYPE_CONFIG]?.textColor || ""
                                }`}
                        >
                            {file.type}
                        </span>
                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${FILE_STATUS_CONFIG[file.status as keyof typeof FILE_STATUS_CONFIG]?.color || ""
                                }`}
                        >
                            {file.status}
                        </span>
                        <div className="h-4 w-px bg-border mx-1" />

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-sm text-textSecondary">
                                <Calendar className="w-4 h-4" />
                                <span>Effective: {file.effectiveDate}</span>
                            </div>

                            {file.clientEmail && (
                                <>
                                    <div className="h-4 w-px bg-border mx-1" />
                                    <div className="flex items-center gap-1.5 text-sm text-textSecondary">
                                        <Mail className="w-4 h-4" />
                                        <span>To: {file.clientEmail}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-xl border border-border">
                        <span className="text-xl font-bold text-primary">{file.sheets?.length ?? 0}</span>
                        <span className="text-sm font-medium text-textSecondary">Sheets</span>
                    </div>
                    <Link
                        href={`/files/${file.id}/edit`}
                        className="flex items-center gap-2 bg-surface px-4 py-2 rounded-xl border border-border hover:bg-[var(--surface-container-highest)] hover:text-primary transition-all duration-150 shadow-sm hover:shadow"
                        title="Edit File"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                    </Link>
                </div>
            </div>

            {/* Bottom Row: Notes Trigger */}
            {file.notes && (
                <div className="pt-3 border-t border-dashed border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-textSecondary">File Notes & Conditions:</span>
                        <button
                            onClick={() => setIsNotesModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-primary bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/10 transition-all duration-150 group"
                            title="View Terms & Notes"
                        >
                            <Info className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Quick View</span>
                        </button>
                    </div>

                    <span className="text-[10px] text-textSecondary italic opacity-60">
                        Click "Quick View" to see full terms
                    </span>
                </div>
            )}

            {/* Notes Modal */}
            <Modal
                isOpen={isNotesModalOpen}
                onClose={() => setIsNotesModalOpen(false)}
                maxWidth="max-w-2xl"
            >
                <div className="flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Info className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-textPrimary">Terms & Conditions / Notes</h2>
                        </div>
                        <button
                            onClick={() => setIsNotesModalOpen(false)}
                            className="text-textSecondary hover:text-textPrimary p-2 hover:bg-surface rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar bg-surface/30">
                        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                            <NotesRenderer notes={file.notes} />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-border bg-surface flex justify-end rounded-b-xl">
                        <button
                            onClick={() => setIsNotesModalOpen(false)}
                            className="px-6 py-2 rounded-full font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
