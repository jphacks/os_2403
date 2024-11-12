import { atom } from "jotai";
import { z } from "zod";

export const UserSchema = z.object({
  uuid: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  password: z.string().optional(),
  img: z.string().optional(),
  self: z.string().optional(),
  mem1: z.string().optional(),
  mem2: z.string().optional(),
  mem3: z.string().optional(),
  // tags: number[];
});

export type User = z.infer<typeof UserSchema>;
export const userAtom = atom<User>();
