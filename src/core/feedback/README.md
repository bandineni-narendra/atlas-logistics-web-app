# Validation Feedback System

**Enterprise-grade validation and feedback UX for Sheet Builder**

---

## Overview

The Validation Feedback System provides professional, reusable modal-based feedback components for validation results, success messages, errors, and warnings throughout the application.

### Key Features

- ✅ **Generic & Reusable** - Domain-agnostic across Air, Ocean, and future modules
- ✅ **Professional UX** - Material-3 inspired modals with proper accessibility
- ✅ **Clear Messaging** - Precise row/column/field error identification
- ✅ **Type-Safe** - Full TypeScript support with strict typing
- ✅ **Accessible** - Focus trap, keyboard navigation, ARIA labels

---

## Architecture

```
src/core/feedback/
├── components/
│   ├── BaseModal.tsx          # Foundation modal with accessibility
│   ├── ValidationModal.tsx    # Displays validation issues
│   ├── SuccessModal.tsx       # Success confirmations
│   ├── ErrorModal.tsx         # Error messages
│   ├── WarningModal.tsx       # Warning prompts
│   └── index.ts
├── models/
│   ├── ValidationResult.ts    # Generic validation types
│   └── index.ts
├── hooks/
│   ├── useFeedbackModal.ts    # Centralized modal state management
│   └── index.ts
└── index.ts
```

---

## Core Models

### ValidationIssue

Represents a single validation problem:

```typescript
interface ValidationIssue {
  sheetName: string;      // e.g., "Sheet 1"
  rowIndex: number;       // 1-based for user display
  columnLabel: string;    // User-friendly column name
  message: string;        // Clear error message
  severity: "error" | "warning";
}
```

### ValidationResult

Complete validation outcome:

```typescript
interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  validCount?: number;    // Number of valid rows
  totalCount?: number;    // Total rows processed
}
```

---

## Components

### BaseModal

Foundation component for all modals.

**Features:**
- Focus trap (Tab navigation contained)
- Keyboard dismiss (Escape key)
- Backdrop click to close
- Accessible (ARIA roles)
- Multiple sizes: sm, md, lg, xl
- Type-based styling: success, error, warning, info

**Props:**
```typescript
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: "success" | "error" | "warning" | "info";
  actions?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}
```

### ValidationModal

Displays validation issues in a scannable format.

**Features:**
- Summary banner (error/warning counts)
- Color-coded issues (red errors, orange warnings)
- Sheet → Row → Column → Message hierarchy
- Scrollable for many issues
- Valid/total row counts

**Usage:**
```tsx
<ValidationModal
  isOpen={isOpen}
  onClose={closeModal}
  result={validationResult}
/>
```

### SuccessModal

Success confirmations with optional auto-close.

**Features:**
- Green checkmark icon
- Calm, positive design
- Optional auto-close after delay
- Customizable title

**Usage:**
```tsx
<SuccessModal
  isOpen={isOpen}
  onClose={closeModal}
  message="3 rates saved successfully!"
  autoClose={true}
  autoCloseDelay={3000}
/>
```

### ErrorModal

Blocking error messages.

**Features:**
- Red error icon
- Clear message
- Optional detail text
- Prominent close button

**Usage:**
```tsx
<ErrorModal
  isOpen={isOpen}
  onClose={closeModal}
  message="Unable to save sheet"
  detail="Network connection failed"
/>
```

### WarningModal

Non-blocking warnings with continue/review options.

**Features:**
- Orange warning icon
- Two-action layout
- Customizable button labels
- Optional continue callback

**Usage:**
```tsx
<WarningModal
  isOpen={isOpen}
  onClose={closeModal}
  onContinue={handleContinue}
  message="Some optional fields are missing"
  continueLabel="Save Anyway"
  cancelLabel="Review"
/>
```

---

## Hooks

### useFeedbackModal

Centralized modal state management.

**Returns:**
```typescript
{
  state: FeedbackModalState;
  openValidationModal: (result: ValidationResult) => void;
  closeValidationModal: () => void;
  openSuccessModal: (message: string, title?: string) => void;
  closeSuccessModal: () => void;
  openErrorModal: (message: string, title?: string, detail?: string) => void;
  closeErrorModal: () => void;
  openWarningModal: (message: string, onContinue?: () => void, title?: string) => void;
  closeWarningModal: () => void;
}
```

**Usage:**
```tsx
const {
  state,
  openValidationModal,
  closeValidationModal,
  openSuccessModal,
  closeSuccessModal,
} = useFeedbackModal();
```

---

## Domain Integration

### Validation Adapters

Each domain (Ocean Freight, Air Freight) has a validation adapter that converts domain-specific validation to generic `ValidationResult`:

```typescript
// src/domains/ocean-freight/validation/oceanValidation.ts
export function validateOceanSheets(
  sheets: Sheet[],
  options: OceanValidationOptions = { skipEmptyRows: true }
): ValidationResult {
  const issues: ValidationIssue[] = [];
  let validCount = 0;
  
  sheets.forEach((sheet, sheetIndex) => {
    sheet.rows.forEach((row, rowIndex) => {
      // Skip empty rows if configured
      // Map row to domain model
      // Validate using domain rules
      // Convert errors to ValidationIssues
    });
  });
  
  return { isValid, issues, validCount, totalCount };
}
```

