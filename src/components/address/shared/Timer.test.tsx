import { describe, expect, afterEach, beforeEach, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import Timer from "./Timer";

describe("Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("renders the label and initial timer value", () => {
    render(<Timer label="Loading" interval={100} />);
    expect(screen.getByText(/Loading/)).toBeTruthy();
    expect(screen.getByText("0.00s")).toBeTruthy();
  });

  it("increments timer based on interval", async () => {
    render(<Timer label="Processing" interval={100} />);
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByText("0.10s")).toBeTruthy();
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByText("0.50s")).toBeTruthy();
  });
});
