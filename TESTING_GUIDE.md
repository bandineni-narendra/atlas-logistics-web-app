# ✅ Testing & Verification Guide

## 🎯 Manual Testing Checklist

### Pre-Flight Checks

- [ ] No TypeScript errors (`npm run type-check` or check VS Code)
- [ ] Development server runs (`npm run dev`)
- [ ] Pages accessible at correct routes

---

## 📋 Test Suite 1: Air Freight Sheet

### Test 1.1: Page Load

**Steps:**

1. Navigate to `http://localhost:3000/air-freight-sheet`
2. Verify page title: "Air Freight Rate Sheet"
3. Verify SheetBuilder component renders
4. Verify "Sheet 1" tab is visible
5. Verify all 15 columns are present:
   - Origin, Destination, Airline, Service Level
   - Min Rate, Rate +45kg, Rate +100kg, Rate +250kg, Rate +500kg, Rate +1000kg
   - Currency, Valid From, Valid To, Transit Time, Remarks

**Expected Result:** ✅ Page loads with all columns visible

---

### Test 1.2: Add Row

**Steps:**

1. Click the "➕" (Add Row) button
2. Verify new empty row appears
3. Click again
4. Verify second row appears

**Expected Result:** ✅ Rows are added successfully

---

### Test 1.3: Edit Cells - Text Fields

**Steps:**

1. Click on "Origin" cell in first row
2. Type "JFK"
3. Click on "Destination" cell
4. Type "LHR"
5. Click on "Airline" cell
6. Type "Emirates"

**Expected Result:** ✅ Text values are entered and saved

---

### Test 1.4: Edit Cells - Dropdown

**Steps:**

1. Click on "Service Level" cell
2. Verify dropdown appears with options: Express, Standard, Economy
3. Select "Express"
4. Click on "Currency" cell
5. Select "USD"

**Expected Result:** ✅ Dropdown values are selected correctly

---

### Test 1.5: Edit Cells - Numbers

**Steps:**

1. Enter "250" in "Min Rate"
2. Enter "4.5" in "Rate +45kg"
3. Enter "3.8" in "Rate +100kg"
4. Enter "3.2" in "Rate +250kg"
5. Enter "2.9" in "Rate +500kg"
6. Enter "2.5" in "Rate +1000kg"

**Expected Result:** ✅ Number values are entered correctly

---

### Test 1.6: Edit Cells - Dates

**Steps:**

1. Click on "Valid From" cell
2. Select today's date
3. Click on "Valid To" cell
4. Select date 30 days from now

**Expected Result:** ✅ Dates are selected correctly

---

### Test 1.7: Delete Row

**Steps:**

1. Add 3 rows
2. Click trash icon on second row
3. Verify row is removed
4. Verify row numbers update (1, 2 instead of 1, 3)

**Expected Result:** ✅ Row deleted successfully

---

### Test 1.8: Add Column

**Steps:**

1. Click "Add Column" button
2. Verify new column appears with label "Column 16"
3. Verify all existing rows have empty cells in new column

**Expected Result:** ✅ Column added successfully

---

### Test 1.9: Delete Column

**Steps:**

1. Click "×" button on a column header
2. Verify column is removed
3. Verify data in other columns remains intact

**Expected Result:** ✅ Column deleted successfully

---

### Test 1.10: Validation - Empty Required Fields

**Steps:**

1. Add a row
2. Leave "Origin" empty
3. Leave "Destination" empty
4. Fill in some other fields
5. Click "Validate & Export"
6. Check validation errors

**Expected Result:** ✅ Validation errors appear for required fields

---

### Test 1.11: Validation - Valid Data

**Steps:**

1. Add a row with all required fields filled:
   - Origin: "JFK"
   - Destination: "LHR"
   - Airline: "Emirates"
   - Service Level: "Express"
   - All rates: valid numbers
   - Currency: "USD"
   - Valid From: Today
   - Valid To: Future date
2. Click "Validate & Export"
3. Check browser console

**Expected Result:** ✅ Success message, data logged to console

---

### Test 1.12: Multiple Sheets

**Steps:**

1. Click "Add Sheet" button
2. Verify "Sheet 2" tab appears
3. Verify active sheet switches to Sheet 2
4. Add data to Sheet 2
5. Switch back to Sheet 1
6. Verify Sheet 1 data is preserved

**Expected Result:** ✅ Multiple sheets work independently

---

### Test 1.13: Delete Sheet

**Steps:**

1. Create 2 sheets
2. Click "×" on Sheet 2 tab
3. Verify Sheet 2 is removed
4. Try to delete the last remaining sheet
5. Verify at least one sheet remains

**Expected Result:** ✅ Cannot delete last sheet

---

## 📋 Test Suite 2: Ocean Freight Sheet

### Test 2.1: Page Load

**Steps:**

