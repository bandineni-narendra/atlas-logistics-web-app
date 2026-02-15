import { ColumnDef } from "@/types/table";

export type TableHeaderProps<T> = {
  columns: ColumnDef<T>[];
};

/**
 * Table header — M3 flat, normal case, medium weight
 */
export function TableHeader<T>({ columns }: TableHeaderProps<T>) {
  return (
    <thead className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
      <tr>
        {columns.map((column) => (
          <th
            key={String(column.key)}
            className="px-3 py-2.5 text-left text-xs font-medium text-[var(--on-surface-variant)] whitespace-nowrap"
            style={column.width ? { minWidth: column.width } : undefined}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
