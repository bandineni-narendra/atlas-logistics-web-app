/**
 * Core Feedback - Validation Modal
 *
 * Displays validation issues in a professional, scannable format.
 * Shows errors and warnings with clear context.
 */

"use client";

import { ValidationResult } from "../models";
import { BaseModal } from "./BaseModal";

export interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ValidationResult;
}

export function ValidationModal({
  isOpen,
  onClose,
  result,
}: ValidationModalProps) {
  // Don't render if no result
  if (!result || !isOpen) {
    return null;
  }

  const errorCount = result.issues.filter((i) => i.severity === "error").length;
  const warningCount = result.issues.filter(
    (i) => i.severity === "warning"
  ).length;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Validation Issues"
      type="error"
      size="lg"
      actions={
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Review & Fix
        </button>
      }
    >
      {/* Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          {errorCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-semibold text-red-700">
                {errorCount} {errorCount === 1 ? "Error" : "Errors"}
              </span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-semibold text-orange-700">
                {warningCount} {warningCount === 1 ? "Warning" : "Warnings"}
              </span>
            </div>
          )}
        </div>
        {result.validCount !== undefined && result.totalCount !== undefined && (
          <p className="text-sm text-gray-600 mt-2">
            {result.validCount} of {result.totalCount} rows are valid
          </p>
        )}
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {result.issues.map((issue, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 ${
              issue.severity === "error"
                ? "bg-red-50 border-red-500"
                : "bg-orange-50 border-orange-500"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {issue.severity === "error" ? (
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className={`text-sm font-semibold ${
                      issue.severity === "error"
                        ? "text-red-800"
                        : "text-orange-800"
                    }`}
                  >
                    {issue.sheetName}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-sm font-medium text-gray-700">
                    Row {issue.rowIndex}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-sm font-medium text-gray-700">
                    {issue.columnLabel}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    issue.severity === "error"
                      ? "text-red-700"
                      : "text-orange-700"
                  }`}
                >
                  {issue.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseModal>
  );
}
