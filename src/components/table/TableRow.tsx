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
      className={`border-b border-gray-200 ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } hover:bg-gray-100 transition-colors`}
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
            className="px-3 text-xs text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              width: column.width || undefined,
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            }}
          >
            {displayValue}
          </td>
        );
      })}
    </tr>
  );
}
