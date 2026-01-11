import { describe, vi, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
  type UserCredential,
} from "firebase/auth";
import { useAuthContext } from "@/hooks/useAuthContext";
import AuthContextProvider from "./AuthContextProvider";
import type { AdminUserData } from "@/schemas/user";
import { signInAdminUser } from "@/api/user";

// Mock Firebase auth
vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual("firebase/auth");
  return {
    ...actual,
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  };
});

vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

// Mock the user API
vi.mock("@/api/user", () => ({
  signInAdminUser: vi.fn(),
}));

const mockGetIdToken: (forceRefresh?: boolean) => Promise<string> = vi
  .fn()
  .mockResolvedValue("mock-id-token");

// Test component that uses the context
function TestComponent() {
  const { user, loading, signIn, signOut } = useAuthContext();

  return (
    <div>
      <div data-testid="loading">{loading ? "loading" : "loaded"}</div>
      <div data-testid="user">{user ? user.email : "no user"}</div>
      <button
        data-testid="signin-button"
        onClick={() => signIn("test@example.com", "password123")}
      >
        Sign In
      </button>
      <button data-testid="signout-button" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}

describe("AuthContextProvider", () => {
  let unsubscribeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    unsubscribeMock = vi.fn();
  });

  it("provides initial loading state as true and user as null", () => {
    vi.mocked(onAuthStateChanged).mockImplementation(() => {
      return unsubscribeMock;
    });
    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );
    expect(screen.getByText("loading")).toBeTruthy();
    expect(screen.getByText("no user")).toBeTruthy();
  });

  it("sets loading to false and provides user when user is authenticated", async () => {
    const mockUser = {
      uid: "123",
      email: "test@example.com",
      displayName: "Test User",
    } as User;
    vi.mocked(onAuthStateChanged).mockImplementation((_, callback) => {
      if (typeof callback === "function") {
        callback(mockUser);
      }
      return unsubscribeMock;
    });
    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("loaded")).toBeTruthy();
      expect(screen.getByText("test@example.com")).toBeTruthy();
    });
  });

  it("updates user state when auth state changes", async () => {
    let authCallback: ((user: User | null) => void) | null = null;
    vi.mocked(onAuthStateChanged).mockImplementation((_, callback) => {
      if (typeof callback === "function") {
        authCallback = callback;
        callback(null);
      }
      return unsubscribeMock;
    });
    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("no user")).toBeTruthy();
    });
    // Simulate auth state change
    const mockUser = {
      uid: "123",
      email: "newuser@example.com",
    } as User;
    await waitFor(() => {
      if (authCallback) {
        authCallback(mockUser);
      }
      expect(screen.getByText("newuser@example.com")).toBeTruthy();
    });
  });

  it("calls signInWithEmailAndPassword when signIn is invoked", async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_, callback) => {
      if (typeof callback === "function") {
        callback(null);
      }
      return unsubscribeMock;
    });

    // Mock signInWithEmailAndPassword to return a proper UserCredential
    const mockUserCredential: UserCredential = {
      user: {
        uid: "123",
        email: "test@example.com",
        getIdToken: mockGetIdToken,
      } as User,
      providerId: null,
      operationType: "signIn",
    };
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue(mockUserCredential);

    // Mock signInAdminUser API
    const mockAdminUserData: AdminUserData = {
      displayName: "Test User",
      email: "test@example.com",
      lastLogin: Date.now(),
      imageUrl: null,
    };
    vi.mocked(signInAdminUser).mockResolvedValue({
      data: mockAdminUserData,
    });

    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("loaded")).toBeTruthy();
    });
    const signInButton = screen.getByTestId("signin-button");
    signInButton.click();
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "test@example.com",
        "password123"
      );
      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    });
  });

  it("calls firebaseSignOut when signOut is invoked", async () => {
    const mockUser = {
      uid: "123",
      email: "test@example.com",
    } as User;
    vi.mocked(onAuthStateChanged).mockImplementation((_, callback) => {
      if (typeof callback === "function") {
        callback(mockUser);
      }
      return unsubscribeMock;
    });
    vi.mocked(firebaseSignOut).mockResolvedValue();
    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("loaded")).toBeTruthy();
    });
    const signOutButton = screen.getByTestId("signout-button");
    signOutButton.click();
    await waitFor(() => {
      expect(firebaseSignOut).toHaveBeenCalledWith({});
      expect(firebaseSignOut).toHaveBeenCalledTimes(1);
    });
  });

  it("throws error when useAuthContext is used outside provider", () => {
    function TestComponentOutsideProvider() {
      useAuthContext();
      return <div>Test</div>;
    }
    expect(() => {
      render(<TestComponentOutsideProvider />);
    }).toThrow("useAuthContext hook must be used within AuthContextProvider");
  });
});
