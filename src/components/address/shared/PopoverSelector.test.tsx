import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/lib/test-utils";
import { PopoverSelector } from "./PopoverSelector";

const mockOnSelect = vi.fn();

describe("PopoverSelector", () => {
  const mockOptions = ["Option 1", "Option 2", "Option 3"] as const;
  const defaultProps = {
    options: mockOptions,
    value: "Option 1",
    title: "Select an Option",
    description: "Choose one of the available options",
    onSelect: mockOnSelect,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the trigger button", () => {
    render(
      <PopoverSelector {...defaultProps}>
        <button>Open Selector</button>
      </PopoverSelector>
    );
    expect(screen.getByText("Open Selector")).toBeTruthy();
  });

  it("displays title and description when popover is opened", () => {
    render(
      <PopoverSelector {...defaultProps}>
        <button>Open Selector</button>
      </PopoverSelector>
    );
    const trigger = screen.getByText("Open Selector");
    fireEvent.click(trigger);
    expect(screen.getByText("Select an Option")).toBeTruthy();
    expect(screen.getByText("Choose one of the available options")).toBeTruthy();
  });

  it("renders all options in the popover", () => {
    render(
      <PopoverSelector {...defaultProps}>
        <button>Open Selector</button>
      </PopoverSelector>
    );
    const trigger = screen.getByText("Open Selector");
    fireEvent.click(trigger);
    mockOptions.forEach((option) => {
      expect(screen.getByText(option)).toBeTruthy();
    });
  });

  it("shows check icon for the selected option", () => {
    render(
      <PopoverSelector {...defaultProps}>
        <button>Open Selector</button>
      </PopoverSelector>
    );
    const trigger = screen.getByText("Open Selector");
    fireEvent.click(trigger);
    const selectedButton = screen.getByText("Option 1").closest("button");
    const checkIcon = selectedButton?.querySelector("svg");
    expect(checkIcon).toBeTruthy();
  });

  it("does not show check icon for non-selected options", () => {
    render(
      <PopoverSelector {...defaultProps}>
        <button>Open Selector</button>
      </PopoverSelector>
    );
    const trigger = screen.getByText("Open Selector");
    fireEvent.click(trigger);
    const nonSelectedButton = screen.getByText("Option 2").closest("button");
    const checkIcon = nonSelectedButton?.querySelector("svg");
    expect(checkIcon).toBeFalsy();
  });

  it("calls onSelect with correct value when option is clicked", () => {
    render(
      <PopoverSelector {...defaultProps}>
        <button>Open Selector</button>
      </PopoverSelector>
    );
    const trigger = screen.getByText("Open Selector");
    fireEvent.click(trigger);
    const option2 = screen.getByText("Option 2");
    fireEvent.click(option2);
    expect(mockOnSelect).toHaveBeenCalledWith("Option 2");
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });
});
