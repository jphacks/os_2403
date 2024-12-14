import z from "zod";

export const sessionDataSchema = z.object({
  uuid: z.string(),
  account_type: z.string(),
  status: z.string(),
});

export type SessionData = z.infer<typeof sessionDataSchema>;
