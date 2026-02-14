import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PaginationBar from "./PaginationBar";

const mockSelectPageAction = vi.fn();

describe("PaginationBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders pagination with correct number of pages", () => {
    render(
      <PaginationBar
        totalPages={3}
        currPage={1}
        hasMore={false}
        loading={false}
        selectPageAction={mockSelectPageAction}
      />,
    );
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("disables previous button on first page", () => {
    render(
      <PaginationBar
        totalPages={3}
        currPage={1}
        hasMore={false}
        loading={false}
        selectPageAction={mockSelectPageAction}
      />,
    );
    const prevButton = screen.getByTestId("pagination-previous");
    expect(prevButton.classList.contains("hover:cursor-not-allowed"));
    fireEvent.click(prevButton);
    expect(mockSelectPageAction).not.toHaveBeenCalled();
  });

  it("disables next button on last page without more pages", () => {
    render(
      <PaginationBar
        totalPages={3}
        currPage={3}
        hasMore={false}
        loading={false}
        selectPageAction={mockSelectPageAction}
      />,
    );
    const nextButton = screen.getByTestId("pagination-next");
    expect(nextButton.classList.contains("hover:cursor-not-allowed"));
    fireEvent.click(nextButton);
    expect(mockSelectPageAction).not.toHaveBeenCalled();
  });

  it("shows ellipsis when hasMore is true", () => {
    render(
      <PaginationBar
        totalPages={3}
        currPage={2}
        hasMore={true}
        loading={false}
        selectPageAction={mockSelectPageAction}
      />,
    );
    expect(screen.getByTestId("pagination-ellipsis")).toBeTruthy();
  });

  it("calls selectPageAction when page is clicked", () => {
    render(
      <PaginationBar
        totalPages={3}
        currPage={1}
        hasMore={false}
        loading={false}
        selectPageAction={mockSelectPageAction}
      />,
    );
    const page2 = screen.getByText("2");
    fireEvent.click(page2);
    expect(screen.queryByTestId("pagination-ellipsis")).toBeFalsy();
    expect(mockSelectPageAction).toHaveBeenCalledWith(2);
  });

  it("calls selectPageAction with next page when next button is clicked", () => {
    render(
      <PaginationBar
        totalPages={3}
        currPage={1}
        hasMore={false}
        loading={false}
        selectPageAction={mockSelectPageAction}
      />,
    );
    const nextButton = screen.getByTestId("pagination-next");
    expect(nextButton.classList.contains("hover:cursor-not-allowed"));
    fireEvent.click(nextButton);
    expect(mockSelectPageAction).toHaveBeenCalledWith(2);
  });

  it("calls selectPageAction with prev page when prev button is clicked", () => {
    render(
      <PaginationBar
        totalPages={3}
        currPage={2}
        hasMore={false}
        loading={false}
        selectPageAction={mockSelectPageAction}
      />,
    );
    const previousButton = screen.getByTestId("pagination-previous");
    expect(previousButton.classList.contains("hover:cursor-not-allowed"));
    fireEvent.click(previousButton);
    expect(mockSelectPageAction).toHaveBeenCalledWith(1);
  });

  it("disables buttons when loading", () => {
    render(
      <PaginationBar
        totalPages={3}
        currPage={2}
        hasMore={false}
        loading={true}
        selectPageAction={mockSelectPageAction}
      />,
    );
    const prevButton = screen.getByTestId("pagination-previous");
    const nextButton = screen.getByTestId("pagination-next");
    fireEvent.click(prevButton);
    fireEvent.click(nextButton);
    expect(mockSelectPageAction).not.toHaveBeenCalled();
  });
});