1. Navigate to `http://localhost:3000/ocean-freight-sheet`
2. Verify page title: "Ocean Freight Rate Sheet"
3. Verify all 13 columns are present:
   - POL, POD, Carrier, Service Type
   - 20' Container, 40' Container, 40' HC, 45' HC
   - Currency, Valid From, Valid To, Transit Time, Free Days, Remarks

**Expected Result:** ✅ Page loads with ocean-specific columns

---

### Test 2.2: Different Column Structure

**Steps:**

1. Compare columns with Air Freight page
2. Verify different field names (POL vs Origin, Container types vs Rates)
3. Verify same UI, different domain

**Expected Result:** ✅ Domain separation confirmed

---

### Test 2.3: Ocean Data Entry

**Steps:**

1. Add a row
2. Enter data:
   - POL: "Shanghai"
   - POD: "Los Angeles"
   - Carrier: "Maersk"
   - Service Type: "Direct"
   - 20' Container: "1500"
   - 40' Container: "2500"
   - 40' HC: "2800"
   - Currency: "USD"
   - Valid From: Today
   - Valid To: Future date

**Expected Result:** ✅ Ocean freight data entered successfully

---

### Test 2.4: Ocean Validation

**Steps:**

1. Add row with incomplete data
2. Click "Validate & Export"
3. Verify ocean-specific validation errors

**Expected Result:** ✅ Ocean freight validation works

---

## 📋 Test Suite 3: Core Functionality

### Test 3.1: Cell Type - TEXT

**Steps:**

1. Enter text with special characters: "Test-123 (ABC)"
2. Verify text is stored correctly

**Expected Result:** ✅ TEXT type works

---

### Test 3.2: Cell Type - NUMBER

**Steps:**

1. Enter integer: "100"
2. Enter decimal: "99.99"
3. Enter negative: "-50"
4. Try to enter text: "abc"

**Expected Result:** ✅ Only numbers accepted

---

### Test 3.3: Cell Type - DATE

**Steps:**

1. Click date cell
2. Verify date picker appears
3. Select a date
4. Verify date is formatted correctly

**Expected Result:** ✅ DATE type works

---

### Test 3.4: Cell Type - SELECT

**Steps:**

1. Click select cell
2. Verify dropdown appears
3. Verify all options present
4. Select an option
5. Try to type custom value

**Expected Result:** ✅ Only predefined options selectable

---

### Test 3.5: Cell Type - BOOLEAN

**Steps:**

1. If boolean column exists, click checkbox
2. Verify checked/unchecked states

**Expected Result:** ✅ BOOLEAN type works

---

## 📋 Test Suite 4: Edge Cases

### Test 4.1: Empty Sheet

**Steps:**

1. Load page
2. Don't add any rows
3. Click "Validate & Export"

**Expected Result:** ✅ No errors, empty dataset

---

### Test 4.2: Large Dataset

**Steps:**

1. Add 50 rows
2. Fill in data
3. Verify scrolling works
4. Verify performance is acceptable

**Expected Result:** ✅ Handles multiple rows

---

### Test 4.3: Special Characters

**Steps:**

1. Enter: "Test@#$%^&\*()"
2. Enter: "Test\nNewline"
3. Enter: "Test'Quote"

**Expected Result:** ✅ Special characters handled

---

### Test 4.4: Very Long Text

**Steps:**

1. Enter 500 characters in a text field
2. Verify cell expands or scrolls

**Expected Result:** ✅ Long text handled

---

### Test 4.5: Rapid Clicking

**Steps:**

1. Click "Add Row" 10 times rapidly
2. Verify all rows are added
3. Delete multiple rows rapidly
4. Verify state remains consistent

**Expected Result:** ✅ No race conditions

---

## 📋 Test Suite 5: Browser Compatibility

### Test 5.1: Chrome

- [ ] All tests pass in Chrome

### Test 5.2: Firefox

- [ ] All tests pass in Firefox

### Test 5.3: Safari

- [ ] All tests pass in Safari

### Test 5.4: Edge

- [ ] All tests pass in Edge

---

## 📋 Test Suite 6: Responsive Design

### Test 6.1: Desktop (1920x1080)

**Steps:**

1. Set browser to 1920x1080
2. Verify layout looks good
3. Verify all columns visible

**Expected Result:** ✅ Desktop layout works

---

### Test 6.2: Laptop (1366x768)

**Steps:**

1. Set browser to 1366x768
2. Verify horizontal scroll appears if needed
3. Verify UI remains usable

**Expected Result:** ✅ Laptop layout works

---

### Test 6.3: Tablet (768x1024)

**Steps:**

1. Set browser to 768x1024
2. Verify table scrolls horizontally
3. Verify buttons are still clickable

**Expected Result:** ✅ Tablet layout works

---

## 📋 Test Suite 7: Data Integrity

### Test 7.1: Sheet Switching Preserves Data

**Steps:**

