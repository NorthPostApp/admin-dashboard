import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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

describe("MusicTable", () => {
  it("renders table headers", () => {
    render(<MusicTable musicListData={[]} />);
    expect(screen.getByText("Title")).toBeTruthy();
    expect(screen.getByText("Genre")).toBeTruthy();
    expect(screen.getByText("Duration")).toBeTruthy();
    expect(screen.getByText("File Size")).toBeTruthy();
    expect(screen.getByText("Last Modified")).toBeTruthy();
  });

  it("renders music data in a row", () => {
    render(<MusicTable musicListData={mockMusicList} />);
    expect(screen.getByText("Song One")).toBeTruthy(); // parseMusicTitle
    expect(screen.getByText("Pop")).toBeTruthy();
    expect(screen.getByText("03:05")).toBeTruthy(); // parseDuration(185)
    expect(screen.getByText("4 MB")).toBeTruthy(); // parseMusicSize
  });

  it("shows '--:--' for invalid duration", () => {
    render(<MusicTable musicListData={[{ ...mockMusicList[0], durationSec: -1 }]} />);
    expect(screen.getByText("--:--")).toBeTruthy();
  });

  it("renders no rows for empty data", () => {
    const { container } = render(<MusicTable musicListData={[]} />);
    expect(container.querySelectorAll("tbody tr").length).toBe(0);
  });
});
