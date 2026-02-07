/**
 * Air Freight Domain - Column Configuration
 *
 * Defines Air Freight specific columns.
 * This config is injected into the generic SheetBuilder.
 */

import { Column, ColumnType, createColumn } from "@/core/sheet-builder";

export const airFreightColumns: Column[] = [
  createColumn({
    id: "origin",
    label: "Origin",
    type: ColumnType.TEXT,
    required: true,
    placeholder: "e.g., JFK",
    width: 150,
  }),
  createColumn({
    id: "destination",
    label: "Destination",
    type: ColumnType.TEXT,
    required: true,
    placeholder: "e.g., LHR",
    width: 150,
  }),
  createColumn({
    id: "airline",
    label: "Airline",
    type: ColumnType.TEXT,
    required: true,
    placeholder: "e.g., Emirates",
    width: 150,
  }),
  createColumn({
    id: "serviceLevel",
    label: "Service Level",
    type: ColumnType.SELECT,
    required: true,
    width: 150,
    options: [
      { label: "Express", value: "express" },
      { label: "Standard", value: "standard" },
      { label: "Economy", value: "economy" },
    ],
  }),
  createColumn({
    id: "minRate",
    label: "Min Rate",
    type: ColumnType.NUMBER,
    required: true,
    width: 120,
  }),
  createColumn({
    id: "rate45",
    label: "+45kg",
    type: ColumnType.NUMBER,
    required: true,
    width: 120,
  }),
  createColumn({
    id: "rate100",
    label: "+100kg",
    type: ColumnType.NUMBER,
    required: true,
    width: 120,
  }),
  createColumn({
    id: "rate250",
    label: "+250kg",
    type: ColumnType.NUMBER,
    width: 120,
  }),
  createColumn({
    id: "rate500",
    label: "+500kg",
    type: ColumnType.NUMBER,
    width: 120,
  }),
  createColumn({
    id: "rate1000",
    label: "+1000kg",
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
    placeholder: "e.g., 2-3 days",
    width: 150,
  }),
  createColumn({
    id: "remarks",
    label: "Remarks",
    type: ColumnType.TEXT,
    placeholder: "Optional notes",
    width: 200,
  }),
];
