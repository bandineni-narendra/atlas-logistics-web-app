# Validation Feedback System - Quick Reference

## 🚀 Quick Start (30 seconds)

```tsx
// 1. Import
import { useFeedbackModal, ValidationModal, SuccessModal } from "@/core/feedback";

// 2. Setup hook
const { state, openSuccessModal, closeSuccessModal } = useFeedbackModal();

// 3. Use it
const handleSave = () => {
  openSuccessModal("Saved!");
};

// 4. Render modal
<SuccessModal
  isOpen={state.success.isOpen}
  onClose={closeSuccessModal}
  message={state.success.message}
/>
```

---

## 📚 Modal Types

| Modal | Use Case | Example |
|-------|----------|---------|
| **ValidationModal** | Show validation errors | "Currency is required in Row 3" |
| **SuccessModal** | Confirm success | "5 rates saved successfully!" |
| **ErrorModal** | Show blocking errors | "Network connection failed" |
| **WarningModal** | Non-blocking warnings | "Some optional fields are missing" |

---

## 🎯 Common Patterns

### Pattern 1: Validation on Save

```tsx
const handleSave = () => {
  const result = validateMyData(data);
  
  if (!result.isValid) {
    openValidationModal(result);
    return;
  }
  
  // Save...
  openSuccessModal("Saved!");
};
```

### Pattern 2: Try/Catch with Error Modal

```tsx
const handleAction = async () => {
  try {
    await riskyOperation();
    openSuccessModal("Success!");
  } catch (error) {
    openErrorModal(
      "Operation failed",
      undefined,
      error.message
    );
  }
};
```

### Pattern 3: Confirmation Warning

```tsx
const handleDelete = () => {
  openWarningModal(
    "Delete this item?",
    () => {
      // User clicked Continue
      performDelete();
    }
  );
};
```

---

## 🔧 Hook API

### useFeedbackModal()

**Returns:**
```tsx
{
  state: {
    validation: { isOpen, result },
    success: { isOpen, message, title },
    error: { isOpen, message, title, detail },
    warning: { isOpen, message, onContinue, title }
  },
  
  // Validation
  openValidationModal(result),
  closeValidationModal(),
  
  // Success
  openSuccessModal(message, title?),
  closeSuccessModal(),
  
  // Error
  openErrorModal(message, title?, detail?),
  closeErrorModal(),
  
  // Warning
  openWarningModal(message, onContinue?, title?),
  closeWarningModal()
}
```

---

## 📝 Creating Validation Results

### Manual Creation

```tsx
import { createValidationIssue, ValidationResult } from "@/core/feedback";

const result: ValidationResult = {
  isValid: false,
  issues: [
    createValidationIssue(
      "Sheet 1",     // Sheet name
      3,             // Row number (1-based)
      "Currency",    // Column label
      "Currency is required",  // Message
      "error"        // Severity
    )
  ],
  validCount: 5,
  totalCount: 7
};
```

### Using Validation Adapter

```tsx
import { validateOceanSheets } from "@/domains/ocean-freight/validation";

const result = validateOceanSheets(sheets, { skipEmptyRows: true });

if (!result.isValid) {
  openValidationModal(result);
}
```

---

## 🎨 Modal Props

### ValidationModal
```tsx
<ValidationModal
  isOpen={boolean}
  onClose={() => void}
  result={ValidationResult}
/>
```

### SuccessModal
```tsx
<SuccessModal
  isOpen={boolean}
  onClose={() => void}
  message={string}
  title={string}              // Optional
  autoClose={boolean}         // Optional
  autoCloseDelay={number}     // Optional (ms)
/>
```

### ErrorModal
```tsx
<ErrorModal
  isOpen={boolean}
  onClose={() => void}
  message={string}
  title={string}              // Optional
  detail={string}             // Optional
/>
```

### WarningModal
```tsx
<WarningModal
  isOpen={boolean}
  onClose={() => void}
  message={string}
  onContinue={() => void}     // Optional
  title={string}              // Optional
  continueLabel={string}      // Optional
  cancelLabel={string}        // Optional
/>
```

---

## 🔍 Complete Example

```tsx
import { useState } from "react";
import {
  useFeedbackModal,
  ValidationModal,
  SuccessModal,
  ErrorModal,
} from "@/core/feedback";
import { validateOceanSheets } from "@/domains/ocean-freight/validation";

export default function MyPage() {
  const [sheets, setSheets] = useState([]);
  
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
    // Validate
    const result = validateOceanSheets(sheets);
    
    if (!result.isValid) {
      if (result.issues.length > 0) {
        openValidationModal(result);
      } else {
        openErrorModal("No data to save");
      }
      return;
    }
    
    // Save
    try {
      await saveData(sheets);
      openSuccessModal("Data saved successfully!");
    } catch (error) {
      openErrorModal(
        "Failed to save",
        "Error",
        error.message
      );
    }
  };
  
  return (
    <>
      <button onClick={handleSave}>Save</button>
      
      {/* Modals */}
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
```

---

## 📖 Need More?

- **Full Documentation:** `src/core/feedback/README.md`
- **7 Examples:** `src/core/feedback/EXAMPLES.tsx`
- **Implementation Summary:** `src/core/feedback/IMPLEMENTATION_SUMMARY.md`

---

## ✨ Tips

**✅ Do:**
- Use clear, specific error messages
- Show what field has the error
- Include row/sheet context
- Use appropriate severity (error vs warning)

**❌ Don't:**
- Use generic messages ("Invalid")
- Hardcode domain logic in modals
- Forget to close modals
- Use alert() anymore!

---

**Version:** 1.0.0  
**Status:** Production Ready
