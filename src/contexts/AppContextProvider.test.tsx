import { describe, vi, it, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import AppContextProvider from "./AppContextProvider";
import { useAppContext } from "@/hooks/useAppContext";
import { LOCALSTORAGE_KEY } from "@/consts/app-config";

// Test component that uses the context
function TestComponent() {
  const { theme, language, updateLanguage, updateTheme } = useAppContext();

  return (
    <div>
      <div data-testid="region">{language}</div>
      <div data-testid="theme">{theme}</div>
      <button data-testid="en-button" onClick={() => updateLanguage("EN")}>
        Change to US
      </button>
      <button data-testid="zh-button" onClick={() => updateLanguage("ZH")}>
        Change to US
      </button>
      <button data-testid="light-button" onClick={() => updateTheme("light")}>
        Change to light theme
      </button>
      <button data-testid="dark-button" onClick={() => updateTheme("dark")}>
        Change to dark theme
      </button>
      <button data-testid="system-button" onClick={() => updateTheme("system")}>
        Change to system theme
      </button>
    </div>
  );
}

describe("AppContextProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides default EN region and system theme", () => {
    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );
    expect(screen.getByText("EN")).toBeTruthy();
    expect(screen.getByText("system")).toBeTruthy();
  });

  it("updates region when updateLanguage is called", async () => {
    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );
    const changeUSButton = screen.getByTestId("en-button");
    fireEvent.click(changeUSButton);
    expect(screen.getByText("EN")).toBeTruthy();

    const changeCNButton = screen.getByTestId("zh-button");
    fireEvent.click(changeCNButton);
    expect(screen.getByText("ZH")).toBeTruthy();
  });

  it("updates them when updateTheme is called", async () => {
    // Override matchMedia for this specific test
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
    }));
    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );
    const lightButton = screen.getByTestId("light-button");
    fireEvent.click(lightButton);
    expect(screen.getByText("light")).toBeTruthy();

    const darkButton = screen.getByTestId("dark-button");
    fireEvent.click(darkButton);
    expect(screen.getByText("dark")).toBeTruthy();

    const systemButton = screen.getByTestId("system-button");
    fireEvent.click(systemButton);
    expect(screen.getByText("system")).toBeTruthy();
  });

  it("persists language to localStorage", () => {
    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );
    const changeENButton = screen.getByTestId("en-button");
    fireEvent.click(changeENButton);
    let storedData = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || "{}");
    expect(storedData.language).toEqual("EN");
    expect(screen.getByText("EN")).toBeTruthy();
    const changeZHButton = screen.getByTestId("zh-button");
    fireEvent.click(changeZHButton);
    storedData = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || "{}");
    expect(storedData.language).toEqual("ZH");
    expect(screen.getByText("ZH")).toBeTruthy();
  });

  it("loads config from localStorage on mount", async () => {
    vi.resetModules(); // clear modules to allow modules been loaded after local storage setup
    localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify({ language: "EN", theme: "dark" })
    );
    // Dynamically import the module AFTER setting localStorage
    const { default: AppContextProvider } = await import("./AppContextProvider");
    const { useAppContext } = await import("../hooks/useAppContext");
    function LocalTestComponent() {
      const { language, theme } = useAppContext();
      return (
        <div>
          <div data-testid="region">{language}</div>
          <div data-testid="theme">{theme}</div>
        </div>
      );
    }
    render(
      <AppContextProvider>
        <LocalTestComponent />
      </AppContextProvider>
    );
    expect(screen.getByText("EN")).toBeTruthy();
    expect(screen.getByText("dark")).toBeTruthy();
  });

  it("throws error when useAppContext is used outside provider", () => {
    // Suppress console.error for this test
    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAppContext hook must be used within AppContextProvider");
  });
});
