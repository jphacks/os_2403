import { z } from "zod";

// CommunityInfoの定義（イベント表示用の簡略情報）
export const CommunityInfoSchema = z.object({
  name: z.string(),
  img: z.string(),
});

// Eventの定義
export const EventSchema = z.object({
  community_uuid: z.string(),
  community_info: CommunityInfoSchema,
  title: z.string(),
  img: z.string(),
  detailed: z.string(),
  date: z.string(),
  tag: z.array(z.number()),
});

// 型の定義
export type CommunityInfoType = z.infer<typeof CommunityInfoSchema>;
export type EventType = z.infer<typeof EventSchema>;
