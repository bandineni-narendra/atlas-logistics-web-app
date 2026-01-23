import { ColumnDef } from "@/types/table";

export type TableRowProps<T> = {
  row: T;
  columns: ColumnDef<T>[];
  index: number;
  rowIndex: number;
  onCellChange?: (rowIndex: number, key: keyof T, value: string) => void;
};

/**
 * Generic table row
 * Renders a single data row with editable input cells
 */
export function TableRow<T>({
  row,
  columns,
  index,
  rowIndex,
  onCellChange,
}: TableRowProps<T>) {
  return (
    <tr
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
      } hover:bg-blue-50/50 transition-colors duration-150`}
    >
      {columns.map((column) => {
        const value = row[column.key];
        const stringValue =
          value === null || value === undefined ? "" : String(value);

        return (
          <td
            key={String(column.key)}
            className="px-1 py-1 text-sm text-gray-700"
            style={column.width ? { minWidth: column.width } : undefined}
          >
            <input
              type="text"
              value={stringValue}
              onChange={(e) =>
                onCellChange?.(rowIndex, column.key, e.target.value)
              }
              className="w-full px-2 py-1.5 text-sm border border-transparent rounded focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-transparent hover:bg-gray-100 transition-colors"
            />
          </td>
        );
      })}
    </tr>
  );
}
