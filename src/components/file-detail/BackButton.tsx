"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
    const router = useRouter();

    return (
        <div>
            <button
                onClick={() => router.back()}
                className="group inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-textSecondary bg-surface hover:bg-[var(--surface-container-highest)] hover:text-primary rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back
            </button>
        </div>
    );
}
