"use client";

/**
 * Loading State — M3 circular progress
 */
export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="relative inline-block w-10 h-10 mb-3">
          <div className="w-10 h-10 border-[3px] border-surface rounded-full" />
          <div className="absolute top-0 left-0 w-10 h-10 border-[3px] border-primary rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-textSecondary">Loading...</p>
      </div>
    </div>
  );
}
