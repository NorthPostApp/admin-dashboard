import { renderWithProviders } from "@/lib/test-wrappers";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import MusicList from "./MusicList";
import { useGetMusicListQuery } from "@/hooks/queries/useGetMusicListQuery";
import { useMusicContext } from "@/hooks/useMusicContext";
import { toast } from "sonner";

const mockTitle = "test";
const mockFilename = "ballad/test.mp3";
const mockTime = new Date().getTime();
const mockMusicList = [
  {
    title: "placeholder",
    filename: "placeholder.mp3",
    durationSec: 1000,
    genre: "ballad",
    size: 4.5,
    lastModified: mockTime - 100,
  },
  {
    title: mockTitle,
    filename: mockFilename,
    durationSec: 1000,
    genre: "ballad",
    size: 4.5,
    lastModified: mockTime,
  },
];

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
  default: ({ onSelectMusic }: { onSelectMusic: (musicFilename: string) => void }) => (
    <div data-testid="music-table">
      <button
        data-testid={"music-table__mock__select"}
        onClick={() => onSelectMusic(mockFilename)}
      >
        select
      </button>
    </div>
  ),
}));

vi.mock("@/components/music/MusicPlayer", () => ({
  default: ({ filename }: { filename: string }) => (
    <div data-testid="music-player">{filename}</div>
  ),
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

  it("show table footer", async () => {
    vi.mocked(useMusicContext).mockReturnValue({
      musicListData: mockMusicList,
      updateMusicListData: mockUpdateMusicListData,
    });
    renderWithProviders(<MusicList />);
    expect(screen.queryByTestId("music-table")).toBeTruthy();
    expect(screen.getByText(/Most Recently Added/i)).toBeTruthy();
    expect(mockRefetch).not.toHaveBeenCalled();
    const button = screen.getByTestId("music-view__refresh");
    fireEvent.click(button);
    await waitFor(() => expect(mockRefetch).toHaveBeenCalled());
  });

  it("select music to play", async () => {
    vi.mocked(useMusicContext).mockReturnValue({
      musicListData: mockMusicList,
      updateMusicListData: mockUpdateMusicListData,
    });
    renderWithProviders(<MusicList />);
    expect(screen.queryByTestId("music-table")).toBeTruthy();
    const button = screen.getByTestId("music-table__mock__select");
    fireEvent.click(button);
    expect(screen.getAllByText(mockFilename)).toBeTruthy();
  });
});
