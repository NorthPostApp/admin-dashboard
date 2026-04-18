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

type TypesenseInfoSchema = z.infer<typeof TypesenseInfo>;

export { TypesenseInfo, type TypesenseInfoSchema };
