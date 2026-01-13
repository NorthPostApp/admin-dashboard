import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateAddressPrompt from "./CreateAddressPrompt";
import { renderWithProviders } from "@/lib/test-wrappers";
import { screen } from "@testing-library/react";

// Mock the child components
vi.mock("@/components/address/SystemPromptInput", () => ({
  default: () => <div data-testid="system-prompt-input">SystemPromptInput Mock</div>,
}));

vi.mock("@/components/address/UserPromptInput", () => ({
  default: () => <div data-testid="user-prompt-input">UserPromptInput Mock</div>,
}));

vi.mock("@/components/address/GeneratedAddresses", () => ({
  default: () => <div data-testid="generated-addresses">GeneratedAddresses Mock</div>,
}));

describe("CreateAddressPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form structure", () => {
    const { container } = renderWithProviders(<CreateAddressPrompt />);
    const form = container.querySelector("form");
    expect(form).toBeTruthy();
  });

  it("renders all child components", () => {
    renderWithProviders(<CreateAddressPrompt />);
    expect(screen.getByTestId("system-prompt-input"));
    expect(screen.getByTestId("user-prompt-input"));
    expect(screen.getByTestId("generated-addresses"));
  });

  it("renders translations", () => {
    renderWithProviders(<CreateAddressPrompt />);
    expect(screen.getByText(/Create address from prompt/i));
    expect(screen.getByText(/Select the LLM model/i));
  });
});
