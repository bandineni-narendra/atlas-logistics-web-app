# Migration Guide: alert() → Feedback Modals

This guide shows how to migrate from browser `alert()` to professional feedback modals.

---

## 🎯 Why Migrate?

| alert() | Feedback Modals |
|---------|----------------|
| Browser-dependent styling | Consistent, branded UX |
| Blocks entire page | Modal overlay only |
| No accessibility | ARIA labels, focus trap |
| Plain text only | Rich formatting, colors, icons |
| No customization | Full control over appearance |

---

## 📋 Migration Checklist

- [ ] Replace success alerts with SuccessModal
- [ ] Replace error alerts with ErrorModal
- [ ] Replace validation alerts with ValidationModal
- [ ] Replace confirm() with WarningModal
- [ ] Add useFeedbackModal hook
- [ ] Render modal components
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

---

## 🔄 Migration Patterns

### Pattern 1: Success Alert

**Before:**
```tsx
const handleSave = () => {
  // Save logic
  alert("Saved successfully!");
};
```

**After:**
```tsx
const { state, openSuccessModal, closeSuccessModal } = useFeedbackModal();

const handleSave = () => {
  // Save logic
  openSuccessModal("Saved successfully!");
};

// In JSX
<SuccessModal
  isOpen={state.success.isOpen}
  onClose={closeSuccessModal}
  message={state.success.message}
/>
```

---

### Pattern 2: Error Alert

**Before:**
```tsx
const handleAction = async () => {
  try {
    await riskyOperation();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};
```

**After:**
```tsx
const { state, openErrorModal, closeErrorModal } = useFeedbackModal();

const handleAction = async () => {
  try {
    await riskyOperation();
  } catch (error) {
    openErrorModal(
      "Operation failed",
      "Error",
      error.message
    );
  }
};

// In JSX
<ErrorModal
  isOpen={state.error.isOpen}
  onClose={closeErrorModal}
  message={state.error.message}
  title={state.error.title}
  detail={state.error.detail}
/>
```

---

### Pattern 3: Validation Alert

**Before:**
```tsx
const handleSave = () => {
  const errors = [];
  
  if (!name) errors.push("Name is required");
  if (!email) errors.push("Email is required");
  
  if (errors.length > 0) {
    alert(`Please fix:\n${errors.join('\n')}`);
    return;
  }
  
  // Save
};
```

**After:**
```tsx
const { state, openValidationModal, closeValidationModal } = useFeedbackModal();

const handleSave = () => {
  const result = validateData(data);
  
  if (!result.isValid) {
    openValidationModal(result);
    return;
  }
  
  // Save
};

// Validation function
function validateData(data): ValidationResult {
  const issues = [];
  
  if (!data.name) {
    issues.push(
      createValidationIssue(
        "Form",
        1,
        "Name",
        "Name is required",
        "error"
      )
    );
  }
  
  if (!data.email) {
    issues.push(
      createValidationIssue(
        "Form",
        1,
        "Email",
        "Email is required",
        "error"
      )
    );
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// In JSX
<ValidationModal
  isOpen={state.validation.isOpen}
  onClose={closeValidationModal}
  result={state.validation.result!}
/>
```

---

### Pattern 4: Confirmation (confirm())

**Before:**
```tsx
const handleDelete = () => {
  if (confirm("Delete this item?")) {
    performDelete();
  }
};
```

**After:**
```tsx
const { state, openWarningModal, closeWarningModal } = useFeedbackModal();

const handleDelete = () => {
  openWarningModal(
    "Delete this item? This cannot be undone.",
    () => {
      performDelete();
    }
  );
};

// In JSX
<WarningModal
  isOpen={state.warning.isOpen}
  onClose={closeWarningModal}
  message={state.warning.message}
  onContinue={state.warning.onContinue}
  continueLabel="Delete"
  cancelLabel="Cancel"
/>
```

---

## 🏗️ Complete Page Migration

### Before (Using alert/confirm)

```tsx
export default function OldPage() {
  const [data, setData] = useState([]);
  
  const handleSave = async () => {
    // Validate
    if (data.length === 0) {
      alert("No data to save!");
      return;
    }
    
    const errors = validateData(data);
    if (errors.length > 0) {
      alert(`Errors:\n${errors.join('\n')}`);
      return;
    }
    
    // Save
    try {
      await saveToAPI(data);
      alert("Saved successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  
  const handleDelete = (id) => {
    if (confirm("Delete this item?")) {
      setData(data.filter(item => item.id !== id));
    }
  };
  
  return (
    <div>
      <button onClick={handleSave}>Save</button>
      {/* ... */}
    </div>
  );
}
```

### After (Using Feedback Modals)

