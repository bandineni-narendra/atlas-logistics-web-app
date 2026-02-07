# 🚀 Developer Quick Reference Card

## 📁 Complete File Structure (What Was Built)

```
atlas-logistics-web-app/
│
├── src/
│   ├── core/
│   │   ├── index.ts                                 ✅ Central core export
│   │   └── sheet-builder/
│   │       ├── index.ts                             ✅ Sheet builder public API
│   │       ├── SheetBuilder.tsx                     ✅ Main component
│   │       │
│   │       ├── models/
│   │       │   ├── index.ts                         ✅ Models export
│   │       │   ├── Sheet.ts                         ✅ Sheet model + functions
│   │       │   ├── Column.ts                        ✅ Column model + helpers
│   │       │   ├── Row.ts                           ✅ Row model + helpers
│   │       │   └── Cell.ts                          ✅ Cell model
│   │       │
│   │       ├── types/
│   │       │   ├── index.ts                         ✅ Types export
│   │       │   └── ColumnType.ts                    ✅ ColumnType enum + CellValue
│   │       │
│   │       ├── hooks/
│   │       │   ├── index.ts                         ✅ Hooks export
│   │       │   ├── useSheetManager.ts               ✅ Multi-sheet state
│   │       │   └── useSheetState.ts                 ✅ Single sheet state
│   │       │
│   │       └── components/
│   │           ├── index.ts                         ✅ Components export
│   │           ├── SheetTabs/
│   │           │   ├── index.ts                     ✅ Export
│   │           │   └── SheetTabs.tsx                ✅ Tab navigation
│   │           ├── SheetTable/
│   │           │   ├── index.ts                     ✅ Export
│   │           │   └── SheetTable.tsx               ✅ Main table
│   │           ├── TableHeader/
│   │           │   ├── index.ts                     ✅ Export
│   │           │   └── TableHeader.tsx              ✅ Column headers
│   │           ├── TableRow/
│   │           │   ├── index.ts                     ✅ Export
│   │           │   └── TableRow.tsx                 ✅ Row rendering
│   │           ├── TableCell/
│   │           │   ├── index.ts                     ✅ Export
│   │           │   └── TableCell.tsx                ✅ Editable cells
│   │           ├── AddRowButton/
│   │           │   ├── index.ts                     ✅ Export
│   │           │   └── AddRowButton.tsx             ✅ Add row button
│   │           └── AddColumnButton/
│   │               ├── index.ts                     ✅ Export
│   │               └── AddColumnButton.tsx          ✅ Add column button
│   │
│   ├── domains/
│   │   ├── index.ts                                 ✅ Central domains export
│   │   │
│   │   ├── air-freight/
│   │   │   ├── index.ts                             ✅ Air freight export
│   │   │   ├── models/
│   │   │   │   ├── index.ts                         ✅ Models export
│   │   │   │   └── AirRate.ts                       ✅ AirRate model + validation
│   │   │   ├── config/
│   │   │   │   ├── index.ts                         ✅ Config export
│   │   │   │   └── airColumns.ts                    ✅ 15 column definitions
│   │   │   └── pages/
│   │   │       └── CreateAirSheet.tsx               ✅ Air freight page
│   │   │
│   │   └── ocean-freight/
│   │       ├── index.ts                             ✅ Ocean freight export
│   │       ├── models/
│   │       │   ├── index.ts                         ✅ Models export
│   │       │   └── OceanRate.ts                     ✅ OceanRate model + validation
│   │       ├── config/
│   │       │   ├── index.ts                         ✅ Config export
│   │       │   └── oceanColumns.ts                  ✅ 13 column definitions
│   │       └── pages/
│   │           └── CreateOceanSheet.tsx             ✅ Ocean freight page
│   │
│   └── app/
│       ├── air-freight-sheet/
│       │   └── page.tsx                             ✅ Air freight route
│       └── ocean-freight-sheet/
│           └── page.tsx                             ✅ Ocean freight route
│
├── SHEET_BUILDER_ARCHITECTURE.md                    ✅ Architecture guide
├── QUICK_START.md                                   ✅ Getting started guide
├── ARCHITECTURE_VISUAL.md                           ✅ Visual diagrams
└── IMPLEMENTATION_SUMMARY.md                        ✅ Implementation summary

Total Files Created: 48
```

---

## 🎯 Import Cheat Sheet

### Core Imports

