/**
 * Core Sheet Builder - Column Model
 *
 * Generic column definition.
 * No domain knowledge.
 */

import { ColumnType, ColumnOption } from "../types";

export interface Column {
  id: string;
  label: string;
  type: ColumnType;
  required?: boolean;
  options?: ColumnOption[];
  width?: number;
  placeholder?: string;
}

export function createColumn(
  config: Partial<Column> & Pick<Column, "id" | "label" | "type">,
): Column {
  return {
    required: false,
    width: 150,
    ...config,
  };
}
