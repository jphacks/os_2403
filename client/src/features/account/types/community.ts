import { z } from "zod";

export const CommunitySchema = z.object({
  uuid: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  password: z.string().optional(),
  img: z.string().optional(),
  self: z.string().optional(),
  mem1: z.string(),
  mem2: z.string().optional(),
  mem3: z.string().optional(),
  tags: z.string().array().optional(),
});

export type Community = z.infer<typeof CommunitySchema>;