```typescript
// Main component
import { SheetBuilder } from "@/core/sheet-builder";

// Types
import { ColumnType, CellValue, ColumnOption } from "@/core/sheet-builder";

// Models
import { Sheet, Column, Row, createColumn } from "@/core/sheet-builder";

// Hooks (advanced usage)
import { useSheetManager, useSheetState } from "@/core/sheet-builder";
```

### Domain Imports

```typescript
// Air Freight
import {
  AirRate,
  mapToAirRate,
  validateAirRate,
  airFreightColumns,
} from "@/domains/air-freight";

// Ocean Freight
import {
  OceanRate,
  mapToOceanRate,
  validateOceanRate,
  oceanFreightColumns,
} from "@/domains/ocean-freight";
```

---

## 🔧 Usage Patterns

### Pattern 1: Basic Usage

```typescript
import { SheetBuilder, ColumnType, createColumn } from '@/core/sheet-builder';

const columns = [
  createColumn({ id: 'name', label: 'Name', type: ColumnType.TEXT }),
  createColumn({ id: 'age', label: 'Age', type: ColumnType.NUMBER }),
];

export default function MyPage() {
  return <SheetBuilder initialColumns={columns} />;
}
```

### Pattern 2: With Data Callback

```typescript
import { SheetBuilder, Sheet } from '@/core/sheet-builder';
import { myColumns } from './config';

export default function MyPage() {
  const handleChange = (sheets: Sheet[]) => {
    console.log('Data changed:', sheets);
    // Validate, export, etc.
  };

  return (
    <SheetBuilder
      initialColumns={myColumns}
      onChange={handleChange}
    />
  );
}
```

### Pattern 3: Single Sheet Mode

```typescript
<SheetBuilder
  initialColumns={myColumns}
  multiSheet={false}  // Disable tabs
/>
```

### Pattern 4: With Validation

```typescript
const handleValidate = (sheets: Sheet[]) => {
  sheets.forEach(sheet => {
    sheet.rows.forEach(row => {
      const domainModel = mapToDomainModel(row.cells);
      const errors = validateDomainModel(domainModel);
      if (errors.length > 0) {
        console.error('Validation errors:', errors);
      }
    });
  });
};

<SheetBuilder
  initialColumns={myColumns}
  onChange={handleValidate}
/>
```

---

## 📝 Column Configuration Examples

### Text Column

```typescript
createColumn({
  id: "description",
  label: "Description",
  type: ColumnType.TEXT,
  placeholder: "Enter description...",
  width: 200,
});
```

### Number Column

```typescript
createColumn({
  id: "price",
  label: "Price",
  type: ColumnType.NUMBER,
  required: true,
  width: 120,
});
```

### Date Column

```typescript
createColumn({
  id: "startDate",
  label: "Start Date",
  type: ColumnType.DATE,
  required: true,
});
```

### Select/Dropdown Column

```typescript
createColumn({
  id: "status",
  label: "Status",
  type: ColumnType.SELECT,
  options: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Pending", value: "pending" },
  ],
});
```

### Boolean/Checkbox Column

```typescript
createColumn({
  id: "isActive",
  label: "Active",
  type: ColumnType.BOOLEAN,
});
```

---

## 🏗️ Adding New Domain - Step-by-Step

### 1️⃣ Create Folder Structure

```bash
src/domains/my-domain/
├── models/
│   ├── MyModel.ts
│   └── index.ts
├── config/
│   ├── myColumns.ts
│   └── index.ts
├── pages/
│   └── CreateMySheet.tsx
└── index.ts
```

### 2️⃣ Define Model (`models/MyModel.ts`)

```typescript
export interface MyModel {
  field1: string;
  field2: number;
  field3: string;
}

export function mapToMyModel(rowData: Record<string, any>): MyModel | null {
  try {
    return {
      field1: rowData.field1 || "",
      field2: parseFloat(rowData.field2) || 0,
      field3: rowData.field3 || "",
    };
  } catch {
    return null;
  }
}

export function validateMyModel(model: MyModel): string[] {
  const errors: string[] = [];
  if (!model.field1) errors.push("Field 1 is required");
  if (model.field2 <= 0) errors.push("Field 2 must be positive");
  return errors;
}
```

### 3️⃣ Create Config (`config/myColumns.ts`)

```typescript
import { Column, ColumnType, createColumn } from "@/core/sheet-builder";

export const myColumns: Column[] = [
  createColumn({
    id: "field1",
    label: "Field 1",
    type: ColumnType.TEXT,
    required: true,
  }),
  createColumn({
    id: "field2",
    label: "Field 2",
    type: ColumnType.NUMBER,
    required: true,
  }),
  createColumn({
    id: "field3",
    label: "Field 3",
    type: ColumnType.SELECT,
    options: [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
    ],
  }),
];
```

