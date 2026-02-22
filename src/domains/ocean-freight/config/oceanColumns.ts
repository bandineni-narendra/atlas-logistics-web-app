/**
 * Ocean Freight Domain - Column Configuration
 *
 * Defines Ocean Freight specific columns.
 * This config is injected into the generic SheetBuilder.
 */

import { Column, ColumnType, createColumn } from "@/core/sheet-builder";

export const oceanFreightColumns: Column[] = [
  createColumn({
    id: "pol",
    label: "POL",
    type: ColumnType.TEXT,
    required: true,
    placeholder: "e.g., Shanghai",
    width: 150,
  }),
  createColumn({
    id: "pod",
    label: "POD",
    type: ColumnType.TEXT,
    required: true,
    placeholder: "e.g., Los Angeles",
    width: 150,
  }),
  createColumn({
    id: "carrier",
    label: "Carrier",
    type: ColumnType.TEXT,
    required: true,
    placeholder: "e.g., Maersk",
    width: 150,
  }),
  createColumn({
    id: "serviceType",
    label: "Service Type",
    type: ColumnType.SELECT,
    required: true,
    width: 150,
    options: [
      { label: "Direct", value: "direct" },
      { label: "Transship", value: "transship" },
      { label: "Express", value: "express" },
    ],
  }),
  createColumn({
    id: "container20",
    label: "20'",
    type: ColumnType.NUMBER,
    width: 130,
  }),
  createColumn({
    id: "container40",
    label: "40'",
    type: ColumnType.NUMBER,
    width: 130,
  }),
  createColumn({
    id: "container40HC",
    label: "40' HC",
    type: ColumnType.NUMBER,
    width: 130,
  }),
  createColumn({
    id: "container45HC",
    label: "45' HC",
    type: ColumnType.NUMBER,
    width: 130,
  }),
  createColumn({
    id: "currency",
    label: "Currency",
    type: ColumnType.SELECT,
    required: true,
    width: 100,
    options: [
      { label: "USD", value: "USD" },
      { label: "EUR", value: "EUR" },
      { label: "GBP", value: "GBP" },
      { label: "CNY", value: "CNY" },
      { label: "INR", value: "INR" },
    ],
  }),
  createColumn({
    id: "validFrom",
    label: "Valid From",
    type: ColumnType.DATE,
    required: true,
    width: 130,
  }),
  createColumn({
    id: "validTo",
    label: "Valid To",
    type: ColumnType.DATE,
    required: true,
    width: 130,
  }),
  createColumn({
    id: "transitTime",
    label: "Transit Time",
    type: ColumnType.TEXT,
    placeholder: "e.g., 18-22 days",
    width: 130,
  }),
  createColumn({
    id: "freeDays",
    label: "Free Days",
    type: ColumnType.NUMBER,
    placeholder: "e.g., 14",
    width: 110,
  }),
  createColumn({
    id: "remarks",
    label: "Remarks",
    type: ColumnType.TEXT,
    placeholder: "Optional notes",
    width: 200,
  }),
];
