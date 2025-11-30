import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ThemeSelector from "./ThemeSelector";
import { THEMES, type Theme } from "@/consts/app-config";
import { renderWithProviders } from "@/lib/test-wrappers";

vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  return {
    ...actual,
    Sun: () => <div data-testid={getTestIdByTheme("light")}>Sun</div>,
    Moon: () => <div data-testid={getTestIdByTheme("dark")}>Moon</div>,
    Monitor: () => <div data-testid={getTestIdByTheme("system")}>Monitor</div>,
  };
});

describe("ThemeSelector", () => {
  it("renders theme selector with label", () => {
    renderWithProviders(<ThemeSelector />);
    expect(screen.getByText("Theme")).toBeTruthy();
  });

  it("renders all theme options from THEMES constant", () => {
    renderWithProviders(<ThemeSelector />);
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    THEMES.forEach((theme) => {
      expect(screen.getByText(theme)).toBeTruthy();
    });
  });

  it("changes theme when option is selected", () => {
    renderWithProviders(<ThemeSelector />);

    const trigger = screen.getByRole("combobox");
    THEMES.forEach((theme) => {
      fireEvent.click(trigger);
      const lightOption = screen.getByText(theme);
      fireEvent.click(lightOption);
      expect(screen.getByTestId(getTestIdByTheme(theme))).toBeTruthy();
    });
  });
});

const getTestIdByTheme = (theme: Theme) => {
  switch (theme) {
    case "light":
      return "sun-icon";
    case "dark":
      return "moon-icon";
    default:
      return "monitor-icon";
  }
};
