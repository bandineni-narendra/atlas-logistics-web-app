"use client";

import { useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { DataTable } from "@/components/table/DataTable";
import { formatCurrency } from "@/utils";
import { ColumnDef } from "@/types/table";
import { OceanFreightRow } from "@/types/ocean";
// No pagination logic here; parent controls paging

export type OceanTableProps = {
  data: OceanFreightRow[];
  isLoading?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

/**
 * Ocean freight specific table
 * Configures columns and wires DataTable
 */
export function OceanTable({
  data,
  isLoading = false,
  currentPage,
  onPageChange,
}: OceanTableProps) {
  const t = useTranslations();
  // Debug: log the data received for this table
  console.log("OceanTable data:", data);

  const pageSize = 10;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const columns: ColumnDef<OceanFreightRow>[] = useMemo(
    () => [
      { key: "origin", label: t("ocean.columns.origin"), width: "11%" },
      { key: "destination", label: t("ocean.columns.destination"), width: "11%" },
      { key: "carrier", label: t("ocean.columns.carrier"), width: "11%" },
      {
        key: "container20",
        label: t("ocean.columns.container20"),
        width: "9%",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "container40",
        label: t("ocean.columns.container40"),
        width: "9%",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "container40HQ",
        label: t("ocean.columns.container40HQ"),
        width: "9%",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "isps",
        label: t("ocean.columns.isps"),
        width: "8%",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "blFees",
        label: t("ocean.columns.blFees"),
        width: "8%",
        render: (value) => formatCurrency(value as number | null),
      },
      { key: "transitTime", label: t("ocean.columns.transitTime"), width: "9%" },
      { key: "routing", label: t("ocean.columns.routing"), width: "9%" },
      { key: "validity", label: t("ocean.columns.validity"), width: "8%" },
    ],
    [t],
  );

  const handlePageChange = useCallback(
    (page: number) => onPageChange?.(page),
    [onPageChange],
  );

  return (
    <div className="mx-8 my-6">
      <DataTable
        columns={columns}
        data={data}
        currentPage={currentPage || 1}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        emptyMessage={t("ocean.noDataAvailable")}
      />
    </div>
  );
}
