import { Play } from "lucide-react";
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
import "./Music.css";

type MusicTableProps = {
  musicListData: MusicListSchema;
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

const parseDuration = (seconds: number) => {
  if (seconds && seconds > -1) {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(Math.round(seconds % 60)).padStart(2, "0");
    return `${min}:${sec}`;
  }
  return "--:--";
};

export default function MusicTable({ musicListData }: MusicTableProps) {
  const { t } = useTranslation("music:list");
  return (
    <div className="border rounded-xl max-h-full overflow-hidden">
      <Table>
        <TableHeader className="bg-accent">
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
              <TableCell>{parseDuration(music.durationSec)}</TableCell>
              <TableCell>{parseMusicSize(music.size)}</TableCell>
              <TableCell>{parseLastModified(music.lastModified)}</TableCell>
              <TableCell>
                <Play size={14} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
