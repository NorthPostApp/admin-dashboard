import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchInput from "./SearchInput";

describe("SearchInput", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with placeholder text", () => {
    const mockOnChange = vi.fn();
    render(
      <SearchInput onChange={mockOnChange} placeholder="Search addresses..." value="" />,
    );
    expect(screen.getByPlaceholderText("Search addresses...")).toBeTruthy();
  });

  it("renders search icon", () => {
    const mockOnChange = vi.fn();
    render(<SearchInput onChange={mockOnChange} placeholder="Search" value="abc" />);
    const searchIcon = document.querySelector("svg");
    expect(searchIcon).toBeTruthy();
  });

  it("trigger change event", () => {
    const mockOnChange = vi.fn();
    render(<SearchInput onChange={mockOnChange} placeholder="Search" value={""} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();
    fireEvent.change(input, { target: { value: "abc" } });
    expect(mockOnChange).toHaveBeenCalledWith("abc");
  });

  it("click submit search icon", () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    render(
      <SearchInput
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        placeholder="Search"
        value="abc"
      />,
    );
    const searchButton = screen.getByRole("button");
    expect(searchButton).toBeTruthy();
    fireEvent.click(searchButton);
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
