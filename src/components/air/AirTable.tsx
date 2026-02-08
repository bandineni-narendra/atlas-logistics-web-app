"use client";

import { useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { DataTable } from "@/components/table/DataTable";
import { formatCurrency } from "@/utils";
import { ColumnDef } from "@/types/table";
import { AirFreightRow } from "@/types/air";

export type AirTableProps = {
  data: AirFreightRow[];
  isLoading?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onCellChange?: (
    rowIndex: number,
    key: keyof AirFreightRow,
    value: string,
  ) => void;
};

/**
 * Air freight specific table
 * Configures columns and wires DataTable
 */
export function AirTable({
  data,
  isLoading = false,
  currentPage,
  onPageChange,
  onCellChange,
}: AirTableProps) {
  const t = useTranslations();

  const pageSize = 10;
  const totalItems = data.length;

  const columns: ColumnDef<AirFreightRow>[] = useMemo(
    () => [
      { key: "origin", label: t("air.columns.origin"), width: "80px" },
      {
        key: "destination",
        label: t("air.columns.destination"),
        width: "80px",
      },
      { key: "carrier", label: t("air.columns.carrier"), width: "70px" },
      {
        key: "minimum",
        label: t("air.columns.minimum"),
        width: "80px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "rateBelow45kg",
        label: t("air.columns.rateBelow45kg"),
        width: "70px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "rate45kg",
        label: t("air.columns.rate45kg"),
        width: "70px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "rate100kg",
        label: t("air.columns.rate100kg"),
        width: "70px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "rate300kg",
        label: t("air.columns.rate300kg"),
        width: "70px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "rate500kg",
        label: t("air.columns.rate500kg"),
        width: "70px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "rate1000kg",
        label: t("air.columns.rate1000kg"),
        width: "80px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "fuelSurcharge",
        label: t("air.columns.fuelSurcharge"),
        width: "80px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "securitySurcharge",
        label: t("air.columns.securitySurcharge"),
        width: "80px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "xrayCharges",
        label: t("air.columns.xrayCharges"),
        width: "80px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "handlingCharges",
        label: t("air.columns.handlingCharges"),
        width: "80px",
        render: (value) => formatCurrency(value as number | null),
      },
      {
        key: "transitTime",
        label: t("air.columns.transitTime"),
        width: "90px",
      },
      { key: "currency", label: t("air.columns.currency"), width: "70px" },
      { key: "validity", label: t("air.columns.validity"), width: "90px" },
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
      emptyMessage={t("air.noDataAvailable")}
    />
  );
}
