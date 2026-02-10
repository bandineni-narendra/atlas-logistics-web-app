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
- **[BACKEND_FIX_REQUIRED_CUSTOM_CLAIMS.md](./BACKEND_FIX_REQUIRED_CUSTOM_CLAIMS.md)** - ⚠️ Backend custom claims implementation (CRITICAL)

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

---

## 🔐 Frontend-Backend Integration: Authentication & Custom Claims

### Frontend Signup Flow

The frontend follows this complete authentication flow during signup:

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: User Submits Form (signup/page.tsx)                    │
├─────────────────────────────────────────────────────────────────┤
│ • Email validation                                               │
│ • Password validation (min 8 chars, complexity)                │
│ • Name validation                                               │
│ → Calls AuthContext.signup(email, password, name)              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Firebase User Creation (services/auth.ts)              │
├─────────────────────────────────────────────────────────────────┤
│ 1. createUserWithEmailAndPassword(auth, email, password)       │
│    → Creates user in Firebase Authentication                   │
│                                                                  │
│ 2. firebaseUpdateProfile(user, { displayName: name })          │
│    → Sets display name in Firebase                             │
│                                                                  │
│ 3. credential.user.getIdToken()                                │
│    → Gets JWT token for backend communication                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Backend Sync (POST /auth/verify)                       │
├─────────────────────────────────────────────────────────────────┤
│ Frontend sends:  { idToken: "firebase-jwt-token" }             │
│                                                                  │
│ Backend should:                                                 │
│ • Verify Firebase token                                         │
│ • Extract: firebaseUid, email, name                           │
│ • Create Organization (1 per user initially)                   │
│ • Create User record with orgId link                          │
│ • ✅ SET CUSTOM CLAIMS on Firebase token                      │
│   (THIS IS CRITICAL - see Custom Claims Setup below)          │
│ • Return: { id, email, name, orgId, provider }               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Token Refresh & Store orgId                            │
├─────────────────────────────────────────────────────────────────┤
│ Frontend calls:  getIdToken(true)                              │
│ • Forces Firebase to get fresh token with new claims           │
│ • Extracts claims: { orgId, userId, email, ... }             │
│                                                                  │
│ Workaround Storage:                                            │
│ • localStorage.setItem('user_orgId', response.orgId)          │
│   (Temporary until backend sets custom claims)                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: Update Global Auth State                               │
├─────────────────────────────────────────────────────────────────┤
│ AuthContext.setUser(userData)                                  │
│ • Makes user available globally via useAuth()                  │
│ • Firebase auth state listeners activated                      │
│ • User can now access protected routes                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 6: Redirect to Home                                       │
├─────────────────────────────────────────────────────────────────┤
│ window.location.href = "/"                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Must Implement: Custom Claims Setup

**⚠️ CRITICAL**: The backend is responsible for setting Firebase custom claims. This is NOT optional.

#### What are Custom Claims?

Custom claims are additional data you attach to a Firebase token that persist across token refreshes and prove the user's authorization level:

```javascript
// Standard Firebase token (current):
{
  user_id: "abc123",
  email: "user@example.com",
  // ❌ No orgId - causes "Organization ID not found" error
}

// Token with custom claims (required):
{
  user_id: "abc123",
  email: "user@example.com",
  orgId: "org-xyz789",      // ✅ ADDED BY BACKEND
  userId: "user-db-id",     // ✅ ADDED BY BACKEND
  // Now secure and available on all requests
}
```

#### Implementation Steps

**1. Backend receives signup request:**

```typescript
// POST /auth/verify
@Post('verify')
async verifyToken(@Body() body: { idToken: string }) {
  // 1. Verify the Firebase token
  const decodedToken = await admin.auth().verifyIdToken(body.idToken);

  // Extract data
  const firebaseUid = decodedToken.uid;    // Firebase user ID
  const email = decodedToken.email;        // User email
  const name = decodedToken.name;          // Display name
```

**2. Backend creates User & Organization:**

```typescript
// 2. Check if user already exists (for login case)
let user = await this.usersRepository.findOneBy({ firebaseUid });

if (!user) {
  // NEW USER - Create organization
  const org = await this.organizationsRepository.save({
    name: `${email}'s Organization`,
    createdAt: new Date(),
  });

  // Create user record
  user = await this.usersRepository.save({
    firebaseUid, // Link to Firebase
    email,
    name,
    orgId: org.id, // Organization ownership
    createdAt: new Date(),
  });
}
```

**3. Backend SETS CUSTOM CLAIMS (THE CRITICAL STEP):**

```typescript
// 3. ⚠️ SET CUSTOM CLAIMS - This is what makes multi-tenancy work!
await admin.auth().setCustomUserClaims(firebaseUid, {
  userId: user.id, // User's database ID
  orgId: user.orgId, // Organization ID for multi-tenancy
});

