import { z } from "zod";
import { AddressItem } from "./address";

const ADDRESS_REQUEST_STATUS = ["pending", "processing", "completed", "failed"] as const;
type AddressRequestStatus = (typeof ADDRESS_REQUEST_STATUS)[number];

const AddressRequestSchema = z.object({
  id: z.string(),
  status: z.enum(ADDRESS_REQUEST_STATUS),
  content: z.string(),
  requestBy: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  notes: z.string().optional(),
  pendingCandidates: z.array(AddressItem).nullish(),
  resolvedID: z.string().nullish(),
  failedReason: z.string().nullish(),
});

const AddressRequestsSchema = z.array(AddressRequestSchema);
type AddressRequest = z.infer<typeof AddressRequestSchema>;
type AddressRequests = z.infer<typeof AddressRequestsSchema>;

export { ADDRESS_REQUEST_STATUS, AddressRequestSchema, AddressRequestsSchema };
export type { AddressRequest, AddressRequestStatus, AddressRequests };
