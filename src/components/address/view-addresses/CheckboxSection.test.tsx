import { useState } from "react";
import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/lib/test-wrappers";
import CheckboxSection from "./CheckboxSection";

// Wrapper component to test state changes and memoization
function CheckboxSectionWrapper() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["Option 1"]);
  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option],
    );
  };
  return (
    <CheckboxSection
      title="Test Section"
      options={["Option 1", "Option 2", "Option 3"]}
      selectedOptions={selectedOptions}
      toggleOption={toggleOption}
    />
  );
}

describe("CheckboxSection", () => {
  it("renders the section title", () => {
    renderWithProviders(<CheckboxSectionWrapper />);
    expect(screen.getByText("Test Section")).toBeTruthy();
  });

  it("renders all checkbox options when expanded", () => {
    renderWithProviders(<CheckboxSectionWrapper />);
    expect(screen.getByText("Option 1")).toBeTruthy();
    expect(screen.getByText("Option 2")).toBeTruthy();
    expect(screen.getByText("Option 3")).toBeTruthy();
    const trigger = screen.getByText("Test Section");
    fireEvent.click(trigger);
    expect(screen.queryByText("Option 1")).not.toBeTruthy();
  });

  it("calls toggleOption when checkbox is clicked", () => {
    renderWithProviders(<CheckboxSectionWrapper />);
    const option = screen.getByText("Option 2");
    fireEvent.click(option);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[1].getAttribute("data-state")).toBe("checked");
    fireEvent.click(option);
    expect(checkboxes[1].getAttribute("data-state")).toBe("unchecked");
  });
});
