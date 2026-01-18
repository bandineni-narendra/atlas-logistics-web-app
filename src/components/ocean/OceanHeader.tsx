export type OceanHeaderProps = {
  confidence: number;
  fileName?: string;
};

/**
 * Ocean freight page header
 * Displays title and confidence score
 */
export function OceanHeader({ confidence, fileName }: OceanHeaderProps) {
  const confidencePercent = Math.round(confidence * 100);
  const confidenceColor =
    confidencePercent >= 80
      ? "text-green-600"
      : confidencePercent >= 60
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="px-8 py-6 border-b border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900">Ocean Freight Rates</h1>

      {fileName && (
        <p className="text-sm text-gray-600 mt-1">File: {fileName}</p>
      )}

      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-gray-700">Confidence:</span>
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <span className={`text-sm font-semibold ${confidenceColor}`}>
            {confidencePercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
