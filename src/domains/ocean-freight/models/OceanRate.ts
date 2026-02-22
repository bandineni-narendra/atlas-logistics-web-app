/**
 * Ocean Freight Domain - OceanRate Model
 *
 * Strict, typed data model for Ocean Freight rates.
 * Domain-specific - NOT imported into core.
 */

export interface OceanRate {
  pol: string; // Port of Loading
  pod: string; // Port of Discharge
  carrier: string;
  serviceType: string;
  container20: number;
  container40: number;
  container40HC: number;
  container45HC?: number;
  currency: string;
  validFrom: string;
  validTo: string;
  transitTime?: string;
  freeDays?: number;
  remarks?: string;
}

/**
 * Map sheet row data to OceanRate domain model.
 * This is where domain validation happens.
 */
export function mapToOceanRate(rowData: Record<string, any>): OceanRate | null {
  try {
    return {
      pol: rowData.pol || "",
      pod: rowData.pod || "",
      carrier: rowData.carrier || "",
      serviceType: rowData.serviceType || "",
      container20: parseFloat(rowData.container20) || 0,
      container40: parseFloat(rowData.container40) || 0,
      container40HC: parseFloat(rowData.container40HC) || 0,
      container45HC: rowData.container45HC
        ? parseFloat(rowData.container45HC)
        : undefined,
      currency: rowData.currency || "",
      validFrom: rowData.validFrom || "",
      validTo: rowData.validTo || "",
      transitTime: rowData.transitTime || undefined,
      freeDays: rowData.freeDays ? parseInt(rowData.freeDays) : undefined,
      remarks: rowData.remarks || undefined,
    };
  } catch (error) {
    console.error("Failed to map to OceanRate:", error);
    return null;
  }
}

/**
 * Validate OceanRate data.
 * Domain-specific business rules.
 */
export function validateOceanRate(rate: OceanRate): string[] {
  const errors: string[] = [];

  // Check required text fields
  if (!rate.pol || rate.pol.trim() === "") errors.push("Port of Loading (POL) is required");
  if (!rate.pod || rate.pod.trim() === "") errors.push("Port of Discharge (POD) is required");
  if (!rate.carrier || rate.carrier.trim() === "") errors.push("Carrier is required");
  if (!rate.serviceType || rate.serviceType.trim() === "") errors.push("Service Type is required");
  if (!rate.currency || rate.currency.trim() === "") errors.push("Currency is required");
  if (!rate.validFrom || rate.validFrom.trim() === "") errors.push("Valid From date is required");
  if (!rate.validTo || rate.validTo.trim() === "") errors.push("Valid To date is required");

  // Check number fields (they can be 0, but not negative)
  if (rate.container20 < 0)
    errors.push("20' Container rate cannot be negative");
  if (rate.container40 < 0)
    errors.push("40' Container rate cannot be negative");
  if (rate.container40HC < 0)
    errors.push("40' HC Container rate cannot be negative");

  if (rate.freeDays && rate.freeDays < 0) {
    errors.push("Free Days cannot be negative");
  }

  return errors;
}
