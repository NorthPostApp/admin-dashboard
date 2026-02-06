import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
    render(<SearchInput onChange={mockOnChange} placeholder="Search addresses..." />);
    expect(screen.getByPlaceholderText("Search addresses...")).toBeTruthy();
  });

  it("renders search icon", () => {
    const mockOnChange = vi.fn();
    render(<SearchInput onChange={mockOnChange} placeholder="Search" />);
    const searchIcon = document.querySelector("svg");
    expect(searchIcon).toBeTruthy();
  });

  it("debounces onChange callback with default delay (400ms)", async () => {
    const mockOnChange = vi.fn();
    render(<SearchInput onChange={mockOnChange} placeholder="Search" />);
    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "test" } });
    expect(mockOnChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(399);
    expect(mockOnChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("test");
  });

  it("resets debounce timer on subsequent input changes", () => {
    const mockOnChange = vi.fn();
    render(<SearchInput onChange={mockOnChange} placeholder="Search" />);
    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "a" } });
    vi.advanceTimersByTime(200);
    fireEvent.change(input, { target: { value: "ab" } });
    vi.advanceTimersByTime(200);
    fireEvent.change(input, { target: { value: "abc" } });
    expect(mockOnChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(400);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("abc");
  });
});
