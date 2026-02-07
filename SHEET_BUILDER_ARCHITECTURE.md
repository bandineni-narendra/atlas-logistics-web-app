# Generic Sheet Builder Architecture

## 📐 Overview

This is an enterprise-grade, **domain-agnostic** Excel-like Sheet Builder for Next.js + TypeScript applications. The architecture strictly separates **generic core functionality** from **domain-specific logic** through configuration injection.

## 🏗️ Architecture Principles

### ✅ Core Sheet Builder (Generic)

- **Zero domain knowledge**
- Handles only: Sheets, Columns, Rows, Cells
- Renders Excel-like UI with tabs, editable cells
- Completely reusable across domains

### ✅ Domain Layer (Strict & Typed)

- Each domain (Air Freight, Ocean Freight) is isolated
- Defines strict data models
- Provides column configurations
- Handles validation and mapping
- **Never imports core code**

### ✅ Configuration Injection

- Domains pass configuration to core via props
- No coupling between layers
- Clean separation of concerns

---

## 📁 Folder Structure

```
src/
├── core/
│   └── sheet-builder/
│       ├── models/                  # Generic data models
│       │   ├── Sheet.ts
│       │   ├── Column.ts
│       │   ├── Row.ts
│       │   └── Cell.ts
│       ├── types/                   # Generic types
│       │   └── ColumnType.ts
│       ├── SheetBuilder.tsx         # Main component
│       └── index.ts                 # Public API
│
├── components/
│   └── sheet-builder/               # UI components (integrated with existing components/)
│       ├── SheetTabs/
│       ├── SheetTable/
│       ├── TableHeader/
│       ├── TableRow/
│       ├── TableCell/
│       ├── AddRowButton/
│       └── AddColumnButton/
│
├── hooks/
│   └── sheet-builder/               # State management (integrated with existing hooks/)
│       ├── useSheetManager.ts
│       └── useSheetState.ts
│
├── domains/
│   ├── air-freight/                 # Air Freight domain
│   │   ├── models/
│   │   │   ├── AirRate.ts          # Strict domain model
│   │   │   └── index.ts
│   │   ├── config/
│   │   │   ├── airColumns.ts       # Column configuration
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   └── CreateAirSheet.tsx  # Domain page
│   │   └── index.ts
│   │
│   ├── ocean-freight/               # Ocean Freight domain
│   │   ├── models/
│   │   │   ├── OceanRate.ts        # Strict domain model
│   │   │   └── index.ts
│   │   ├── config/
│   │   │   ├── oceanColumns.ts     # Column configuration
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   └── CreateOceanSheet.tsx # Domain page
│   │   └── index.ts
│   │
│   └── index.ts
│
└── app/                             # Next.js App Router
    ├── air-freight-sheet/
    │   └── page.tsx
    └── ocean-freight-sheet/
        └── page.tsx
```

---

## 🔧 Core Sheet Builder

### Generic Data Models

```typescript
// Sheet contains columns and rows
export interface Sheet {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
}

// Column definition (what type, label, etc.)
export interface Column {
  id: string;
  label: string;
  type: ColumnType;
  required?: boolean;
  options?: ColumnOption[];
  width?: number;
}

// Row contains cells mapped by column ID
export interface Row {
  id: string;
  cells: Record<string, CellValue>;
}

// Cell values are primitives
export type CellValue = string | number | boolean | null;
```

### Column Types

```typescript
export enum ColumnType {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  SELECT = "select",
  BOOLEAN = "boolean",
}
```

### Usage

```tsx
import { SheetBuilder, Column, ColumnType } from "@/core/sheet-builder";

const columns: Column[] = [
  { id: "name", label: "Name", type: ColumnType.TEXT, required: true },
  { id: "age", label: "Age", type: ColumnType.NUMBER },
];

<SheetBuilder
  initialColumns={columns}
  onChange={(sheets) => console.log(sheets)}
  multiSheet={true}
/>;
```

---

## 🌍 Domain Layer

### Air Freight Example

#### 1. Domain Model (`AirRate.ts`)

```typescript
export interface AirRate {
  origin: string;
  destination: string;
  airline: string;
  serviceLevel: string;
  minRate: number;
  rate45: number;
  rate100: number;
  currency: string;
  validFrom: string;
  validTo: string;
}
```

#### 2. Column Configuration (`airColumns.ts`)

```typescript
import { Column, ColumnType, createColumn } from "@/core/sheet-builder";

export const airFreightColumns: Column[] = [
  createColumn({
    id: "origin",
    label: "Origin",
    type: ColumnType.TEXT,
    required: true,
  }),
  createColumn({
    id: "destination",
    label: "Destination",
    type: ColumnType.TEXT,
    required: true,
  }),
  // ... more columns
];
```

#### 3. Domain Page (`CreateAirSheet.tsx`)

