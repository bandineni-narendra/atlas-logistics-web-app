/**
 * Raw Excel data contracts
 * Used in file upload and backend processing
 */

export type RawExcelSheet = {
  sheetName: string;
  rows: unknown[][];
};

export type RawExcelPayload = {
  fileName: string;
  sheets: RawExcelSheet[];
};

export type StructuredResult = {
  tableType: string;
  data: Record<string, unknown>[];
  confidence: number;
  warnings: string[];
};
