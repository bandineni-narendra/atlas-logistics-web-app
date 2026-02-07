/**
 * Core Feedback - Modal Management Hook
 *
 * Centralized hook for managing feedback modals.
 */

"use client";

import { useState, useCallback } from "react";
import { ValidationResult } from "../models";

export interface FeedbackModalState {
  validation: {
    isOpen: boolean;
    result: ValidationResult | null;
  };
  success: {
    isOpen: boolean;
    title?: string;
    message: string;
  };
  error: {
    isOpen: boolean;
    title?: string;
    message: string;
    detail?: string;
  };
  warning: {
    isOpen: boolean;
    title?: string;
    message: string;
    onContinue?: () => void;
  };
}

export function useFeedbackModal() {
  const [state, setState] = useState<FeedbackModalState>({
    validation: { isOpen: false, result: null },
    success: { isOpen: false, message: "" },
    error: { isOpen: false, message: "" },
    warning: { isOpen: false, message: "" },
  });

  const openValidationModal = useCallback((result: ValidationResult) => {
    setState((prev) => ({
      ...prev,
      validation: { isOpen: true, result },
    }));
  }, []);

  const closeValidationModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      validation: { isOpen: false, result: null },
    }));
  }, []);

  const openSuccessModal = useCallback(
    (message: string, title?: string) => {
      setState((prev) => ({
        ...prev,
        success: { isOpen: true, message, title },
      }));
    },
    []
  );

  const closeSuccessModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      success: { isOpen: false, message: "" },
    }));
  }, []);

  const openErrorModal = useCallback(
    (message: string, title?: string, detail?: string) => {
      setState((prev) => ({
        ...prev,
        error: { isOpen: true, message, title, detail },
      }));
    },
    []
  );

  const closeErrorModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: { isOpen: false, message: "" },
    }));
  }, []);

  const openWarningModal = useCallback(
    (message: string, onContinue?: () => void, title?: string) => {
      setState((prev) => ({
        ...prev,
        warning: { isOpen: true, message, onContinue, title },
      }));
    },
    []
  );

  const closeWarningModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      warning: { isOpen: false, message: "" },
    }));
  }, []);

  return {
    state,
    openValidationModal,
    closeValidationModal,
    openSuccessModal,
    closeSuccessModal,
    openErrorModal,
    closeErrorModal,
    openWarningModal,
    closeWarningModal,
  };
}