```tsx
import {
  useFeedbackModal,
  ValidationModal,
  SuccessModal,
  ErrorModal,
  WarningModal,
} from "@/core/feedback";

export default function NewPage() {
  const [data, setData] = useState([]);
  
  const {
    state,
    openValidationModal,
    closeValidationModal,
    openSuccessModal,
    closeSuccessModal,
    openErrorModal,
    closeErrorModal,
    openWarningModal,
    closeWarningModal,
  } = useFeedbackModal();
  
  const handleSave = async () => {
    // Validate
    if (data.length === 0) {
      openErrorModal("No data to save!");
      return;
    }
    
    const result = validateData(data);
    if (!result.isValid) {
      openValidationModal(result);
      return;
    }
    
    // Save
    try {
      await saveToAPI(data);
      openSuccessModal("Saved successfully!");
    } catch (error) {
      openErrorModal(
        "Failed to save",
        "Error",
        error.message
      );
    }
  };
  
  const handleDelete = (id) => {
    openWarningModal(
      "Delete this item? This cannot be undone.",
      () => {
        setData(data.filter(item => item.id !== id));
      }
    );
  };
  
  return (
    <div>
      <button onClick={handleSave}>Save</button>
      {/* ... */}
      
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
        detail={state.error.detail}
      />
      <WarningModal
        isOpen={state.warning.isOpen}
        onClose={closeWarningModal}
        message={state.warning.message}
        onContinue={state.warning.onContinue}
      />
    </div>
  );
}
```

---

## 📊 Migration Summary

| Old | New | Benefit |
|-----|-----|---------|
| `alert("Success!")` | `openSuccessModal("Success!")` | Better UX, auto-close option |
| `alert("Error")` | `openErrorModal("Error")` | Can show detail, title |
| `alert(errors.join('\n'))` | `openValidationModal(result)` | Structured, scannable |
| `confirm("Delete?")` | `openWarningModal("Delete?", onContinue)` | Clearer actions |

---

## ✅ Testing After Migration

1. **Visual Check:**
   - Modals appear centered
   - Backdrop dims page
   - Text is readable
   - Colors are correct

2. **Keyboard:**
   - Escape closes modal
   - Tab stays within modal
   - Enter activates primary action

3. **Accessibility:**
   - Screen reader announces modal
   - Focus moves to modal
   - ARIA labels present

4. **Mobile:**
   - Modal fits screen
   - Text is readable
   - Buttons are tappable

---

## 🐛 Common Issues

### Issue: Modal doesn't open

**Problem:** Forgot to add modal component to JSX

**Solution:**
```tsx
<ValidationModal
  isOpen={state.validation.isOpen}
  onClose={closeValidationModal}
  result={state.validation.result!}
/>
```

---

### Issue: "Cannot read property 'result' of null"

**Problem:** ValidationModal rendered when result is null

**Solution:** Add conditional or non-null assertion
```tsx
{state.validation.result && (
  <ValidationModal
    isOpen={state.validation.isOpen}
    onClose={closeValidationModal}
    result={state.validation.result}
  />
)}
```

Or use non-null assertion (safe because isOpen is only true when result exists):
```tsx
<ValidationModal
  isOpen={state.validation.isOpen}
  onClose={closeValidationModal}
  result={state.validation.result!}
/>
```

---

### Issue: Multiple modals open at once

**Problem:** Not closing previous modal before opening new one

**Solution:** Close explicitly or use separate state for each type
```tsx
// The hook manages separate state for each modal type
// So this won't happen unless you manually call multiple opens
```

---

## 🎓 Best Practices

1. **One Hook Per Page**
   ```tsx
   const modal = useFeedbackModal();
   // Use modal.openSuccessModal(), modal.state, etc.
   ```

2. **Render All Modals You Use**
   ```tsx
   return (
     <>
       {/* Page content */}
       
       {/* All modals at bottom */}
       <ValidationModal ... />
       <SuccessModal ... />
       <ErrorModal ... />
     </>
   );
   ```

3. **Clear Error Messages**
   ```tsx
   // ❌ Bad
   openErrorModal("Error");
   
   // ✅ Good
   openErrorModal(
     "Failed to save data",
     "Save Error",
     "Network connection timeout"
   );
   ```

4. **Use Validation Adapters**
   ```tsx
   // ✅ Good - reusable, type-safe
   const result = validateOceanSheets(sheets);
   openValidationModal(result);
   ```

---

## 📚 Resources

- **README:** `src/core/feedback/README.md`
- **Examples:** `src/core/feedback/EXAMPLES.tsx`
- **Quick Reference:** `src/core/feedback/QUICK_REFERENCE.md`

---

**Happy Migrating! 🚀**
