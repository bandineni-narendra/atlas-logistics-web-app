export default function Loading() {
    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-textSecondary text-sm">Loading file…</p>
            </div>
        </div>
    );
}
