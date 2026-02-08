/**
 * Generic table component types
 */

export type ColumnDef<T> = {
  key: keyof T;
  label: string;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
};

export type TableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onCellChange?: (rowIndex: number, key: keyof T, value: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
};
