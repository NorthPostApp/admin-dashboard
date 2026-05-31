import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@/lib/test-utils";
import { render } from "@testing-library/react";
import { PopoverMenu, type PopoverControls } from "./PopoverMenu";

const mockFn1 = vi.fn();
const mockFn2 = vi.fn();
const mockFn3 = vi.fn();

const mockControls: PopoverControls[] = [
  {
    name: "control-1",
    actionComponent: <button onClick={mockFn1}>Option 1</button>,
  },
  {
    name: "control-2",
    actionComponent: <button onClick={mockFn2}>Option 2</button>,
  },
  {
    name: "control-3",
    actionComponent: <button onClick={mockFn3}>Option 3</button>,
  },
];

describe("PopoverMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the trigger element", () => {
    render(
      <PopoverMenu id="test-menu" controls={mockControls}>
        <button>Open Menu</button>
      </PopoverMenu>
    );
    expect(screen.getByText("Open Menu")).toBeTruthy();
  });

  it("does not show controls initially", () => {
    render(
      <PopoverMenu id="test-menu" controls={mockControls}>
        <button>Open Menu</button>
      </PopoverMenu>
    );
    expect(screen.queryByText("Option 1")).toBeNull();
    expect(screen.queryByText("Option 2")).toBeNull();
    expect(screen.queryByText("Option 3")).toBeNull();
  });

  it("shows all controls when trigger is clicked", async () => {
    render(
      <PopoverMenu id="test-menu" controls={mockControls}>
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

  it("calls the correct function when a control is clicked", async () => {
    render(
      <PopoverMenu id="test-menu" controls={mockControls}>
        <button>Open Menu</button>
      </PopoverMenu>
    );
    const trigger = screen.getByText("Open Menu");
    fireEvent.click(trigger);
    await waitFor(() => {
      const option1 = screen.getByText("Option 1");
      fireEvent.click(option1);
    });
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).not.toHaveBeenCalled();
    expect(mockFn3).not.toHaveBeenCalled();
  });

  it("closes popover after clicking a control", async () => {
    render(
      <PopoverMenu id="test-menu" controls={mockControls}>
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
