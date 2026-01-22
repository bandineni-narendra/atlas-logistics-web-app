import { ColumnDef } from "@/types/table";

export type TableHeaderProps<T> = {
  columns: ColumnDef<T>[];
};

/**
 * Generic table header
 * Renders column headers
 */
export function TableHeader<T>({ columns }: TableHeaderProps<T>) {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        {columns.map((column) => (
          <th
            key={String(column.key)}
            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider overflow-hidden text-ellipsis"
            style={column.width ? { width: column.width } : undefined}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
