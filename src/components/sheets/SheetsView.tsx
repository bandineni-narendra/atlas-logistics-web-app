"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui";
import Link from "next/link";
import { useFiles } from "@/hooks/useFiles";
import { FileType } from "@/types/file";
import { FILE_TYPE_CONFIG, FILE_STATUS_CONFIG, ROUTES } from "@/constants";
import { logger } from "@/utils";

export interface SheetsViewProps {
  filter?: "ocean" | "air" | "all";
}



export function SheetsView({ filter = "all" }: SheetsViewProps) {
  // Use the useFiles hook instead of manual API calls
  const { files, loading, error } = useFiles({ 
    type: filter as FileType | "all",
    page: 1,
    pageSize: 50,
  });

  // Memoize empty state message (must be before any early returns)
  const emptyStateMessage = useMemo(() => {
    if (filter === "all") {
      return "Create a new Air or Ocean freight file to get started";
    }
    return `Create a new ${filter} freight file to get started`;
  }, [filter]);

  logger.debug(`[SheetsView] Rendering with filter="${filter}", files=${files.length}, loading=${loading}`);

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
        <p className="text-sm text-gray-400 mt-2">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => {
        const fileTypeKey = file.type.toLowerCase() as keyof typeof FILE_TYPE_CONFIG;
        const typeInfo = FILE_TYPE_CONFIG[fileTypeKey];

        if (!typeInfo) {
          logger.warn(`[SheetsView] Unknown file type: ${file.type}`);
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

        const statusInfo = FILE_STATUS_CONFIG[file.status];

        if (!statusInfo) {
          logger.warn(`[SheetsView] Unknown status: ${file.status}`);
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
          <Link key={file.id} href={ROUTES.FILE_DETAIL(file.id)}>
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
