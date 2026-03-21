import { describe, vi, it, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MusicTable from "./MusicTable";
import type { MusicListSchema } from "@/schemas/music";

const mockMusicList: MusicListSchema = [
  {
    filename: "song_one.mp3",
    title: "song_one",
    genre: "Pop",
    durationSec: 185,
    size: 4,
    lastModified: new Date("2024-01-15").getTime(),
  },
];

const mockSelectMusic = vi.fn();

describe("MusicTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("renders table headers", () => {
    render(
      <MusicTable
        musicListData={[]}
        currentPlaying={undefined}
        onSelectMusic={mockSelectMusic}
      />,
    );
    expect(screen.getByText("Title")).toBeTruthy();
    expect(screen.getByText("Genre")).toBeTruthy();
    expect(screen.getByText("Duration")).toBeTruthy();
    expect(screen.getByText("File Size")).toBeTruthy();
    expect(screen.getByText("Last Modified")).toBeTruthy();
  });

  it("renders music data in a row", () => {
    render(
      <MusicTable
        musicListData={mockMusicList}
        currentPlaying={undefined}
        onSelectMusic={mockSelectMusic}
      />,
    );
    expect(screen.getByText("Song One")).toBeTruthy(); // parseMusicTitle
    expect(screen.getByText("Pop")).toBeTruthy();
    expect(screen.getByText("03:05")).toBeTruthy(); // parseDuration(185)
    expect(screen.getByText("4 MB")).toBeTruthy(); // parseMusicSize

    const playButton = screen.getByTestId("music-table-play");
    fireEvent.click(playButton);
    expect(mockSelectMusic).toHaveBeenCalledWith("song_one.mp3");
  });

  it("renders row with song playing", () => {
    render(
      <MusicTable
        musicListData={mockMusicList}
        currentPlaying={"song_one.mp3"}
        onSelectMusic={mockSelectMusic}
      />,
    );
    expect(screen.getByTestId("music-table-playing")).toBeTruthy();
    expect(screen.queryByTestId("music-table-play")).toBeFalsy();
  });

  it("shows '--:--' for invalid duration", () => {
    render(
      <MusicTable
        musicListData={[{ ...mockMusicList[0], durationSec: -1 }]}
        currentPlaying={undefined}
        onSelectMusic={mockSelectMusic}
      />,
    );
    expect(screen.getByText("--:--")).toBeTruthy();
  });

  it("renders no rows for empty data", () => {
    const { container } = render(
      <MusicTable
        musicListData={[]}
        currentPlaying={undefined}
        onSelectMusic={mockSelectMusic}
      />,
    );
    expect(container.querySelectorAll("tbody tr").length).toBe(0);
  });
});
