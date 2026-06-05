import { useAddressRequestContext } from "@/hooks/useAddressRequestContext";
import { useAppContext } from "@/hooks/useAppContext";
import type { AddressRequest } from "@/schemas/address-request";
import { beforeEach, describe, vi, it, expect } from "vitest";
import AddressRequestContextProvider from "./AddressRequestContextProvider";
import { fireEvent, render, screen } from "@testing-library/react";

const mockAppContext = vi.hoisted(() => vi.fn<typeof useAppContext>());
vi.mock("@/hooks/useAppContext", () => ({ useAppContext: mockAppContext }));

const mockUseAppContext = (value: Partial<ReturnType<typeof useAppContext>>) => {
  mockAppContext.mockReturnValue({
    theme: "dark",
    language: "ZH",
    updateTheme: vi.fn(),
    updateLanguage: vi.fn(),
    ...value,
  });
};

const mockRequest: AddressRequest = {
  id: "id_1",
  requestBy: "user_1",
  content: "test content",
  status: "pending",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const TestConsumer = () => {
  const { currentProcessing, updateCurrentProcessing } = useAddressRequestContext();
  return (
    <div>
      <div data-testid="current-processing">{currentProcessing?.id ?? "empty"}</div>
      <button onClick={() => updateCurrentProcessing(mockRequest)}>update</button>
    </div>
  );
};

describe("AddressRequestContextProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppContext({});
  });

  it("updates currentProcessing", () => {
    render(
      <AddressRequestContextProvider>
        <TestConsumer />
      </AddressRequestContextProvider>,
    );
    expect(screen.getByText("empty")).toBeTruthy();
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText("id_1")).toBeTruthy();
  });

  it("change of language", () => {
    const { rerender } = render(
      <AddressRequestContextProvider>
        <TestConsumer />
      </AddressRequestContextProvider>,
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText("id_1")).toBeTruthy();
    mockUseAppContext({ language: "EN" });
    rerender(
      <AddressRequestContextProvider>
        <TestConsumer />
      </AddressRequestContextProvider>,
    );
    expect(screen.getByText("empty")).toBeTruthy();
  });
});
