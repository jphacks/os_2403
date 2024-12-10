import z from "zod";

export const updateScoutStatusRequestSchema = z.object({
  user_uuid: z.string(),
  status: z.number(), //0:未読、1:既読、2：興味なし、3:興味あり
});

export type UpdateScoutStatusRequest = z.infer<typeof updateScoutStatusRequestSchema>;

export const scoutCardPropsSchema = z.object({
  username: z.string(),
  icon: z.string().optional(),
  tags: z.string().optional().array().optional(),
  // detail: z.string().optional(),
  university: z.string(),
  isSelected: z.boolean(),
  key: z.number(),
  onSelect: z.function(),
});

export type ScoutCardProps = z.infer<typeof scoutCardPropsSchema>;

export const scoutDetailPropsSchema = z.object({
  name: z.string(),
  tags: z.string().optional().array().optional(),
  icon: z.string().optional(),
  mem1: z.string(),
  self: z.string(),
});

export type ScoutDetailProps = z.infer<typeof scoutDetailPropsSchema>;
