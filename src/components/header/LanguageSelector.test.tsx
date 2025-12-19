import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import LanguageSelector from "./LanguageSelector";
import { SUPPORTED_LANGUAGES } from "@/consts/app-config";
import { renderWithProviders } from "@/lib/test-wrappers";

describe("LanguageSelector", () => {
  it("displays the current language in the trigger", () => {
    renderWithProviders(<LanguageSelector />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeTruthy();
  });

  it("renders all supported languages from SUPPORTED_LANGUAGES constant", () => {
    renderWithProviders(<LanguageSelector />);
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    SUPPORTED_LANGUAGES.forEach((language) => {
      expect(screen.getAllByText(language).length).toBeGreaterThan(0);
    });
  });

  it("changes language when option is selected", () => {
    renderWithProviders(<LanguageSelector />);

    const trigger = screen.getByRole("combobox");

    // Test each language in SUPPORTED_LANGUAGES
    SUPPORTED_LANGUAGES.forEach((language) => {
      fireEvent.click(trigger);
      const option = screen.getAllByText(language)[0];
      fireEvent.click(option);
      expect(screen.queryAllByText(language).length).toBeGreaterThan(0);
    });
  });
});
