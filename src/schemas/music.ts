import * as z from "zod";

const MusicItem = z.object({
  filename: z.string(),
  genre: z.string(),
  title: z.string(),
  durationSec: z.number(),
  size: z.number(),
  lastModified: z.number(),
});
const MusicList = z.array(MusicItem);

type MusicListSchema = z.infer<typeof MusicList>;

export { MusicList, type MusicListSchema };
