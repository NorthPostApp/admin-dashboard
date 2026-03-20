import { renderWithProviders } from "@/lib/test-wrappers";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import MusicList from "./MusicList";
import { useGetMusicListQuery } from "@/hooks/queries/useGetMusicListQuery";
import { useMusicContext } from "@/hooks/useMusicContext";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/hooks/queries/useGetMusicListQuery", () => ({
  useGetMusicListQuery: vi.fn(),
}));

vi.mock("@/hooks/useMusicContext", () => ({
  useMusicContext: vi.fn(),
}));

vi.mock("@/components/music/MusicTable", () => ({
  default: () => <div data-testid="music-table" />,
}));

const mockRefetch = vi.fn();
const mockUpdateMusicListData = vi.fn();

describe("MusicList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRefetch.mockResolvedValue({
      isSuccess: true,
      data: undefined,
    });
    vi.mocked(useGetMusicListQuery).mockReturnValue({
      refetch: mockRefetch,
      isFetching: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    vi.mocked(useMusicContext).mockReturnValue({
      musicListData: undefined,
      updateMusicListData: mockUpdateMusicListData,
    });
  });

  it("renders page title", () => {
    renderWithProviders(<MusicList />);
    expect(screen.getByText("Music List")).toBeTruthy();
  });

  it("call refetch function when mounting", async () => {
    mockRefetch.mockResolvedValue({
      isSuccess: true,
      data: [],
    });
    renderWithProviders(<MusicList />);
    expect(mockRefetch).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(mockUpdateMusicListData).toHaveBeenCalledOnce();
    });
  });

  it("refetch returns an error", async () => {
    mockRefetch.mockResolvedValue({
      isSuccess: false,
      isError: true,
      error: new Error("failed"),
    });
    renderWithProviders(<MusicList />);
    expect(mockRefetch).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("failed");
    });
  });

  it("show spinner when fetching data", () => {
    vi.mocked(useGetMusicListQuery).mockReturnValue({
      refetch: mockRefetch,
      isFetching: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    renderWithProviders(<MusicList />);
    expect(screen.queryByTestId("music-table")).toBeFalsy();
  });
});
