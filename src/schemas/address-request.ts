import { z } from "zod";
import { AddressItem } from "./address";

const ADDRESS_REQUEST_STATUS = ["pending", "processing", "completed", "failed"] as const;
type AddressRequestStatus = (typeof ADDRESS_REQUEST_STATUS)[number];

const AddressRequestBaseSchema = z.object({
  id: z.string(),
  content: z.string(),
  requestBy: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  notes: z.string().optional(),
});

const AddressRequestStatusSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("pending"),
  }),
  z.object({
    status: z.literal("processing"),
    pendingCandidates: z.array(AddressItem).nullish(),
  }),
  z.object({
    status: z.literal("completed"),
    resolvedID: z.string(),
  }),
  z.object({
    status: z.literal("failed"),
    failedReason: z.string(),
  }),
]);

const AddressRequestSchema = AddressRequestBaseSchema.and(AddressRequestStatusSchema);
const AddressRequestsSchema = z.array(AddressRequestSchema);
type AddressRequest = z.infer<typeof AddressRequestSchema>;
type AddressRequests = z.infer<typeof AddressRequestsSchema>;

export { ADDRESS_REQUEST_STATUS, AddressRequestSchema, AddressRequestsSchema };
export type { AddressRequest, AddressRequestStatus, AddressRequests };
