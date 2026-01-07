import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@/lib/test-utils";
import { renderWithProviders } from "@/lib/test-wrappers";
import SystemPromptInput from "./SystemPromptInput";
import * as addressApi from "@/api/address";

const MOCK_RESPONSE = "Mocked system prompt from API";

describe("SystemPromptInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(addressApi, "getSystemPrompt").mockResolvedValue({
      data: MOCK_RESPONSE,
    });
  });

  it("renders the component with label and textarea", () => {
    renderWithProviders(<SystemPromptInput />);
    expect(screen.getByText(/System prompt/)).toBeTruthy();
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveProperty("disabled", true);
    expect(screen.getByText("Edit")).toBeTruthy();
  });

  it("enables editing when Edit button is clicked", () => {
    renderWithProviders(<SystemPromptInput />);
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveProperty("disabled", false);
    expect(screen.getByText("Cancel")).toBeTruthy();
    expect(screen.getByText("Save")).toBeTruthy();
  });

  it("updates textarea value after successful fetch", async () => {
    renderWithProviders(<SystemPromptInput />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    await waitFor(() => {
      expect(textarea.value).toBe(MOCK_RESPONSE);
    });
  });

  it("saves editing when Save button is clicked", async () => {
    renderWithProviders(<SystemPromptInput />);
    // Wait for API call
    await waitFor(() => {
      expect(addressApi.getSystemPrompt).toHaveBeenCalled();
    });
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Updated prompt" } });
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);
    // Save editing
    expect(textarea).toHaveProperty("disabled", true);
    expect(screen.getByText("Edit")).toBeTruthy();
    expect(textarea.value).toBe("Updated prompt");
  });

  it("cancel editing when Cancel button is clicked", async () => {
    renderWithProviders(<SystemPromptInput />);
    await waitFor(() => {
      expect(addressApi.getSystemPrompt).toHaveBeenCalled();
    });
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Updated prompt" } });
    // Cancel editing
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(textarea.value).toBe(MOCK_RESPONSE);
  });

  it("handles fetch error gracefully", async () => {
    vi.spyOn(addressApi, "getSystemPrompt").mockRejectedValueOnce(
      new Error("Fetch failed")
    );
    renderWithProviders(<SystemPromptInput />);
    await waitFor(() => {
      expect(addressApi.getSystemPrompt).toHaveBeenCalled();
    });
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    await waitFor(() => {
      expect(textarea.value).toBe(
        "Failed to fetch system prompt, please check the login or server status"
      );
    });
  });
});
