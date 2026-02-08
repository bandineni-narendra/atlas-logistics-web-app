# Atlas Logistics Web App

Enterprise-grade logistics management platform with **Authentication**, **Generic Sheet Builder**, and AI-powered data processing.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser and login
# Login: http://localhost:3000/login
# Use: demo@atlas.io / Demo123!
```

## 📚 Documentation

- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Authentication system guide
- **[TEST_CREDENTIALS.md](./TEST_CREDENTIALS.md)** - Test login credentials
- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[SHEET_BUILDER_ARCHITECTURE.md](./SHEET_BUILDER_ARCHITECTURE.md)** - Complete architecture guide
- **[DEVELOPER_REFERENCE.md](./DEVELOPER_REFERENCE.md)** - Developer quick reference
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Full documentation index

## ✨ Features

### 🔐 Authentication System

Professional-grade authentication with session management:

- ✅ Email/password login and signup
- ✅ Google OAuth integration
- ✅ Encrypted session storage
- ✅ Route protection
- ✅ User profile management
- ✅ Auto-restore sessions

**Routes:**

- `/login` - User login
- `/signup` - New user registration
- `/profile` - User profile page

### 📊 Generic Sheet Builder

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
├── api/
│   ├── auth_client.ts     # Authentication API
│   ├── client.ts          # Main API client
│   └── flow_client.ts     # Flow-specific API
├── contexts/
│   ├── AuthContext.tsx    # Global auth state
│   └── SheetBuilderContext.tsx
├── components/
│   ├── auth/              # Auth components
│   ├── ui/                # UI primitives
│   └── sheet-builder/     # Sheet builder components
├── core/
│   └── sheet-builder/     # Generic, reusable sheet builder
├── domains/
│   ├── air-freight/       # Air Freight domain
│   └── ocean-freight/     # Ocean Freight domain
└── app/                   # Next.js routes
    ├── login/             # Login page
    ├── signup/            # Signup page
    ├── profile/           # User profile
    └── ...                # Other routes
```

See [ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md) for detailed diagrams.

## 🎯 Original Flow

1. UI -> Import Excels -> Show UI Visualization
2. Backend -> Send Excel -> Format with AI
3. Firebase
4. Polling
