import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import AppSidebar from "./AppSidebar";
import { renderWithProviders } from "@/lib/test-wrappers";
import { MemoryRouter } from "react-router";
import { SERVICE_CATALOG } from "@/consts/service-catalog";

function renderSidebar() {
  return renderWithProviders(
    <MemoryRouter>
      <AppSidebar />
    </MemoryRouter>
  );
}

describe("AppSidebar", () => {
  it("render sidebar with labels", () => {
    renderSidebar();
    expect(screen.getByText("Application")).toBeTruthy();
    SERVICE_CATALOG.forEach((service) => {
      expect(screen.getByText(service.title)).toBeTruthy();
    });
  });

  it("check collapsible functionality", () => {
    renderSidebar();
    const testService = SERVICE_CATALOG[0];
    const parentButton = screen.getByText(testService.title);
    testService.contents.forEach((child) => {
      expect(screen.getByText(child.name)).toBeTruthy();
    });
    fireEvent.click(parentButton);
    testService.contents.forEach((child) => {
      expect(screen.queryByText(child.name)).not.toBeTruthy();
    });
    fireEvent.click(parentButton);
    testService.contents.forEach((child) => {
      expect(screen.queryByText(child.name)).toBeTruthy();
    });
  });

  it("check ref link and focus style for sidebar link", () => {
    renderSidebar();
    const testContent = SERVICE_CATALOG[0].contents[0];
    const navLink = screen.getByText(testContent.name).closest("a");
    expect(navLink?.getAttribute("href")).toBe(testContent.path);
    const textElement = screen.getByText(testContent.name);
    expect(
      textElement.classList.contains("sidebar-menu__button__active")
    ).not.toBeTruthy();
    fireEvent.click(textElement);
    expect(textElement.classList.contains("sidebar-menu__button__active")).toBeTruthy();
  });
});
