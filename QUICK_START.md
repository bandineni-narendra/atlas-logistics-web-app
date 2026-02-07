# Sheet Builder - Quick Start Guide

## 🚀 Getting Started

### Access the Applications

The Generic Sheet Builder has been implemented with two domain-specific pages:

1. **Air Freight Rate Sheet**
   - URL: `http://localhost:3000/air-freight-sheet`
   - Create and manage air freight rates

2. **Ocean Freight Rate Sheet**
   - URL: `http://localhost:3000/ocean-freight-sheet`
   - Create and manage ocean freight rates

### Running the Application

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev

# Open your browser
# Navigate to http://localhost:3000/air-freight-sheet
# or http://localhost:3000/ocean-freight-sheet
```

---

## 📝 How to Use

### 1. Adding Data

- **Add Row**: Click the ➕ button on the left side of any row
- **Add Column**: Click the "Add Column" button below the table
- **Edit Cell**: Click any cell and start typing
- **Delete Row**: Click the trash icon on each row
- **Delete Column**: Click the × button in the column header

### 2. Working with Sheets

- **Add Sheet**: Click the "Add Sheet" button in the tab bar
- **Switch Sheet**: Click on any sheet tab
- **Delete Sheet**: Click the × button on the sheet tab (minimum 1 sheet required)

### 3. Validating & Exporting

- Click **"Validate & Export"** button to:
  - Validate all data against business rules
  - See validation errors (if any)
  - Export valid data (check browser console)

---

## 🏗️ Architecture Quick Reference

### Core (Generic)

```
src/core/sheet-builder/
- SheetBuilder.tsx          # Main component
- models/                   # Generic data structures
- components/               # UI components
- hooks/                    # State management
```

### Domains (Specific)

```
src/domains/
- air-freight/
  - models/AirRate.ts       # Business model
  - config/airColumns.ts    # Column config
  - pages/CreateAirSheet.tsx # Page component

- ocean-freight/
  - models/OceanRate.ts     # Business model
  - config/oceanColumns.ts  # Column config
  - pages/CreateOceanSheet.tsx # Page component
```

---

## 🎯 Key Features Demonstrated

✅ **Domain Agnostic Core**: The SheetBuilder component knows nothing about Air or Ocean Freight

✅ **Configuration Injection**: Each domain passes its column definitions to the core

✅ **Type Safety**: Full TypeScript support with strict typing

✅ **Separation of Concerns**: Core UI is separate from business logic

✅ **Validation**: Domain-specific validation happens outside the core

✅ **Multi-Sheet Support**: Create multiple sheets with tabs

✅ **Dynamic Columns**: Add/remove columns on the fly

✅ **Editable Cells**: Inline editing with different input types

---

## 💡 Adding a New Domain

Want to add a new domain (e.g., Warehouse Management)?

### Step 1: Create Domain Folder

```bash
src/domains/warehouse/
├── models/
│   ├── WarehouseItem.ts
│   └── index.ts
├── config/
│   ├── warehouseColumns.ts
│   └── index.ts
├── pages/
│   └── CreateWarehouseSheet.tsx
└── index.ts
```

### Step 2: Define Your Model

```typescript
// src/domains/warehouse/models/WarehouseItem.ts
export interface WarehouseItem {
  sku: string;
  description: string;
  quantity: number;
  location: string;
}
```

### Step 3: Create Column Config

```typescript
// src/domains/warehouse/config/warehouseColumns.ts
import { Column, ColumnType, createColumn } from "@/core/sheet-builder";

export const warehouseColumns: Column[] = [
  createColumn({
    id: "sku",
    label: "SKU",
    type: ColumnType.TEXT,
    required: true,
  }),
  createColumn({
    id: "description",
    label: "Description",
    type: ColumnType.TEXT,
  }),
  createColumn({
    id: "quantity",
    label: "Quantity",
    type: ColumnType.NUMBER,
    required: true,
  }),
  createColumn({
    id: "location",
    label: "Location",
    type: ColumnType.TEXT,
  }),
];
```

### Step 4: Create Page

```typescript
// src/domains/warehouse/pages/CreateWarehouseSheet.tsx
'use client';

