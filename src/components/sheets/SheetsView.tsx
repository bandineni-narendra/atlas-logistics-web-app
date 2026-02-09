"use client";

import { useState, useEffect } from "react";
import { SheetSummary } from "@/types/api/sheets";
import { getSheets } from "@/api/sheets_client";
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
  const [sheets, setSheets] = useState<SheetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSheets = async () => {
      try {
        setLoading(true);
        const type = filter === "all" ? undefined : filter;
        const response = await getSheets(1, 50, type);
        setSheets(response.sheets);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sheets");
        setSheets([]);
      } finally {
        setLoading(false);
      }
    };

    loadSheets();
  }, [filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading sheets...</p>
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

  if (sheets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No sheets found</p>
        <p className="text-sm text-gray-400 mt-1">
          Create a new sheet to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sheets.map((sheet) => {
        const typeInfo = typeConfig[sheet.type];
        const statusInfo = statusConfig[sheet.status];

        return (
          <Link key={sheet.id} href={`/sheets/${sheet.id}`}>
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
                  {sheet.name}
                </h3>

                {/* Type */}
                <p className={`text-sm font-medium ${typeInfo.textColor} mb-3`}>
                  {typeInfo.label}
                </p>

                {/* Stats */}
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rows:</span>
                    <span className="font-semibold text-gray-900">
                      {sheet.rowCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Updated:</span>
                    <span>
                      {new Date(sheet.updatedAt).toLocaleDateString()}
                    </span>
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
