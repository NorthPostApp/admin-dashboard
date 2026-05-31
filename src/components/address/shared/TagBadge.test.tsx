import TagBadge from "./TagBadge";
import { describe, vi, it, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const mockOnRemoveTag = vi.fn();

describe("TagBadge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("tag badges display correctly", () => {
    render(<TagBadge value="Hello" onRemoveTag={mockOnRemoveTag} />);
    expect(screen.getByText("Hello")).toBeTruthy();
  });
  it("tag delete functions correctly", () => {
    render(<TagBadge value="Hello" onRemoveTag={mockOnRemoveTag} />);
    const deleteIcon = screen.getByTestId("badge-delete-icon");
    fireEvent.click(deleteIcon);
    expect(mockOnRemoveTag).toHaveBeenCalled();
  });
});
