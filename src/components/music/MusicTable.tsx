import { AudioLines, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MusicListSchema } from "@/schemas/music";
import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { parseMusicDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import "./Music.css";

type MusicTableProps = {
  musicListData: MusicListSchema;
  currentPlaying: string | undefined;
  onSelectMusic: (musicFilename: string) => void;
};

const parseMusicTitle = (name: string) => {
  const parts = name
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
  return parts;
};

const parseLastModified = (millisecond: number) => {
  return new Date(millisecond).toLocaleDateString();
};

const parseMusicSize = (size: number) => {
  return `${size} MB`;
};

export default function MusicTable({
  musicListData,
  currentPlaying,
  onSelectMusic,
}: MusicTableProps) {
  const { t } = useTranslation("music:list");
  return (
    <div className="music-table">
      <Table>
        <TableHeader className="music-table__header">
          <TableRow className="music-table__row">
            <TableHead>{t("table.title")}</TableHead>
            <TableHead>{t("table.genre")}</TableHead>
            <TableHead>{t("table.duration")}</TableHead>
            <TableHead>{t("table.size")}</TableHead>
            <TableHead>{t("table.lastModified")}</TableHead>
            <TableHead> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {musicListData.map((music) => (
            <TableRow key={music.filename} className="music-table__row">
              <TableCell>{parseMusicTitle(music.title)}</TableCell>
              <TableCell>{music.genre}</TableCell>
              <TableCell>{parseMusicDuration(music.durationSec)}</TableCell>
              <TableCell>{parseMusicSize(music.size)}</TableCell>
              <TableCell>{parseLastModified(music.lastModified)}</TableCell>
              <TableCell>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="music-table__row__play group"
                  onClick={() => {
                    if (currentPlaying !== music.filename) {
                      onSelectMusic(music.filename);
                    }
                  }}
                >
                  {currentPlaying === music.filename ? (
                    <AudioLines
                      className="group-hover:stroke-background"
                      data-testid="music-table-playing"
                    />
                  ) : (
                    <Play
                      className="group-hover:fill-background"
                      data-testid="music-table-play"
                    />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
