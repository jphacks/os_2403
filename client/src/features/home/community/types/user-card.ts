import { z } from "zod";

const UserCardSchema = z.object({
  uuid: z.string().min(1),
  username: z.string(),
  icon: z.string().optional(),
  tags: z.number().array().optional(),
  detail: z.string().optional(),
  university: z.string().optional(),
});

export type UserCardType = z.infer<typeof UserCardSchema>;
