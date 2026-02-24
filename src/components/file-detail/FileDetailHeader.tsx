"use client";

import { FILE_TYPE_CONFIG, FILE_STATUS_CONFIG } from "@/constants";
import type { FileDetail } from "@/types/api";
import { Calendar, Mail, Edit2 } from "lucide-react";
import Link from "next/link";

interface FileDetailHeaderProps {
    file: FileDetail;
}

export function FileDetailHeader({ file }: FileDetailHeaderProps) {
    return (
        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
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
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-xl border border-border">
                        <span className="text-xl font-bold text-primary">{file.sheets?.length ?? 0}</span>
                        <span className="text-sm font-medium text-textSecondary">Sheets</span>
                    </div>
                    <Link
                        href={`/files/${file.id}/edit`}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-border hover:bg-surface hover:text-primary transition-colors duration-150"
                        title="Edit File"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
