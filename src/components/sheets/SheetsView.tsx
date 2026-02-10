"use client";

import { useState, useEffect } from "react";
import { FileSummary } from "@/types/file";
import { getFiles } from "@/api/files_client";
import { Card, CardContent } from "@/components/ui";
import Link from "next/link";

export interface SheetsViewProps {
  filter?: "ocean" | "air" | "all";
}

const typeConfig = {
  ocean: {
    icon: "🚢",
    color: "bg-blue-50",
    textColor: "text-blue-700",
    label: "Ocean Freight",
  },
  air: {
    icon: "✈️",
    color: "bg-emerald-50",
    textColor: "text-emerald-700",
    label: "Air Freight",
  },
};

const statusConfig = {
  draft: { label: "Draft", color: "bg-amber-100 text-amber-800" },
  saved: { label: "Saved", color: "bg-emerald-100 text-emerald-800" },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-800" },
};

export function SheetsView({ filter = "all" }: SheetsViewProps) {
  const [files, setFiles] = useState<FileSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(`[SheetsView] Rendering with filter="${filter}"`);

  // Debug: Log whenever files state changes
  useEffect(() => {
    console.log(
      `[SheetsView State Update] files.length=${files.length}, loading=${loading}, error=${error}`,
    );
    if (files.length > 0) {
      console.log(`[SheetsView State Update] Files in state:`, files);
    }
  }, [files, loading, error]);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        console.log(`[SheetsView] Loading files for filter: ${filter}`);

        const allFiles: FileSummary[] = [];

        // Determine which types to fetch
        const typesToFetch: ("AIR" | "OCEAN")[] =
          filter === "all"
            ? ["AIR", "OCEAN"]
            : [filter.toUpperCase() as "AIR" | "OCEAN"];

        console.log(`[SheetsView] Fetching types:`, typesToFetch);

        // Fetch files for each type
        for (const type of typesToFetch) {
          try {
            console.log(`[SheetsView] Fetching ${type} files...`);
            const response = await getFiles({
              type,
              page: 1,
              pageSize: 50,
            });

            console.log(`[SheetsView] ${type} response received:`, {
              hasResponse: !!response,
              responseType: typeof response,
              hasItems: !!response?.items,
              itemsType: typeof response?.items,
              itemsIsArray: Array.isArray(response?.items),
              itemsLength: response?.items?.length,
              total: response?.total,
              fullResponse: response, // Log entire response
            });

            // Safety check: ensure response has items array
            if (response && response.items && Array.isArray(response.items)) {
              console.log(
                `[SheetsView] Adding ${response.items.length} ${type} files:`,
                response.items,
              );
              allFiles.push(...response.items);
            } else {
              console.warn(
                `[SheetsView] ${type} files response missing items:`,
                response,
              );
            }
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error(
              `[SheetsView] Failed to load ${type} files:`,
              errorMsg,
            );
            setError(`Failed to load ${type} files: ${errorMsg}`);
            // Continue loading other types even if one fails
          }
        }

        console.log(`[SheetsView] Total files loaded: ${allFiles.length}`);
        console.log(`[SheetsView] Files array:`, allFiles);
        console.log(`[SheetsView] Setting state with ${allFiles.length} files`);
        setFiles(allFiles);
        setError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to load files";
        console.error(`[SheetsView] Error:`, errorMsg);
        setError(errorMsg);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          <span className="font-semibold">Error:</span> {error}
        </p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg font-medium">No files found</p>
        <p className="text-sm text-gray-400 mt-2">
          {filter === "all"
            ? "Create a new Air or Ocean freight file to get started"
            : `Create a new ${filter} freight file to get started`}
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Check the console for API details if you expect files to appear
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => {
        // Convert file type to lowercase for config lookup
        const fileTypeKey = file.type.toLowerCase() as "ocean" | "air";
        const typeInfo = typeConfig[fileTypeKey];

        // Fallback if typeInfo not found
        if (!typeInfo) {
          console.warn(
            `[SheetsView Render] Unknown file type: ${file.type}`,
            file,
          );
          return (
            <div
              key={file.id}
              className="p-4 bg-red-50 border border-red-200 rounded"
            >
              <p className="text-red-800">Unknown file type: {file.type}</p>
              <p className="text-sm text-gray-600">{file.name}</p>
            </div>
          );
        }

        const statusInfo = statusConfig[file.status];

        if (!statusInfo) {
          console.warn(
            `[SheetsView Render] Unknown status: ${file.status}`,
            file,
          );
          return (
            <div
              key={file.id}
              className="p-4 bg-yellow-50 border border-yellow-200 rounded"
            >
              <p className="text-yellow-800">Unknown status: {file.status}</p>
              <p className="text-sm text-gray-600">{file.name}</p>
            </div>
          );
        }

        return (
          <Link key={file.id} href={`/files/${file.id}`}>
            <Card
              padding="lg"
              className="h-full hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group"
            >
              <CardContent>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${typeInfo.color} flex items-center justify-center text-lg`}
                  >
                    {typeInfo.icon}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {file.name}
                </h3>

                {/* Type */}
                <p className={`text-sm font-medium ${typeInfo.textColor} mb-3`}>
                  {typeInfo.label}
                </p>

                {/* Stats */}
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sheets:</span>
                    <span className="font-semibold text-gray-900">
                      {file.sheetCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Updated:</span>
                    <span>{new Date(file.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
