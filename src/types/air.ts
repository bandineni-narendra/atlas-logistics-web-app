/**
 * Air Freight specific types
 */

export type AirFreightRow = {
  origin: string | null;
  destination: string | null;
  carrier: string | null;

  // Weight-based rates
  minimum: number | null;
  rateBelow45kg: number | null;
  rate45kg: number | null;
  rate100kg: number | null;
  rate300kg: number | null;
  rate500kg: number | null;
  rate1000kg: number | null;

  // Surcharges
  fuelSurcharge: number | null;
  securitySurcharge: number | null;
  xrayCharges: number | null;
  handlingCharges: number | null;

  transitTime: string | null;
  routing: string | null;
  currency: string | null;
  validity: string | null;
};

export type AirFreightMetadata = {
  sheetName: string;
  currency: string | null;
  effectiveDate: string | null;
  validityDate: string | null;
  contactEmail: string | null;
};

export type AirFreightResult = {
  tableType: "AIR_FREIGHT_RATE";
  data: AirFreightRow[];
  confidence: number;
  warnings: string[];
  metadata?: AirFreightMetadata;
};