### Page Integration

Domain pages use the feedback system:

```tsx
import {
  useFeedbackModal,
  ValidationModal,
  SuccessModal,
  ErrorModal,
} from "@/core/feedback";
import { validateOceanSheets } from "../validation";

export default function CreateOceanSheet() {
  const {
    state,
    openValidationModal,
    closeValidationModal,
    openSuccessModal,
    closeSuccessModal,
    openErrorModal,
    closeErrorModal,
  } = useFeedbackModal();
  
  const handleSave = () => {
    // Run validation
    const result = validateOceanSheets(sheets);
    
    if (!result.isValid) {
      if (result.issues.length > 0) {
        openValidationModal(result);
      } else {
        openErrorModal("No data to save");
      }
      return;
    }
    
    // Save data
    openSuccessModal("Rates saved successfully!");
  };
  
  return (
    <>
      {/* Page content */}
      
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
      />
      <ErrorModal
        isOpen={state.error.isOpen}
        onClose={closeErrorModal}
        message={state.error.message}
      />
    </>
  );
}
```

---

## Validation Message Format

### Best Practices

**✅ Good:**
- "Currency is required"
- "Rate must be greater than 0"
- "Valid From date cannot be in the past"

**❌ Bad:**
- "Invalid" (too vague)
- "currency field error" (inconsistent capitalization)
- "The value entered for this field is not correct" (wordy)

### Message Structure

```
Sheet Name → Row Number → Column Label: Message
```

Example:
```
Sheet 1 → Row 3 → Currency: Value is required
```

---

## Accessibility Features

- **Focus Trap:** Tab navigation contained within modal
- **Keyboard Dismiss:** Escape key closes modal
- **ARIA Labels:** Proper roles and labels for screen readers
- **Focus Management:** Auto-focus on first interactive element
- **Visual Indicators:** Color + icon for severity (not color alone)

---

## Styling

### Color Palette

- **Success:** Green (#059669)
- **Error:** Red (#DC2626)
- **Warning:** Orange (#EA580C)
- **Info:** Blue (#2563EB)

### Sizes

- **sm:** max-w-md (28rem)
- **md:** max-w-2xl (42rem)
- **lg:** max-w-4xl (56rem)
- **xl:** max-w-6xl (72rem)

---

## Future Extensibility

### Adding New Modal Types

1. Create component in `src/core/feedback/components/`
2. Add state to `useFeedbackModal` hook
3. Export from `index.ts`

### Adding New Domains

1. Create validation adapter in `src/domains/<domain>/validation/`
2. Convert domain errors to `ValidationIssue[]`
3. Return `ValidationResult` from validator
4. Integrate with `useFeedbackModal` in page

---

## Examples

### Ocean Freight Validation Error

```
┌─────────────────────────────────────┐
│ Validation Issues             [×]   │
├─────────────────────────────────────┤
│ 🔴 2 Errors                          │
│ 🟠 1 Warning                         │
│ 5 of 7 rows are valid               │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ ⊗ Sheet 1 → Row 3 → POL         │ │
│ │   Port of Loading is required   │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ ⊗ Sheet 2 → Row 1 → Rate        │ │
│ │   Rate must be greater than 0   │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ ⚠ Sheet 1 → Row 5 → Valid To   │ │
│ │   Date is in the past           │ │
│ └─────────────────────────────────┘ │
│                                      │
│         [Review & Fix]              │
└─────────────────────────────────────┘
```

### Success Confirmation

```
┌─────────────────────────────┐
│ Success              [×]    │
├─────────────────────────────┤
│                             │
│         ✓                   │
│                             │
│ 5 ocean freight rates       │
│ saved successfully!         │
│                             │
│            [OK]             │
└─────────────────────────────┘
```

---

## Non-Goals

- ❌ **Validation Logic:** Modals only display results
- ❌ **Domain Knowledge:** Components are generic
- ❌ **Data Transformation:** Done in domain adapters
- ❌ **Business Rules:** Defined in domain models

---

## Testing Guidelines

### Manual Testing Checklist

- [ ] Validation modal shows errors with sheet/row/column
- [ ] Success modal displays and auto-closes (if enabled)
- [ ] Error modal shows message and optional detail
- [ ] Warning modal has continue/cancel actions
- [ ] Escape key closes all modals
- [ ] Tab navigation stays within modal
- [ ] Backdrop click closes modal
- [ ] Close button (×) works
- [ ] Multiple issues display correctly
- [ ] Scrolling works for many issues
- [ ] Mobile responsive

---

## Support

For questions or issues:
- Check validation adapter implementation
- Review domain model validation rules
- Ensure ValidationIssues have clear messages
- Verify modal state management in useFeedbackModal

---

**Last Updated:** February 2026  
**Version:** 1.0.0