console.log("✅ Custom claims set for:", { firebaseUid, orgId: user.orgId });
```

**4. Backend returns user data:**

```typescript
  // 4. Return user profile to frontend
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    orgId: user.orgId,      // Also in response as fallback
    provider: 'manual',
  };
}
```

#### Full Backend Implementation Example

```typescript
import * as admin from "firebase-admin";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: Repository<User>,
    private organizationsRepository: Repository<Organization>,
  ) {}

  /**
   * Helper: Set custom claims on Firebase user
   */
  private async setUserCustomClaims(
    firebaseUid: string,
    userId: string,
    orgId: string,
  ): Promise<void> {
    try {
      await admin.auth().setCustomUserClaims(firebaseUid, {
        userId,
        orgId,
      });
      console.log(`✅ Set custom claims for ${firebaseUid}:`, {
        userId,
        orgId,
      });
    } catch (error) {
      console.error("❌ Failed to set custom claims:", error);
      throw new Error("Failed to configure user claims");
    }
  }

  /**
   * Main endpoint: Verify Firebase token and create/sync user
   * Called by frontend during signup/login
   */
  @Post("verify")
  async verifyToken(@Body() body: { idToken: string }) {
    // 1. Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(body.idToken);
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }

    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name || email;

    // 2. Find or create user
    let user = await this.usersRepository.findOneBy({ firebaseUid });

    if (!user) {
      // Create new organization
      const org = await this.organizationsRepository.save({
        name: `${email}'s Organization`,
        createdAt: new Date(),
      });

      // Create new user
      user = await this.usersRepository.save({
        firebaseUid,
        email,
        name,
        orgId: org.id,
        createdAt: new Date(),
      });
    }

    // 3. ⚠️ SET CUSTOM CLAIMS - REQUIRED for API authentication
    await this.setUserCustomClaims(firebaseUid, user.id, user.orgId);

    // 4. Return user data
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      orgId: user.orgId,
      provider: "manual",
    };
  }

  /**
   * Google OAuth endpoint
   * Same flow as email/password signup
   */
  @Post("google")
  async googleAuth(@Body() body: { idToken: string }) {
    const decodedToken = await admin.auth().verifyIdToken(body.idToken);

    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name || email;
    const avatar = decodedToken.picture;

    let user = await this.usersRepository.findOneBy({ firebaseUid });

    if (!user) {
      const org = await this.organizationsRepository.save({
        name: `${name}'s Organization`,
        createdAt: new Date(),
      });

      user = await this.usersRepository.save({
        firebaseUid,
        email,
        name,
        avatar,
        orgId: org.id,
        createdAt: new Date(),
      });
    }

    // ⚠️ SET CUSTOM CLAIMS
    await this.setUserCustomClaims(firebaseUid, user.id, user.orgId);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      orgId: user.orgId,
      provider: "google",
    };
  }

  /**
   * Get current user
   * Backend should re-verify claims are still set
   */
  @Get("me")
  @UseGuards(AuthGuard) // Makes req.user available from JWT
  async getCurrentUser(@Request() req) {
    const firebaseUid = req.user.uid;

    const user = await this.usersRepository.findOneBy({ firebaseUid });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Re-ensure custom claims (safety check)
    await this.setUserCustomClaims(firebaseUid, user.id, user.orgId);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      orgId: user.orgId,
      provider: user.provider,
    };
  }
}
```

#### How Frontend Uses It

After backend sets custom claims:

```typescript
// Frontend automatically benefits:

// 1. Token refresh gets new claims
const token = await firebaseUser.getIdToken(true);

// 2. Parse and verify orgId is present
const payload = JSON.parse(atob(token.split(".")[1]));
console.log(payload.orgId); // ✅ Now available

// 3. All API requests protected by auth guard can use orgId
// Guard extracts from token: const { orgId } = decodedToken;
```

#### Testing

After implementing custom claims:

```javascript
// Browser console
const user = firebase.auth().currentUser;
const token = await user.getIdToken(true);
const claims = JSON.parse(atob(token.split(".")[1]));

console.log(claims);
// Should show:
// {
//   orgId: "org-abc123",          ✅ Custom claim
//   userId: "user-db-id",         ✅ Custom claim
//   user_id: "firebase-uid",      ✅ Standard claim
//   email: "user@example.com",    ✅ Standard claim
//   ...
// }
```

#### Why This Matters

| Without Custom Claims                  | With Custom Claims                        |
| -------------------------------------- | ----------------------------------------- |
| ❌ orgId only in response              | ✅ orgId in secure JWT token              |
| ❌ Frontend must use workaround header | ✅ Backend guard can use `req.user.orgId` |
| ❌ Not secure for production           | ✅ Cryptographically signed               |
| ❌ Easy to spoof organization          | ✅ Tamper-proof multi-tenancy             |
| ❌ API requests fail with 400 error    | ✅ All requests succeed                   |

**Status:** Currently using frontend workaround (header). **MUST** implement backend custom claims for production.
