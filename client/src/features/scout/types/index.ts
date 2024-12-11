import z from "zod";

export enum ScoutStatus {
  Unread = "unread",
  Read = "read",
  Approve = "approve",
  Reject = "reject",
}

// export const scoutStatusSchema = z.nativeEnum(ScoutStatus);

// export type ScoutStatus = z.infer<typeof scoutStatus>;

export const detailInfoSchema = z.object({
  name: z.string(),
  img: z.string().optional(),
  mem1: z.string(),
  tags: z.string().array().optional(),
});

export type DetailInfo = z.infer<typeof detailInfoSchema>;

export const getCommunityDetailResponseSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(ScoutStatus),
  unread_count: z.number(),
  uuid: z.string(),
  detail_info: detailInfoSchema,
});

export type GetCommunityDetailResponse = z.infer<typeof getCommunityDetailResponseSchema>;

export const updateScoutStatusRequestSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(ScoutStatus), //0:未読、1:既読、2：興味なし、3:興味あり
});

export type UpdateScoutStatusRequest = z.infer<typeof updateScoutStatusRequestSchema>;