import { SheetBuilder } from '@/core/sheet-builder';
import { warehouseColumns } from '../config';

export default function CreateWarehouseSheet() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Warehouse Inventory</h1>
      <SheetBuilder
        initialColumns={warehouseColumns}
        onChange={(sheets) => console.log('Warehouse data:', sheets)}
      />
    </div>
  );
}
```

### Step 5: Add Route

```typescript
// src/app/warehouse-sheet/page.tsx
import CreateWarehouseSheet from "@/domains/warehouse/pages/CreateWarehouseSheet";
export default CreateWarehouseSheet;
```

### Step 6: Access

Navigate to: `http://localhost:3000/warehouse-sheet`

---

## 🔍 Testing the Implementation

### Test 1: Add Data

1. Go to `/air-freight-sheet`
2. Click "Add Row" button (➕)
3. Fill in: Origin="JFK", Destination="LHR"
4. Add more rows with data

### Test 2: Validation

1. Leave some required fields empty
2. Click "Validate & Export"
3. See validation errors appear in red box

### Test 3: Multiple Sheets

1. Click "Add Sheet" button
2. Switch between Sheet 1 and Sheet 2
3. Each sheet maintains independent data

### Test 4: Ocean Freight

1. Go to `/ocean-freight-sheet`
2. Notice completely different columns (POL, POD, Container types)
3. Same UI, different domain!

---

## 📊 Data Export

When you click "Validate & Export", the data is logged to the browser console as:

```javascript
// Air Freight Example
[
  {
    origin: "JFK",
    destination: "LHR",
    airline: "Emirates",
    serviceLevel: "express",
    minRate: 250,
    rate45: 4.5,
    rate100: 3.8,
    // ... more fields
  },
][
  // Ocean Freight Example
  {
    pol: "Shanghai",
    pod: "Los Angeles",
    carrier: "Maersk",
    serviceType: "direct",
    container20: 1500,
    container40: 2500,
    // ... more fields
  }
];
```

You can then send this data to your backend API.

---

## 🎨 Customization

### Change Column Width

```typescript
createColumn({
  id: "myField",
  label: "My Field",
  type: ColumnType.TEXT,
  width: 200, // pixels
});
```

### Add Select Options

```typescript
createColumn({
  id: "status",
  label: "Status",
  type: ColumnType.SELECT,
  options: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ],
});
```

### Make Field Required

```typescript
createColumn({
  id: "importantField",
  label: "Important Field",
  type: ColumnType.TEXT,
  required: true, // Shows asterisk (*)
});
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/core/sheet-builder'"

**Solution**: Ensure your `tsconfig.json` has the path alias configured:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Validation not working

**Solution**: Make sure you're implementing the `mapTo*` and `validate*` functions in your domain models.

### Issue: Cells not updating

**Solution**: Check that you're using the `onChange` callback and updating your state correctly.

---

## 📚 Learn More

- Read [SHEET_BUILDER_ARCHITECTURE.md](./SHEET_BUILDER_ARCHITECTURE.md) for detailed architecture documentation
- Explore the code in `src/core/sheet-builder/` to understand the implementation
- Check domain examples in `src/domains/air-freight/` and `src/domains/ocean-freight/`

---

## ✅ Verification Checklist

- [ ] Can add/remove rows
- [ ] Can add/remove columns
- [ ] Can edit cells inline
- [ ] Can create multiple sheets
- [ ] Can switch between sheets
- [ ] Validation shows errors
- [ ] Different domains work independently
- [ ] TypeScript has no errors
- [ ] Data exports correctly

---

**Happy Building! 🎉**
