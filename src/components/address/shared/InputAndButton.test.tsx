import InputAndButton from "./InputAndButton";
import { describe, vi, it, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const mockOnButtonClick = vi.fn();

describe("InputAndButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("render component", () => {
    render(
      <InputAndButton onButtonClick={mockOnButtonClick} placeholder="placeholder" />
    );
    expect(screen.getByRole("textbox").getAttribute("placeholder")).toBe("placeholder");
    expect(screen.getByRole("button")).toBeTruthy();
    expect(mockOnButtonClick).not.toHaveBeenCalled();
  });
  it("inspect input value and button click", () => {
    render(
      <InputAndButton
        onButtonClick={mockOnButtonClick}
        value="test text"
        placeholder="placeholder"
        readOnly
      />
    );
    expect(screen.getByDisplayValue("test text")).toBeTruthy();
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockOnButtonClick).toHaveBeenCalled();
  });

  it("renders with explicit buttonSize prop", () => {
    render(
      <InputAndButton
        onButtonClick={mockOnButtonClick}
        buttonSize="sm"
        placeholder="placeholder"
      />
    );
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByRole("button")).toBeTruthy();
    expect(screen.getByPlaceholderText("placeholder")).toBeTruthy();
  });
});
