import { ConfidenceBadge, FileLabel } from "@/components/feedback";

export type OceanHeaderProps = {
  confidence: number;
  fileName?: string;
};

/**
 * Ocean freight page header
 * Displays title and confidence score
 */
export function OceanHeader({ confidence, fileName }: OceanHeaderProps) {
  return (
    <div className="px-8 py-6 border-b border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900">Ocean Freight Rates</h1>

      {fileName && (
        <p className="text-sm text-gray-600 mt-1">File: {fileName}</p>
      )}

      <div className="mt-4">
        <ConfidenceBadge confidence={confidence} />
      </div>
    </div>
  );
}
