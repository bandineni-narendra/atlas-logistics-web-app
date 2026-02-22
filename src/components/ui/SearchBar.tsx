"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, FileText, User, Plane, Ship, Loader2, X, RefreshCw } from "lucide-react";
import { useFilesQuery } from "@/hooks/queries/useFiles";
import { filesService } from "@/services/filesService";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/contexts/AuthContext";

export const SearchBar: React.FC<{ fullWidth?: boolean }> = ({ fullWidth = false }) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { user, isAuthenticated } = useAuth();
    const { data, isLoading } = useFilesQuery(
        {
            search: debouncedQuery,
            pageSize: 5,
        },
        {
            enabled: !!debouncedQuery && isAuthenticated,
        }
    );

    const results = data?.files || [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await filesService.syncSearchTerms();
            // Refresh the query
            setQuery(query + " "); // Tiny hack to trigger re-effect
            setTimeout(() => setQuery(query.trim()), 10);
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSelect = (fileId: string) => {
        router.push(`/files/${fileId}`);
        setIsOpen(false);
        setQuery("");
    };

    const clearSearch = () => {
        setQuery("");
        setIsOpen(false);
    };

    return (
        <div className={`relative ${fullWidth ? "w-full" : "w-full max-w-md"}`} ref={dropdownRef}>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {isLoading ? (
                        <Loader2 className={`${fullWidth ? "h-5 w-5" : "h-4 w-4"} text-textSecondary animate-spin`} />
                    ) : (
                        <Search className={`${fullWidth ? "h-5 w-5" : "h-4 w-4"} text-textSecondary group-focus-within:text-primary transition-colors`} />
                    )}
                </div>
                <input
                    type="text"
                    className={`block w-full pl-10 pr-10 border border-border rounded-full bg-surface text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary transition-all shadow-sm hover:shadow-md ${fullWidth ? "py-2.5 text-sm" : "py-2 text-sm"}`}
                    placeholder="Search files or clients..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-textSecondary hover:text-textPrimary"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isOpen && debouncedQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden max-h-[400px] overflow-y-auto animate-in fade-in zoom-in duration-150">
                    <div className="p-2">
                        {!isLoading && results.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-textSecondary">No results found for "{debouncedQuery}"</p>
                                <button
                                    onClick={handleSync}
                                    disabled={isSyncing}
                                    className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                                    {isSyncing ? "Syncing search data..." : "Sync search data"}
                                </button>
                                <p className="mt-2 text-[10px] text-textSecondary opacity-60 px-4">
                                    Older files might need syncing to appear in search.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-textSecondary opacity-60">
                                    Files & Clients
                                </p>
                                {results.map((file: any) => (
                                    <button
                                        key={file.id}
                                        onClick={() => handleSelect(file.id)}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface transition-colors text-left"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface flex items-center justify-center">
                                            {file.type === "AIR" ? (
                                                <Plane className="w-4 h-4 text-primary" />
                                            ) : (
                                                <Ship className="w-4 h-4 text-secondary" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-medium text-textPrimary truncate">{file.name}</p>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface text-textSecondary font-medium">
                                                    {file.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <User className="w-3 h-3 text-textSecondary" />
                                                <p className="text-xs text-textSecondary truncate">
                                                    {file.clientEmail || "No client email"}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        {isLoading && (
                            <div className="px-4 py-8 flex flex-col items-center justify-center gap-3">
                                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                                <p className="text-sm text-textSecondary">Searching Atlas...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