### 4️⃣ Create Page (`pages/CreateMySheet.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { SheetBuilder, Sheet } from '@/core/sheet-builder';
import { myColumns } from '../config';
import { mapToMyModel, validateMyModel } from '../models';

export default function CreateMySheet() {
  const [sheets, setSheets] = useState<Sheet[]>([]);

  const handleValidate = () => {
    sheets.forEach(sheet => {
      sheet.rows.forEach(row => {
        const model = mapToMyModel(row.cells);
        if (model) {
          const errors = validateMyModel(model);
          console.log('Validation:', errors.length === 0 ? 'OK' : errors);
        }
      });
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Domain Sheet</h1>
      <SheetBuilder
        initialColumns={myColumns}
        onChange={setSheets}
      />
      <button
        onClick={handleValidate}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Validate
      </button>
    </div>
  );
}
```

### 5️⃣ Add Exports (`index.ts` files)

```typescript
// models/index.ts
export * from "./MyModel";

// config/index.ts
export * from "./myColumns";

// domains/my-domain/index.ts
export * from "./models";
export * from "./config";
export { default as CreateMySheet } from "./pages/CreateMySheet";
```

### 6️⃣ Add Route (`app/my-domain-sheet/page.tsx`)

```typescript
import CreateMySheet from "@/domains/my-domain/pages/CreateMySheet";
export default CreateMySheet;
```

### 7️⃣ Test

Navigate to: `http://localhost:3000/my-domain-sheet`

---

## 🎨 Styling Customization

All components use Tailwind CSS. Key classes:

```css
/* Table borders */
.border-gray-200

/* Header background */
.bg-gray-100

/* Cell hover */
.hover:bg-gray-50

/* Buttons */
.hover:text-blue-600
.hover:bg-blue-50

/* Focus states */
.focus:ring-1
.focus:ring-blue-500
```

---

## 🔍 Debugging Tips

### Check Sheet Data

```typescript
<SheetBuilder
  onChange={(sheets) => {
    console.log('Current sheets:', sheets);
    console.log('Row count:', sheets[0].rows.length);
    console.log('Column count:', sheets[0].columns.length);
  }}
/>
```

### Validate Individual Cells

```typescript
const handleChange = (sheets: Sheet[]) => {
  sheets.forEach((sheet) => {
    sheet.rows.forEach((row, rowIdx) => {
      Object.entries(row.cells).forEach(([colId, value]) => {
        console.log(`Row ${rowIdx}, Column ${colId}:`, value);
      });
    });
  });
};
```

### Log Validation Errors

```typescript
const errors = validateMyModel(model);
if (errors.length > 0) {
  console.error("❌ Validation failed:", errors);
} else {
  console.log("✅ Validation passed");
}
```

---

## ⚡ Performance Tips

1. **Memoize callbacks** when passing to SheetBuilder

   ```typescript
   const handleChange = useCallback((sheets) => {
     // ...
   }, []);
   ```

2. **Debounce validation** for large datasets

   ```typescript
   const debouncedValidate = useMemo(() => debounce(validate, 300), []);
   ```

3. **Limit initial rows** for better UX
   ```typescript
   // Start with empty sheet
   // Let user add rows as needed
   ```

---

## 📊 Type Reference

```typescript
// Column Types
enum ColumnType {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  SELECT = "select",
  BOOLEAN = "boolean",
}

// Cell Value Types
type CellValue = string | number | boolean | null;

// Models
interface Sheet {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
}

interface Column {
  id: string;
  label: string;
  type: ColumnType;
  required?: boolean;
  options?: ColumnOption[];
  width?: number;
  placeholder?: string;
}

interface Row {
  id: string;
  cells: Record<string, CellValue>;
}

interface ColumnOption {
  label: string;
  value: string | number;
}
```

---

## 🚀 Ready to Code!

You now have everything you need to:

- ✅ Use the Generic Sheet Builder
- ✅ Create new domains
- ✅ Customize columns
- ✅ Validate data
- ✅ Export data

**Happy coding!** 🎉

---

## 📞 Quick Links

- Architecture: [SHEET_BUILDER_ARCHITECTURE.md](./SHEET_BUILDER_ARCHITECTURE.md)
- Quick Start: [QUICK_START.md](./QUICK_START.md)
- Visual Guide: [ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md)
- Implementation: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
