export type OceanWarningsProps = {
  warnings: string[];
};

/**
 * Displays warnings from AI processing
 * Only renders if warnings exist
 */
export function OceanWarnings({ warnings }: OceanWarningsProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="mx-8 my-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <h3 className="text-sm font-semibold text-yellow-900 mb-2">
        ⚠️ Warnings
      </h3>
      <ul className="space-y-1">
        {warnings.map((warning, index) => (
          <li key={index} className="text-sm text-yellow-800">
            • {warning}
          </li>
        ))}
      </ul>
    </div>
  );
}