```tsx
import { SheetBuilder } from "@/core/sheet-builder";
import { airFreightColumns } from "../config";

export default function CreateAirSheet() {
  return (
    <SheetBuilder initialColumns={airFreightColumns} onChange={handleChange} />
  );
}
```

---

## 🚀 Features

### ✨ Core Features

- ✅ Multiple sheets with tabs
- ✅ Add/remove rows (➕ button on each row)
- ✅ Add/remove columns (➕ button in header)
- ✅ Inline editable cells
- ✅ Support for TEXT, NUMBER, DATE, SELECT, BOOLEAN
- ✅ Responsive table layout
- ✅ Type-safe throughout

### ✨ Domain Features

- ✅ Strict TypeScript models
- ✅ Domain-specific validation
- ✅ Mapping from sheet data to domain models
- ✅ Export-ready structured data
- ✅ Validation error display

---

## 🛠️ Technology Stack

- **Next.js 14+** (App Router)
- **TypeScript** (Strict mode)
- **React 18+** (Functional components)
- **Tailwind CSS** (Styling)
- **No external spreadsheet libraries**

---

## 📝 Usage Examples

### Creating a New Domain

1. **Create domain folder**: `src/domains/my-domain/`

2. **Define your model**:

```typescript
// src/domains/my-domain/models/MyModel.ts
export interface MyModel {
  field1: string;
  field2: number;
}
```

3. **Create column config**:

```typescript
// src/domains/my-domain/config/myColumns.ts
import { Column, ColumnType, createColumn } from "@/core/sheet-builder";

export const myColumns: Column[] = [
  createColumn({
    id: "field1",
    label: "Field 1",
    type: ColumnType.TEXT,
    required: true,
  }),
];
```

4. **Create domain page**:

```tsx
// src/domains/my-domain/pages/CreateMySheet.tsx
import { SheetBuilder } from "@/core/sheet-builder";
import { myColumns } from "../config";

export default function CreateMySheet() {
  return <SheetBuilder initialColumns={myColumns} />;
}
```

5. **Add Next.js route**:

```tsx
// src/app/my-domain-sheet/page.tsx
import CreateMySheet from "@/domains/my-domain/pages/CreateMySheet";
export default CreateMySheet;
```

---

## 🎯 Design Goals

1. **Reusability**: Core builder works for ANY domain
2. **Type Safety**: Strict TypeScript everywhere
3. **Separation of Concerns**: Core has ZERO domain knowledge
4. **Scalability**: Easy to add new domains
5. **Maintainability**: Clean folder structure & exports
6. **Testability**: Pure functions & isolated logic

---

## 🔒 Rules & Constraints

### ❌ Core MUST NOT:

- Import any domain-specific code
- Contain business logic
- Know about Air Freight, Ocean Freight, etc.
- Perform domain validation

### ✅ Domain MUST:

- Define strict typed models
- Provide column configurations
- Handle validation and mapping
- Stay isolated from other domains

---

## 📊 Data Flow

```
User Input
    ↓
SheetBuilder (Generic UI)
    ↓
Sheet State (Generic Hooks)
    ↓
onChange Callback
    ↓
Domain Page (Receives raw sheet data)
    ↓
Domain Mapper (Converts to domain model)
    ↓
Domain Validator (Checks business rules)
    ↓
API / Export
```

---

## 🧪 Testing Strategy

- **Core**: Test generic functionality in isolation
- **Domains**: Test validation & mapping separately
- **Integration**: Test configuration injection

---

## 📚 API Reference

### SheetBuilder Component

```typescript
interface SheetBuilderProps {
  initialColumns?: Column[];
  onChange?: (sheets: Sheet[]) => void;
  multiSheet?: boolean;
}
```

### Hooks

```typescript
// Manage multiple sheets
const manager = useSheetManager(initialSheets);

// Manage single sheet
const state = useSheetState(initialSheet);
```

---

## 🎨 Styling

All components use Tailwind CSS with:

- Hover states for better UX
- Focus states for accessibility
- Clean, minimal design
- Responsive layout

---

## 🚦 Routes

- `/air-freight-sheet` - Air Freight rate sheet builder
- `/ocean-freight-sheet` - Ocean Freight rate sheet builder

---

## 📖 Next Steps

1. Add CSV/Excel import functionality
2. Add data export (JSON, CSV, Excel)
3. Add undo/redo functionality
4. Add formula support
5. Add cell formatting options
6. Add more column types (currency, phone, email)

---

## 👨‍💻 Development Guidelines

1. **Never mix concerns**: Core stays generic
2. **Type everything**: No `any` types
3. **Export cleanly**: Use index.ts everywhere
4. **Document intent**: Clear comments on architecture decisions
5. **Test thoroughly**: Unit tests for core, integration for domains

---

## 📄 License

This architecture is designed for enterprise use in the Atlas Logistics Web App.

---

**Built with ❤️ for scalability, reusability, and maintainability.**
