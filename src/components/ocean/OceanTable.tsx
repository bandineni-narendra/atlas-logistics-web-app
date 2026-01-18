"use client";

import { DataTable } from "@/components/table/DataTable";
import { ColumnDef } from "@/types/table";
import { OceanFreightRow } from "@/types/ocean";
import { usePagination } from "@/hooks/pagination/usePagination";

export type OceanTableProps = {
  data: OceanFreightRow[];
  isLoading?: boolean;
};

/**
 * Ocean freight specific table
 * Configures columns and wires DataTable
 */
export function OceanTable({ data, isLoading = false }: OceanTableProps) {
  const { currentPage, pageSize, totalPages, startIndex, onPageChange } =
    usePagination(data.length, { pageSize: 10 });

  const columns: ColumnDef<OceanFreightRow>[] = [
    { key: "origin", label: "Origin", width: "11%" },
    { key: "destination", label: "Destination", width: "11%" },
    { key: "carrier", label: "Carrier", width: "11%" },
    {
      key: "container20",
      label: "20FT",
      width: "9%",
      render: (value) => (value ? `$${value.toLocaleString()}` : "—"),
    },
    {
      key: "container40",
      label: "40FT",
      width: "9%",
      render: (value) => (value ? `$${value.toLocaleString()}` : "—"),
    },
    {
      key: "container40HQ",
      label: "40HQ",
      width: "9%",
      render: (value) => (value ? `$${value.toLocaleString()}` : "—"),
    },
    {
      key: "isps",
      label: "ISPS",
      width: "8%",
      render: (value) => (value ? `$${value.toLocaleString()}` : "—"),
    },
    {
      key: "blFees",
      label: "BL Fees",
      width: "8%",
      render: (value) => (value ? `$${value.toLocaleString()}` : "—"),
    },
    { key: "transitTime", label: "Transit Time", width: "9%" },
    { key: "routing", label: "Routing", width: "9%" },
    { key: "validity", label: "Validity", width: "8%" },
  ];

  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="mx-8 my-6">
      <DataTable
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={data.length}
        onPageChange={onPageChange}
        isLoading={isLoading}
        emptyMessage="No ocean freight data available"
      />
    </div>
  );
}
