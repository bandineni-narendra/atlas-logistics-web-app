/**
 * Ocean Freight specific types
 */

export type OceanFreightRow = {
  origin: string;
  destination: string;
  carrier: string;
  container20: number | null;
  container40: number | null;
  container40HQ: number | null;
  isps: number | null;
  blFees: number | null;
  transitTime: string | null;
  routing: string | null;
  validity: string | null;
};

export type OceanFreightResult = {
  tableType: "OCEAN_FREIGHT_RATE";
  data: OceanFreightRow[];
  confidence: number;
  warnings: string[];
};