1. Enter data in Sheet 1
2. Switch to Sheet 2
3. Enter different data
4. Switch back to Sheet 1
5. Verify original data intact

**Expected Result:** ✅ Data preserved across sheets

---

### Test 7.2: Column Add Preserves Rows

**Steps:**

1. Add 5 rows with data
2. Add a new column
3. Verify all 5 rows have cells in new column (empty)
4. Verify existing data intact

**Expected Result:** ✅ Rows preserved when adding columns

---

### Test 7.3: Row Delete Preserves Other Rows

**Steps:**

1. Add 5 rows with unique data
2. Delete row 3
3. Verify rows 1, 2, 4, 5 have correct data
4. Verify row numbers updated

**Expected Result:** ✅ Other rows intact after deletion

---

## 🐛 Known Issues / Limitations

Document any issues found during testing:

| Issue | Severity | Status |
| ----- | -------- | ------ |
| -     | -        | -      |

---

## 📊 Test Results Summary

| Test Suite            | Total Tests | Passed | Failed | Skipped |
| --------------------- | ----------- | ------ | ------ | ------- |
| Air Freight Sheet     | 13          | -      | -      | -       |
| Ocean Freight Sheet   | 4           | -      | -      | -       |
| Core Functionality    | 5           | -      | -      | -       |
| Edge Cases            | 5           | -      | -      | -       |
| Browser Compatibility | 4           | -      | -      | -       |
| Responsive Design     | 3           | -      | -      | -       |
| Data Integrity        | 3           | -      | -      | -       |
| **TOTAL**             | **37**      | **-**  | **-**  | **-**   |

---

## 🚀 Automated Testing (Future)

### Unit Tests (Recommended)

```typescript
// Example: Test createColumn helper
describe("createColumn", () => {
  it("should create column with defaults", () => {
    const column = createColumn({
      id: "test",
      label: "Test",
      type: ColumnType.TEXT,
    });
    expect(column.required).toBe(false);
    expect(column.width).toBe(150);
  });
});

// Example: Test validation
describe("validateAirRate", () => {
  it("should return errors for missing required fields", () => {
    const rate: AirRate = {
      origin: "",
      destination: "LHR",
      // ... other fields
    };
    const errors = validateAirRate(rate);
    expect(errors).toContain("Origin is required");
  });
});
```

### Integration Tests (Recommended)

```typescript
// Example: Test SheetBuilder component
describe('SheetBuilder', () => {
  it('should render with initial columns', () => {
    render(<SheetBuilder initialColumns={testColumns} />);
    expect(screen.getByText('Column 1')).toBeInTheDocument();
  });

  it('should add row when button clicked', () => {
    render(<SheetBuilder initialColumns={testColumns} />);
    fireEvent.click(screen.getByTitle('Add row'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

### E2E Tests (Recommended)

```typescript
// Example: Playwright test
test("should create air freight rate", async ({ page }) => {
  await page.goto("/air-freight-sheet");
  await page.click('button:has-text("Add Row")');
  await page.fill('input[placeholder="e.g., JFK"]', "JFK");
  await page.fill('input[placeholder="e.g., LHR"]', "LHR");
  await page.click('button:has-text("Validate & Export")');
  await expect(page.locator(".bg-red-50")).not.toBeVisible();
});
```

---

## 📝 Test Execution Log

Date: ****\_\_\_****
Tester: ****\_\_\_****

### Session 1

- [ ] Test Suite 1: Air Freight Sheet
- [ ] Test Suite 2: Ocean Freight Sheet
- [ ] Test Suite 3: Core Functionality

### Session 2

- [ ] Test Suite 4: Edge Cases
- [ ] Test Suite 5: Browser Compatibility
- [ ] Test Suite 6: Responsive Design
- [ ] Test Suite 7: Data Integrity

---

## ✅ Acceptance Criteria

Before marking as "Production Ready", verify:

- [ ] All manual tests pass
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] No console warnings
- [ ] Works in all major browsers
- [ ] Responsive on different screen sizes
- [ ] Data validation works correctly
- [ ] Export functionality works
- [ ] Documentation is complete
- [ ] Code is clean and commented

---

## 🎯 Performance Benchmarks

| Metric                | Target  | Actual |
| --------------------- | ------- | ------ |
| Initial page load     | < 2s    | -      |
| Add row operation     | < 100ms | -      |
| Delete row operation  | < 100ms | -      |
| Cell edit response    | < 50ms  | -      |
| Validation (100 rows) | < 1s    | -      |

---

## 📞 Bug Reporting Template

If you find a bug, document it:

```
**Title:** [Brief description]

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**

**Actual Result:**

**Browser:** Chrome / Firefox / Safari / Edge

**Screen Size:**

**Screenshot:** (if applicable)

**Console Errors:** (if any)
```

---

**Testing is complete when all checkboxes are marked ✅**
