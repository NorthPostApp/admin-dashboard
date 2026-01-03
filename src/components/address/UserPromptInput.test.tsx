import { describe, it, expect, vi, beforeEach } from "vitest";
import * as addressApi from "@/api/address";
import { screen, fireEvent, waitFor } from "@/lib/test-utils";
import UserPromptInput from "./UserPromptInput";
import { renderWithProviders } from "@/lib/test-wrappers";
import { DEFAULT_EFFORT, DEFAULT_MODEL, REASONING_EFFORTS } from "@/consts/app-config";
import { useAddressContext } from "@/hooks/useAddressContext";
import { useEffect } from "react";

// Mock the address API
vi.mock("@/api/address");

describe("UserPromptInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(addressApi.generateAddresses).mockResolvedValue([]);
  });

  it("renders the all of the default components", () => {
    renderWithProviders(<UserPromptInput />);
    const buttons = screen.getAllByRole("button");
    expect(screen.getByText(/User prompt/)).toBeTruthy();
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(buttons.length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText(DEFAULT_MODEL)).toBeTruthy();
  });

  it("updates textarea value and saves to context on blur", () => {
    renderWithProviders(<UserPromptInput />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Generate 5 addresses in Tokyo" } });
    fireEvent.blur(textarea);
    expect(textarea.value).toBe("Generate 5 addresses in Tokyo");
  });

  it("clears the textarea when clear button is clicked", () => {
    renderWithProviders(<UserPromptInput />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Test prompt" } });
    fireEvent.blur(textarea);
    // Find clear button by aria-label or test id, or by icon
    const clearButton = screen.getByTestId("address-userprompt-clear");
    // The clear button is the second to last button (before submit)
    fireEvent.click(clearButton);
    expect(textarea.value).toBe("");
  });

  it("does not submit when userPrompt is empty", async () => {
    renderWithProviders(<UserPromptInput />);
    const submitButton = screen.getByTestId("address-userprompt-submit");
    fireEvent.click(submitButton);
    // API should not be called
    await waitFor(() => {
      expect(addressApi.generateAddresses).not.toHaveBeenCalled();
    });
  });

  it("disables reasoning effort selector for non-gpt-5 models", async () => {
    renderWithProviders(<UserPromptInput />);
    // Change to gpt-4.1-mini model
    const modelButton = screen.getByText(DEFAULT_MODEL);
    fireEvent.click(modelButton);
    await waitFor(() => {
      const option = screen.getByText("gpt-4.1-mini");
      fireEvent.click(option);
    });
    const effortButton = screen.getByTestId("address-userprompt-effort");
    expect(effortButton).toHaveProperty("disabled");
  });

  it("switch between different efforts", async () => {
    renderWithProviders(<UserPromptInput />);
    REASONING_EFFORTS.forEach(async (effort) => {
      const effortIcon = screen.getByTestId("address-userprompt-effort");
      fireEvent.click(effortIcon);
      await waitFor(() => {
        const option = screen.getByText(effort);
        fireEvent.click(option);
        expect(screen.getByTestId(`effort-${effort}`)).toBeTruthy();
      });
    });
  });

  it("submits with custom model and effort", async () => {
    const UserInputWithSystemPrompt = () => {
      const { updateSystemPrompt } = useAddressContext();
      useEffect(() => {
        updateSystemPrompt("EN", "some prompt");
      }, [updateSystemPrompt]);
      return <UserPromptInput />;
    };
    renderWithProviders(<UserInputWithSystemPrompt />);
    // Set user prompt
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const submitButton = screen.getByTestId("address-userprompt-submit");
    fireEvent.click(submitButton);
    expect(addressApi.generateAddresses).not.toHaveBeenCalled();
    fireEvent.change(textarea, { target: { value: "Generate addresses" } });
    fireEvent.blur(textarea);
    // Change model to gpt-5-mini
    const modelButton = screen.getByText(DEFAULT_MODEL);
    fireEvent.click(modelButton);
    await waitFor(() => {
      const option = screen.getByText("gpt-5-mini");
      fireEvent.click(option);
    });
    // Change effort to high
    const effortButton = screen.getByTestId("address-userprompt-effort");
    fireEvent.click(effortButton);
    await waitFor(() => {
      const highOption = screen.getByText("high");
      fireEvent.click(highOption);
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(addressApi.generateAddresses).toHaveBeenCalledWith({
        language: "EN",
        systemPrompt: "some prompt",
        prompt: "Generate addresses",
        model: "gpt-5-mini",
        reasoningEffort: "high",
      });
    });
  });

  it("blurs textarea when Escape key is pressed", () => {
    renderWithProviders(<UserPromptInput />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    textarea.focus();
    expect(document.activeElement).toBe(textarea);
    fireEvent.keyDown(textarea, { key: "Escape" });
    expect(document.activeElement).not.toBe(textarea);
  });

  it("inserts newline when Shift+Enter is pressed", () => {
    renderWithProviders(<UserPromptInput />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Line 1" } });
    textarea.selectionStart = textarea.selectionEnd = 6; // Position cursor at end
    fireEvent.keyDown(textarea, {
      key: "Enter",
      shiftKey: true,
    });
    expect(textarea.value).toBe("Line 1\n");
  });

  it("inserts newline in middle of text when Shift+Enter is pressed", () => {
    renderWithProviders(<UserPromptInput />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "HelloWorld" } });
    textarea.selectionStart = textarea.selectionEnd = 5; // Position cursor after "Hello"
    fireEvent.keyDown(textarea, {
      key: "Enter",
      shiftKey: true,
    });
    expect(textarea.value).toBe("Hello\nWorld");
    expect(textarea.selectionStart).toBe(6);
    expect(textarea.selectionEnd).toBe(6);
  });

  it("submits form when Enter key is pressed without shift", async () => {
    const UserInputWithSystemPrompt = () => {
      const { updateSystemPrompt } = useAddressContext();
      useEffect(() => {
        updateSystemPrompt("EN", "system prompt");
      }, [updateSystemPrompt]);
      return <UserPromptInput />;
    };
    renderWithProviders(<UserInputWithSystemPrompt />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Generate addresses" } });
    fireEvent.keyDown(textarea, {
      key: "Enter",
      shiftKey: false,
    });
    await waitFor(() => {
      expect(addressApi.generateAddresses).toHaveBeenCalledWith({
        language: "EN",
        systemPrompt: "system prompt",
        prompt: "Generate addresses",
        model: DEFAULT_MODEL,
        reasoningEffort: DEFAULT_EFFORT,
      });
    });
  });

  it("does not submit when Enter is pressed with empty prompt", async () => {
    const UserInputWithSystemPrompt = () => {
      const { updateSystemPrompt } = useAddressContext();
      useEffect(() => {
        updateSystemPrompt("EN", "system prompt");
      }, [updateSystemPrompt]);
      return <UserPromptInput />;
    };
    renderWithProviders(<UserInputWithSystemPrompt />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.keyDown(textarea, {
      key: "Enter",
      shiftKey: false,
    });
    await waitFor(() => {
      expect(addressApi.generateAddresses).not.toHaveBeenCalled();
    });
  });

  it("displays spinner when submission is pending", async () => {
    const UserInputWithSystemPrompt = () => {
      const { updateSystemPrompt } = useAddressContext();
      useEffect(() => {
        updateSystemPrompt("EN", "system prompt");
      }, [updateSystemPrompt]);
      return <UserPromptInput />;
    };
    // Mock the API to delay response so we can check pending state
    vi.mocked(addressApi.generateAddresses).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );
    renderWithProviders(<UserInputWithSystemPrompt />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const submitButton = screen.getByTestId("address-userprompt-submit");
    fireEvent.change(textarea, { target: { value: "Generate addresses" } });
    fireEvent.blur(textarea);
    fireEvent.click(submitButton);
    // Check that Spinner is displayed while pending
    await waitFor(() => {
      expect(screen.getByTestId("address-userprompt-spinner")).toBeTruthy();
    });
  });
});
