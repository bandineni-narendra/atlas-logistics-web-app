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
  /**
   * For AIRLINE type: ID of the other column to auto-fill when a selection
   * is made (airline name ↔ airline code).
   */
  linkedColumn?: string;
  /**
   * For AIRLINE type: which airline field this column stores.
   * 'name'  → stores the airline name (e.g., "Emirates").
   * 'code'  → stores the IATA code  (e.g., "EK").
   */
  linkedField?: 'name' | 'code';
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
