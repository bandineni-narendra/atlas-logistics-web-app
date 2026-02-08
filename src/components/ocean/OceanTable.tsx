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
  onCellChange?: (
    rowIndex: number,
    key: keyof OceanFreightRow,
    value: string,
  ) => void;
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
  onCellChange,
}: OceanTableProps) {
  const t = useTranslations();
  // Debug: log the data received for this table
  console.log("OceanTable data:", data);

  const pageSize = 10;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const columns: ColumnDef<OceanFreightRow>[] = useMemo(
    () => [
      { key: "origin", label: t("ocean.columns.origin"), width: "100px" },
      {
        key: "destination",
        label: t("ocean.columns.destination"),
        width: "100px",
      },
      { key: "carrier", label: t("ocean.columns.carrier"), width: "100px" },
      {
        key: "container20",
        label: t("ocean.columns.container20"),
        width: "90px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "container40",
        label: t("ocean.columns.container40"),
        width: "90px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "container40HQ",
        label: t("ocean.columns.container40HQ"),
        width: "100px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "isps",
        label: t("ocean.columns.isps"),
        width: "80px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "blFees",
        label: t("ocean.columns.blFees"),
        width: "80px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "transitTime",
        label: t("ocean.columns.transitTime"),
        width: "100px",
      },
      { key: "routing", label: t("ocean.columns.routing"), width: "100px" },
      { key: "validity", label: t("ocean.columns.validity"), width: "100px" },
    ],
    [t],
  );

  const handlePageChange = useCallback(
    (page: number) => onPageChange?.(page),
    [onPageChange],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      currentPage={currentPage || 1}
      pageSize={pageSize}
      totalItems={totalItems}
      onPageChange={handlePageChange}
      onCellChange={onCellChange}
      isLoading={isLoading}
      emptyMessage={t("ocean.noDataAvailable")}
    />
  );
}
