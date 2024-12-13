import { z } from "zod";

const uuidSchema = z.object({
  user_uuid: z.string(),
});

export const scoutPostSchema = z.object({
  content: z.string(),
  community_uuid: z.string(),
  uuids: uuidSchema.array(),
});

export type ScoutPostType = z.infer<typeof scoutPostSchema>;
