import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import AddressContextProvider from "./AddressContextProvider";
import { useAddressContext } from "@/hooks/useAddressContext";

// Test component that uses the context
function TestComponent() {
  const {
    systemPrompt,
    userPrompt,
    generatedAddresses,
    updateSystemPrompt,
    updateUserPrompt,
    saveGeneratedAddresses,
  } = useAddressContext();

  return (
    <div>
      <div data-testid="system-prompt-language">{systemPrompt?.language || "none"}</div>
      <div data-testid="system-prompt-text">{systemPrompt?.prompt || "empty"}</div>
      <div data-testid="user-prompt">{userPrompt || "empty"}</div>
      <div data-testid="generated-count">{generatedAddresses.length}</div>

      <button
        data-testid="update-system-prompt-en"
        onClick={() => updateSystemPrompt("EN", "System prompt in English")}
      >
        Update System Prompt EN
      </button>

      <button
        data-testid="update-system-prompt-zh"
        onClick={() => updateSystemPrompt("ZH", "System prompt in Chinese")}
      >
        Update System Prompt ZH
      </button>

      <button
        data-testid="update-user-prompt"
        onClick={() => updateUserPrompt("Generate 5 addresses")}
      >
        Update User Prompt
      </button>

      <button
        data-testid="update-user-prompt-same"
        onClick={() => updateUserPrompt(userPrompt)}
      >
        Update User Prompt Same
      </button>

      <button
        data-testid="save-addresses"
        onClick={() =>
          saveGeneratedAddresses([
            {
              id: "1",
              name: "Test Location",
              tags: ["restaurant"],
              briefIntro: "A test restaurant",
              address: {
                city: "Test City",
                country: "Test Country",
                line1: "123 Test St",
                line2: "",
                buildingName: "",
                postalCode: "12345",
                region: "Test Region",
              },
            },
          ])
        }
      >
        Save Addresses
      </button>
    </div>
  );
}

describe("AddressContextProvider", () => {
  it("provides default values", () => {
    render(
      <AddressContextProvider>
        <TestComponent />
      </AddressContextProvider>
    );
    expect(screen.getByTestId("system-prompt-language").textContent).toBe("none");
    expect(screen.getByTestId("system-prompt-text").textContent).toBe("empty");
    expect(screen.getByTestId("user-prompt").textContent).toBe("empty");
    expect(screen.getByTestId("generated-count").textContent).toBe("0");
  });

  it("updates system prompt with language", () => {
    render(
      <AddressContextProvider>
        <TestComponent />
      </AddressContextProvider>
    );
    const updateButton = screen.getByTestId("update-system-prompt-en");
    fireEvent.click(updateButton);
    expect(screen.getByTestId("system-prompt-language").textContent).toBe("EN");
    expect(screen.getByTestId("system-prompt-text").textContent).toBe(
      "System prompt in English"
    );
  });

  it("does not update user prompt when value is the same", () => {
    render(
      <AddressContextProvider>
        <TestComponent />
      </AddressContextProvider>
    );

    // First update
    const updateButton = screen.getByTestId("update-user-prompt");
    fireEvent.click(updateButton);
    expect(screen.getByTestId("user-prompt").textContent).toBe("Generate 5 addresses");
    // Try to update with same value
    const updateSameButton = screen.getByTestId("update-user-prompt-same");
    fireEvent.click(updateSameButton);
    expect(screen.getByTestId("user-prompt").textContent).toBe("Generate 5 addresses");
  });

  it("throws error when useAddressContext is used outside provider", () => {
    // Suppress console.error for this test
    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAddressContext hook must be used within AddressContextProvider");
  });

  it("saves generated addresses", () => {
    render(
      <AddressContextProvider>
        <TestComponent />
      </AddressContextProvider>
    );
    expect(screen.getByTestId("generated-count").textContent).toBe("0");
    const saveButton = screen.getByTestId("save-addresses");
    fireEvent.click(saveButton);
    expect(screen.getByTestId("generated-count").textContent).toBe("1");
  });
});
