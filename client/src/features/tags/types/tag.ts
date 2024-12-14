import { z } from "zod";

const ButtonVariantEnum = z.enum(["red", "blue", "green", "gray", "purple"]);
export type ButtonVariant = z.infer<typeof ButtonVariantEnum>;

export const TagSchema = z.object({
  name: z.string(),
  color: ButtonVariantEnum,
});

export type TagType = z.infer<typeof TagSchema>;
