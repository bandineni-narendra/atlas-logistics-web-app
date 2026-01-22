import { ColumnDef } from "@/types/table";

export type TableRowProps<T> = {
  row: T;
  columns: ColumnDef<T>[];
  index: number;
};

/**
 * Generic table row
 * Renders a single data row with custom render support
 */
export function TableRow<T>({ row, columns, index }: TableRowProps<T>) {
  return (
    <tr
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
      } hover:bg-blue-50/50 transition-colors duration-150`}
    >
      {columns.map((column) => {
        const value = row[column.key];
        const displayValue = column.render
          ? column.render(value, row)
          : value === null || value === undefined
            ? "—"
            : String(value);

        return (
          <td
            key={String(column.key)}
            className="px-4 py-3 text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap"
            style={column.width ? { width: column.width } : undefined}
          >
            {displayValue}
          </td>
        );
      })}
    </tr>
  );
}
