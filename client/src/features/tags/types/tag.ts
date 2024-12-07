import { z } from "zod";

// ButtonVariant型を定義
const ButtonVariantEnum = z.enum(["red", "blue", "green", "gray", "purple"]);
export type ButtonVariant = z.infer<typeof ButtonVariantEnum>;

// Tagの定義
export const TagSchema = z.object({
  name: z.string(),
  color: ButtonVariantEnum  // colorの型をButtonVariantに制限
});

// 型の定義
export type TagType = z.infer<typeof TagSchema>;
