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
    <thead className="bg-gray-100 border-b-2 border-gray-300">
      <tr>
        {columns.map((column) => (
          <th
            key={String(column.key)}
            className="px-3 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider overflow-hidden text-ellipsis"
            style={column.width ? { width: column.width } : undefined}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
