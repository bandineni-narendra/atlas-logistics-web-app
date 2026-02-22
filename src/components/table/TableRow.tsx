import { ColumnDef } from "@/types/table";

export type TableRowProps<T> = {
  row: T;
  columns: ColumnDef<T>[];
  index: number;
  rowIndex: number;
  onCellChange?: (rowIndex: number, key: keyof T, value: string) => void;
};

/**
 * Table row — M3 flat, no alternating colors, subtle hover
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
      className="bg-surface hover:bg-surface transition-colors duration-100"
    >
      {columns.map((column) => {
        const value = row[column.key];
        const stringValue =
          value === null || value === undefined ? "" : String(value);

        return (
          <td
            key={String(column.key)}
            className="px-1 py-1 text-sm text-textPrimary"
            style={column.width ? { minWidth: column.width } : undefined}
          >
            <input
              type="text"
              value={stringValue}
              onChange={(e) =>
                onCellChange?.(rowIndex, column.key, e.target.value)
              }
              className="w-full px-2 py-1.5 text-sm border border-transparent rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-transparent hover:bg-surface transition-colors duration-100"
            />
          </td>
        );
      })}
    </tr>
  );
}
