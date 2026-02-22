/**
 * Air Freight Domain - AirRate Model
 *
 * Strict, typed data model for Air Freight rates.
 * Domain-specific - NOT imported into core.
 */

export interface AirRate {
  origin: string;
  destination: string;
  airline: string;
  serviceLevel: string;
  minRate: number;
  normalRate: number;
  rateMinus45: number;
  rate45: number;
  rate100: number;
  rate300: number;
  rate500: number;
  rate1000: number;
  fuelSurcharge: number;
  securitySurcharge: number;
  xraySurcharge: number;
  amsSurcharge: number;
  cartageSurcharge: number;
  miscSurcharge: number;
  currency: string;
  validFrom: string;
  validTo: string;
  airlineCode?: string;
  transitTime?: string;
  remarks?: string;
}

/**
 * Map sheet row data to AirRate domain model.
 * This is where domain validation happens.
 */
export function mapToAirRate(rowData: Record<string, any>): AirRate | null {
  try {
    return {
      origin: rowData.origin || "",
      destination: rowData.destination || "",
      airline: rowData.airline || "",
      serviceLevel: rowData.serviceLevel || "",
      minRate: parseFloat(rowData.minRate) || 0,
      normalRate: parseFloat(rowData.normalRate) || 0,
      rateMinus45: parseFloat(rowData.rateMinus45) || 0,
      rate45: parseFloat(rowData.rate45) || 0,
      rate100: parseFloat(rowData.rate100) || 0,
      rate300: parseFloat(rowData.rate300) || 0,
      rate500: parseFloat(rowData.rate500) || 0,
      rate1000: parseFloat(rowData.rate1000) || 0,
      fuelSurcharge: parseFloat(rowData.fuelSurcharge) || 0,
      securitySurcharge: parseFloat(rowData.securitySurcharge) || 0,
      xraySurcharge: parseFloat(rowData.xraySurcharge) || 0,
      amsSurcharge: parseFloat(rowData.amsSurcharge) || 0,
      cartageSurcharge: parseFloat(rowData.cartageSurcharge) || 0,
      miscSurcharge: parseFloat(rowData.miscSurcharge) || 0,
      currency: rowData.currency || "",
      validFrom: rowData.validFrom || "",
      validTo: rowData.validTo || "",
      airlineCode: rowData.airlineCode || undefined,
      transitTime: rowData.transitTime || undefined,
      remarks: rowData.remarks || undefined,
    };
  } catch (error) {
    console.error("Failed to map to AirRate:", error);
    return null;
  }
}

/**
 * Validate AirRate data.
 * Domain-specific business rules.
 */
export function validateAirRate(rate: AirRate): string[] {
  const errors: string[] = [];

  // Check required text fields
  if (!rate.origin || rate.origin.trim() === "") errors.push("Origin is required");
  if (!rate.destination || rate.destination.trim() === "") errors.push("Destination is required");
  if (!rate.airline || rate.airline.trim() === "") errors.push("Airline is required");
  if (!rate.serviceLevel || rate.serviceLevel.trim() === "") errors.push("Service Level is required");
  if (!rate.currency || rate.currency.trim() === "") errors.push("Currency is required");
  if (!rate.validFrom || rate.validFrom.trim() === "") errors.push("Valid From date is required");
  if (!rate.validTo || rate.validTo.trim() === "") errors.push("Valid To date is required");

  // Check number fields (they can be 0, but not negative)
  if (rate.minRate < 0) errors.push("Min Rate cannot be negative");
  if (rate.normalRate < 0) errors.push("Normal Rate cannot be negative");
  if (rate.rateMinus45 < 0) errors.push("Rate -45 cannot be negative");
  if (rate.rate45 < 0) errors.push("Rate 45 cannot be negative");
  if (rate.rate100 < 0) errors.push("Rate 100 cannot be negative");
  if (rate.fuelSurcharge < 0) errors.push("Fuel Surcharge cannot be negative");
  if (rate.securitySurcharge < 0) errors.push("Security Surcharge cannot be negative");
  if (rate.xraySurcharge < 0) errors.push("XRay Surcharge cannot be negative");
  if (rate.amsSurcharge < 0) errors.push("AMS Surcharge cannot be negative");
  if (rate.cartageSurcharge < 0) errors.push("Cartage Surcharge cannot be negative");
  if (rate.miscSurcharge < 0) errors.push("MISC Surcharge cannot be negative");

  return errors;
}
