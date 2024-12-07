import { z } from "zod";

export const accountTypeSchema = z.enum(["not", "user", "community"]);

export type AccountType = z.infer<typeof accountTypeSchema>;
