# Atlas Logistics Web App

Enterprise-grade logistics management platform with a powerful **Generic Sheet Builder**.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Air Freight: http://localhost:3000/air-freight-sheet
# Ocean Freight: http://localhost:3000/ocean-freight-sheet
```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[SHEET_BUILDER_ARCHITECTURE.md](./SHEET_BUILDER_ARCHITECTURE.md)** - Complete architecture guide
- **[DEVELOPER_REFERENCE.md](./DEVELOPER_REFERENCE.md)** - Developer quick reference
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Full documentation index

## ✨ New Features

### Generic Sheet Builder

Enterprise-grade, domain-agnostic Excel-like sheet builder:

- ✅ Multiple sheets with tabs
- ✅ Add/remove rows and columns dynamically
- ✅ Inline editable cells (text, number, date, select, boolean)
- ✅ Type-safe with TypeScript
- ✅ Completely reusable across domains
- ✅ Clean architecture with strict domain separation

**Routes:**

- `/air-freight-sheet` - Air Freight rate management
- `/ocean-freight-sheet` - Ocean Freight rate management

## 🏗️ Architecture

```
src/
├── core/
│   └── sheet-builder/     # Generic, reusable sheet builder
├── domains/
│   ├── air-freight/       # Air Freight domain
│   └── ocean-freight/     # Ocean Freight domain
└── app/                   # Next.js routes
```

See [ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md) for detailed diagrams.

## 🎯 Original Flow

1. UI -> Import Excels -> Show UI Visualization
2. Backend -> Send Excel -> Format with AI
3. Firebase
4. Polling
