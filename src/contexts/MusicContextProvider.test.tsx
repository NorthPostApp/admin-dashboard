import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MusicContextProvder from "./MusicContextProvider";
import { useMusicContext } from "@/hooks/useMusicContext";
import type { MusicListSchema } from "@/schemas/music";

const mockMusicList: MusicListSchema = [
  {
    filename: "song.mp3",
    title: "song",
    genre: "Pop",
    durationSec: 120,
    size: 3,
    lastModified: 0,
  },
];

function TestComponent() {
  const { musicListData, updateMusicListData } = useMusicContext();
  return (
    <div>
      <div data-testid="count">{musicListData ? musicListData.length : "empty"}</div>
      <button onClick={() => updateMusicListData(mockMusicList)}>Load</button>
    </div>
  );
}

describe("MusicContextProvider", () => {
  it("provides undefined musicListData by default", () => {
    render(
      <MusicContextProvder>
        <TestComponent />
      </MusicContextProvder>,
    );
    expect(screen.getByTestId("count").textContent).toBe("empty");
  });

  it("updates musicListData when updateMusicListData is called", () => {
    render(
      <MusicContextProvder>
        <TestComponent />
      </MusicContextProvder>,
    );
    fireEvent.click(screen.getByText("Load"));
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  it("throws when useMusicContext is used outside provider", () => {
    expect(() => render(<TestComponent />)).toThrow(
      "useMusicContext hook must be used within MusicContextProvider",
    );
  });
});
