import * as z from "zod";

const TypesenseInfo = z.object({
  health: z.boolean(),
  systemCpuActivePercentage: z.number(),
  systemDiskTotalBytes: z.number(),
  systemDiskUsedBytes: z.number(),
  systemMemoryTotalBytes: z.number(),
  systemMemoryUsedBytes: z.number(),
  systemNetworkSentBytes: z.number(),
  systemNetworkReceivedBytes: z.number(),
});

const TypesenseSyncResult = z.object({
  total: z.number(),
  success: z.number(),
  failed: z.number(),
});

type TypesenseInfoSchema = z.infer<typeof TypesenseInfo>;
type TypesenseSyncResultSchema = z.infer<typeof TypesenseSyncResult>;

export {
  TypesenseInfo,
  TypesenseSyncResult,
  type TypesenseInfoSchema,
  type TypesenseSyncResultSchema,
};
