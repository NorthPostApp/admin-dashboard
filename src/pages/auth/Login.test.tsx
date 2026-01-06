import { describe, vi, it, expect, beforeEach } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/lib/test-wrappers";
import { useAuthContext } from "@/hooks/useAuthContext";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import Login from "./Login";

// Mock dependencies
vi.mock("@/hooks/useAuthContext", () => ({
  useAuthContext: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

const mockSignIn = vi.fn();

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthContext).mockReturnValue({
      signIn: mockSignIn,
      signOut: vi.fn(),
      user: null,
      loading: false,
    });
  });

  it("renders the login form with all required elements", () => {
    renderWithProviders(<Login />);
    expect(screen.getByText("NorthPost Admin System")).toBeTruthy();
    expect(screen.getByText("Sign in your admin account to continue")).toBeTruthy();
    expect(screen.getByLabelText("Account")).toBeTruthy();
    expect(screen.getByLabelText("Password")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeTruthy();
  });

  it("updates account input value when user types", async () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    await waitFor(() => {
      expect(screen.getByDisplayValue("test@example.com")).toBeTruthy();
    });
  });

  it("updates password input value when user types", async () => {
    renderWithProviders(<Login />);
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    await waitFor(() => {
      expect(screen.getByDisplayValue("password123")).toBeTruthy();
    });
  });

  it("shows validation error for invalid email on blur", async () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);
    await waitFor(() => {
      expect(screen.getByText(/email/i)).toBeTruthy();
    });
  });

  it("successfully signs in and navigates to home", async () => {
    mockSignIn.mockResolvedValue({});
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123");
      expect(toast.success).toHaveBeenCalledWith("welcome back");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error toast for too many requests", async () => {
    const firebaseError = new FirebaseError(
      "auth/too-many-requests",
      "Too many requests"
    );
    mockSignIn.mockRejectedValue(firebaseError);
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Too many failed attempts. Please try again later"
      );
    });
  });

  it("shows error toast for disabled account", async () => {
    const { FirebaseError } = await import("firebase/app");
    const firebaseError = new FirebaseError("auth/user-disabled", "User disabled");
    mockSignIn.mockRejectedValue(firebaseError);
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("This account has been disabled");
    });
  });

  it("shows error toast for user not found", async () => {
    const { FirebaseError } = await import("firebase/app");
    const firebaseError = new FirebaseError("auth/user-not-found", "User not found");
    mockSignIn.mockRejectedValue(firebaseError);
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("No account found with this email");
    });
  });

  it("shows error toast for invalid credentials", async () => {
    const { FirebaseError } = await import("firebase/app");
    const firebaseError = new FirebaseError(
      "auth/invalid-credential",
      "Invalid credentials"
    );
    mockSignIn.mockRejectedValue(firebaseError);
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid log in credential");
    });
  });

  it("shows generic error toast for unknown errors", async () => {
    const genericError = new Error("Some network error");
    mockSignIn.mockRejectedValue(genericError);
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to sign in. Please try again");
    });
  });
});
