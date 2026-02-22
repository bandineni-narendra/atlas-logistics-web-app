"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
                <p className="text-error font-medium mb-2">
                    Failed to load file details: {error.message || "Unknown error"}
                </p>
                <div className="flex gap-4 justify-center mt-4">
                    <Button
                        onClick={() => router.back()}
                        variant="secondary"
                    >
                        ← Go back
                    </Button>
                    <Button
                        onClick={() => reset()}
                    >
                        Try again
                    </Button>
                </div>
            </div>
        </div>
    );
}
