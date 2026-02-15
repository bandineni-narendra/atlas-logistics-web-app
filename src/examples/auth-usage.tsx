/**
 * Firebase Authentication Usage Examples
 *
 * Complete examples demonstrating how to use the authentication system
 * in various scenarios across the application.
 */

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth";
import * as authService from "@/services/auth";
import { apiClient } from "@/services/apiClient";

// ============================================================================
// Example 1: Using Auth in a Component
// ============================================================================

function DashboardComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login to continue</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// ============================================================================
// Example 2: Protected Page with Route Guard
// ============================================================================

export default function ProtectedDashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto">
        <h1>Protected Dashboard</h1>
        <p>Only authenticated users can see this content</p>
        <DashboardComponent />
      </div>
    </ProtectedRoute>
  );
}

// ============================================================================
// Example 3: Login Form Component
// ============================================================================

function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const { login, signInWithGoogle } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // User automatically redirected via AuthContext
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // User automatically redirected via AuthContext
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleEmailLogin}>
      {error && <div className="error">{error}</div>}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button type="submit">Login</button>

      <hr />

      <button type="button" onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </form>
  );
}

// ============================================================================
// Example 4: Signup Form Component
// ============================================================================

function SignupForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const { signup, signInWithGoogle } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(formData.email, formData.password, formData.name);
      // User automatically redirected via AuthContext
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      {error && <div className="error">{error}</div>}

      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Full Name"
        required
      />

      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required
      />

      <button type="submit">Sign Up</button>

      <button type="button" onClick={() => signInWithGoogle()}>
        Sign up with Google
      </button>
    </form>
  );
}

// ============================================================================
// Example 5: Profile Update Component
// ============================================================================

function ProfileEditor() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = React.useState(user?.name || "");
  const [avatar, setAvatar] = React.useState(user?.avatar || "");
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(name, avatar);
      alert("Profile updated!");
    } catch (error: any) {
      alert("Failed to update profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Display Name"
      />

      <input
        type="url"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
        placeholder="Avatar URL"
      />

      <button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}

// ============================================================================
// Example 6: Making Authenticated API Calls
// ============================================================================

async function fetchUserData() {
  try {
    // Token is automatically added by the interceptor
    const response = await apiClient.get<unknown>("/auth/me");
    console.log("User data:", response);
    return response;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    // 401 errors automatically redirect to login via interceptor
  }
}

async function createExcelJob() {
  try {
    // Token is automatically added
    const response = await apiClient.post<any>("/excel-flow/jobs", {
      fileName: "data.xlsx",
      sheet: {
        sheetName: "Sheet1",
        rows: [
          [1, 2],
          [3, 4],
        ],
      },
    });
    console.log("Job created:", (response as any).jobId);
    return response;
  } catch (error: any) {
    console.error("Failed to create job:", error.message);
  }
}

// ============================================================================
// Example 7: Conditional Rendering Based on Auth State
// ============================================================================

function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      <div className="logo">Atlas Logistics</div>

      {isAuthenticated ? (
        <div className="user-menu">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div className="auth-links">
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </div>
      )}
    </nav>
  );
}

// ============================================================================
// Example 8: Account Deletion
// ============================================================================

function DeleteAccountButton() {
  const { deleteAccount } = useAuth();
  const [confirming, setConfirming] = React.useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    if (confirm("Are you sure? This action cannot be undone.")) {
      try {
        await deleteAccount();
        // User automatically redirected to login
      } catch (error: any) {
        alert("Failed to delete account: " + error.message);
      }
    }
  };

  return (
    <button onClick={handleDelete} className="danger-button">
      {confirming ? "Click again to confirm" : "Delete Account"}
    </button>
  );
}

// ============================================================================
// Example 9: Direct Auth Service Usage (without Context)
// ============================================================================

async function directAuthUsage() {
  try {
    // Signup
    const newUser = await authService.signup(
      "user@example.com",
      "password123",
      "John Doe",
    );
    console.log("Signed up:", newUser);

    // Login
    const user = await authService.login("user@example.com", "password123");
    console.log("Logged in:", user);

    // Google Sign-In
    const googleUser = await authService.signInWithGoogle();
    console.log("Google user:", googleUser);

    // Get current user
    const currentUser = await authService.getCurrentUser();
    console.log("Current user:", currentUser);

    // Update profile
    const updated = await authService.updateProfile(
      "Jane Doe",
      "https://example.com/avatar.jpg",
    );
    console.log("Updated:", updated);

    // Logout
    await authService.logout();
    console.log("Logged out");
  } catch (error) {
    console.error("Auth error:", error);
  }
}

// ============================================================================
// Example 10: Debugging Firebase Auth State
// ============================================================================

import { auth } from "@/config/firebase";

function DebugAuthInfo() {
  const [tokenInfo, setTokenInfo] = React.useState<any>(null);

  React.useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      user.getIdToken().then((token) => {
        // Decode JWT payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        setTokenInfo({
          token: token.substring(0, 20) + "...",
          userId: payload.uid,
          email: payload.email,
          issuedAt: new Date(payload.iat * 1000).toISOString(),
          expiresAt: new Date(payload.exp * 1000).toISOString(),
        });
      });
    }
  }, []);

  if (!tokenInfo) return <div>Not authenticated</div>;

  return <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>;
}

export {
  DashboardComponent,
  ProtectedDashboardPage,
  LoginForm,
  SignupForm,
  ProfileEditor,
  NavBar,
  DeleteAccountButton,
  DebugAuthInfo,
  fetchUserData,
  createExcelJob,
  directAuthUsage,
};
