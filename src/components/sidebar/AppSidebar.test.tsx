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
      expect(screen.getByTestId(`sidebar-${service.titleKey}`)).toBeTruthy();
    });
  });

  it("check collapsible functionality", () => {
    renderSidebar();
    const testService = SERVICE_CATALOG[0];
    const parentButton = screen.getByTestId(`sidebar-${testService.titleKey}`);
    testService.contents.forEach((child) => {
      expect(
        screen.getByTestId(`sidebar-${testService.titleKey}-${child.i18nKey}`)
      ).toBeTruthy();
    });
    fireEvent.click(parentButton);
    testService.contents.forEach((child) => {
      expect(
        screen.queryByTestId(`sidebar-${testService.titleKey}-${child.i18nKey}`)
      ).not.toBeTruthy();
    });
    fireEvent.click(parentButton);
    testService.contents.forEach((child) => {
      expect(
        screen.queryByTestId(`sidebar-${testService.titleKey}-${child.i18nKey}`)
      ).toBeTruthy();
    });
  });

  it("check ref link and focus style for sidebar link", () => {
    renderSidebar();
    const testService = SERVICE_CATALOG[0];
    const testContent = SERVICE_CATALOG[0].contents[0];
    const textElement = screen.getByTestId(
      `sidebar-${testService.titleKey}-${testContent.i18nKey}`
    );
    const navLink = textElement?.closest("a");
    expect(navLink?.getAttribute("href")).toBe(testContent.path);
    expect(
      textElement.classList.contains("sidebar-menu__button__active")
    ).not.toBeTruthy();
    fireEvent.click(textElement);
    expect(textElement.classList.contains("sidebar-menu__button__active")).toBeTruthy();
  });
});
