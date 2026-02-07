/**
 * Validation Feedback System - Usage Examples
 *
 * This file demonstrates all the ways to use the feedback system.
 */

import {
  useFeedbackModal,
  ValidationModal,
  SuccessModal,
  ErrorModal,
  WarningModal,
  createValidationIssue,
  ValidationResult,
  ValidationIssue,
} from "@/core/feedback";

// ============================================================================
// EXAMPLE 1: Basic Success Modal
// ============================================================================

export function Example1_BasicSuccess() {
  const { state, openSuccessModal, closeSuccessModal } = useFeedbackModal();

  const handleAction = () => {
    // Do something successful
    openSuccessModal("Operation completed successfully!");
  };

  return (
    <>
      <button onClick={handleAction}>Perform Action</button>
      <SuccessModal
        isOpen={state.success.isOpen}
        onClose={closeSuccessModal}
        message={state.success.message}
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 2: Success with Auto-Close
// ============================================================================

export function Example2_SuccessAutoClose() {
  const { state, openSuccessModal, closeSuccessModal } = useFeedbackModal();

  const handleSave = () => {
    openSuccessModal("Data saved successfully!");
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <SuccessModal
        isOpen={state.success.isOpen}
        onClose={closeSuccessModal}
        message={state.success.message}
        autoClose={true}
        autoCloseDelay={2000}
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 3: Simple Error Modal
// ============================================================================

export function Example3_SimpleError() {
  const { state, openErrorModal, closeErrorModal } = useFeedbackModal();

  const handleAction = () => {
    try {
      // Something that might fail
      throw new Error("Network timeout");
    } catch (error) {
      openErrorModal(
        "Unable to complete operation",
        "Error",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  return (
    <>
      <button onClick={handleAction}>Risky Action</button>
      <ErrorModal
        isOpen={state.error.isOpen}
        onClose={closeErrorModal}
        message={state.error.message}
        detail={state.error.detail}
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 4: Warning with Continue/Cancel
// ============================================================================

export function Example4_Warning() {
  const { state, openWarningModal, closeWarningModal } = useFeedbackModal();

  const handleDelete = () => {
    openWarningModal(
      "This action cannot be undone. Are you sure?",
      () => {
        // User clicked Continue
        console.log("Proceeding with delete");
      }
    );
  };

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      <WarningModal
        isOpen={state.warning.isOpen}
        onClose={closeWarningModal}
        message={state.warning.message}
        onContinue={state.warning.onContinue}
        continueLabel="Delete Anyway"
        cancelLabel="Cancel"
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 5: Validation Modal with Issues
// ============================================================================

export function Example5_Validation() {
  const {
    state,
    openValidationModal,
    closeValidationModal,
  } = useFeedbackModal();

  const handleValidate = () => {
    // Manually create validation result
    const result: ValidationResult = {
      isValid: false,
      issues: [
        createValidationIssue(
          "Sheet 1",
          3,
          "Currency",
          "Currency is required",
          "error"
        ),
        createValidationIssue(
          "Sheet 1",
          5,
          "Rate",
          "Rate must be greater than 0",
          "error"
        ),
        createValidationIssue(
          "Sheet 2",
          2,
          "Valid To",
          "Date is in the past",
          "warning"
        ),
      ],
      validCount: 5,
      totalCount: 7,
    };

    openValidationModal(result);
  };

  return (
    <>
      <button onClick={handleValidate}>Validate</button>
      <ValidationModal
        isOpen={state.validation.isOpen}
        onClose={closeValidationModal}
        result={state.validation.result!}
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 6: Complete Page Integration
// ============================================================================

export function Example6_CompletePage() {
  const {
    state,
    openValidationModal,
    closeValidationModal,
    openSuccessModal,
    closeSuccessModal,
    openErrorModal,
    closeErrorModal,
  } = useFeedbackModal();

  const handleSave = async () => {
    // Step 1: Validate
    const validationResult = validateData();

    if (!validationResult.isValid) {
      if (validationResult.issues.length > 0) {
        openValidationModal(validationResult);
      } else {
        openErrorModal("No data to save");
      }
      return;
    }

    // Step 2: Save
    try {
      await saveToAPI();
      openSuccessModal("Data saved successfully!", "Success");
    } catch (error) {
      openErrorModal(
        "Failed to save data",
        "Error",
        error instanceof Error ? error.message : undefined
      );
    }
  };

  // Mock validation
  const validateData = (): ValidationResult => {
    return {
      isValid: true,
      issues: [],
      validCount: 10,
      totalCount: 10,
    };
  };

  // Mock API call
  const saveToAPI = async () => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <>
      <button onClick={handleSave}>Save Data</button>

      {/* All modals */}
      <ValidationModal
        isOpen={state.validation.isOpen}
        onClose={closeValidationModal}
        result={state.validation.result!}
      />
      <SuccessModal
        isOpen={state.success.isOpen}
        onClose={closeSuccessModal}
        message={state.success.message}
        title={state.success.title}
      />
      <ErrorModal
        isOpen={state.error.isOpen}
        onClose={closeErrorModal}
        message={state.error.message}
        title={state.error.title}
        detail={state.error.detail}
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 7: Custom Validation Adapter
// ============================================================================

interface CustomData {
  name: string;
  email: string;
  age: number;
}

export function createCustomValidationAdapter() {
  return (data: CustomData[], sheetName: string): ValidationResult => {
    const issues: ValidationIssue[] = [];
    let validCount = 0;

    data.forEach((item, index) => {
      const rowIndex = index + 1;

      if (!item.name || item.name.trim() === "") {
        issues.push(
          createValidationIssue(
            sheetName,
            rowIndex,
            "Name",
            "Name is required",
            "error"
          )
        );
      }

      if (!item.email || !item.email.includes("@")) {
        issues.push(
          createValidationIssue(
            sheetName,
            rowIndex,
            "Email",
            "Valid email is required",
            "error"
          )
        );
      }

      if (item.age < 18) {
        issues.push(
          createValidationIssue(
            sheetName,
            rowIndex,
            "Age",
            "Age must be at least 18",
            "warning"
          )
        );
      }

      if (issues.filter((i) => i.severity === "error" && i.rowIndex === rowIndex).length === 0) {
        validCount++;
      }
    });

    return {
      isValid: issues.filter((i) => i.severity === "error").length === 0,
      issues,
      validCount,
      totalCount: data.length,
    };
  };
}
