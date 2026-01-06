import { beforeEach, vi } from "vitest";
import "../i18n/config";
export * from "@testing-library/react";

// Mocking local storage implementation
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

window.localStorage = localStorageMock as Storage;

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: false, // default to light mode
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Firebase Auth module
vi.mock("firebase/auth", () => {
  return {
    getAuth: vi.fn(() => ({
      currentUser: null,
    })),
    setPersistence: vi.fn(async () => {}),
    browserLocalPersistence: {},
    onAuthStateChanged: vi.fn((_, callback) => {
      // Immediately call with null user for tests
      callback(null);
      return vi.fn(); // return unsubscribe function
    }),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  };
});

// Mock Firebase App module
vi.mock("firebase/app", () => {
  return {
    initializeApp: vi.fn(() => ({})),
    FirebaseError: class FirebaseError extends Error {
      code: string;
      constructor(code: string, message: string) {
        super(message);
        this.name = "FirebaseError";
        this.code = code;
      }
    },
  };
});

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
