import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@/lib/test-utils";
import { render } from "@testing-library/react";
import { PopoverMenu, type PopoverOption } from "./PopoverMenu";

const mockOptions: PopoverOption[] = [
  { label: "Option 1", fn: vi.fn() },
  { label: "Option 2", fn: vi.fn() },
  { label: "Option 3", fn: vi.fn() },
];

describe("PopoverMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the trigger element", () => {
    render(
      <PopoverMenu id="test-menu" options={mockOptions}>
        <button>Open Menu</button>
      </PopoverMenu>
    );
    expect(screen.getByText("Open Menu")).toBeTruthy();
  });

  it("does not show options initially", () => {
    render(
      <PopoverMenu id="test-menu" options={mockOptions}>
        <button>Open Menu</button>
      </PopoverMenu>
    );
    expect(screen.queryByText("Option 1")).toBeNull();
    expect(screen.queryByText("Option 2")).toBeNull();
    expect(screen.queryByText("Option 3")).toBeNull();
  });

  it("shows all options when trigger is clicked", async () => {
    render(
      <PopoverMenu id="test-menu" options={mockOptions}>
        <button>Open Menu</button>
      </PopoverMenu>
    );
    const trigger = screen.getByText("Open Menu");
    fireEvent.click(trigger);
    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeTruthy();
      expect(screen.getByText("Option 2")).toBeTruthy();
      expect(screen.getByText("Option 3")).toBeTruthy();
    });
  });

  it("calls the correct function when an option is clicked", async () => {
    render(
      <PopoverMenu id="test-menu" options={mockOptions}>
        <button>Open Menu</button>
      </PopoverMenu>
    );
    const trigger = screen.getByText("Open Menu");
    fireEvent.click(trigger);
    await waitFor(() => {
      const option1 = screen.getByText("Option 1");
      fireEvent.click(option1);
    });
    expect(mockOptions[0].fn).toHaveBeenCalledTimes(1);
    expect(mockOptions[1].fn).not.toHaveBeenCalled();
    expect(mockOptions[2].fn).not.toHaveBeenCalled();
  });

  it("closes popover after clicking an option", async () => {
    render(
      <PopoverMenu id="test-menu" options={mockOptions}>
        <button>Open Menu</button>
      </PopoverMenu>
    );
    const trigger = screen.getByText("Open Menu");
    fireEvent.click(trigger);
    await waitFor(() => {
      const option2 = screen.getByText("Option 2");
      fireEvent.click(option2);
    });
    await waitFor(() => {
      expect(screen.queryByText("Option 2")).toBeNull();
    });
  });
});
