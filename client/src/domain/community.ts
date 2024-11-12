import { User } from "@/domain/user";
import { atom } from "jotai/index";
import { z } from "zod";

// export type Community = {
//   uuid: string;
//   name: string;
//   email: string;
//   password: string;
//   img: string;
//   self: string;
//   mem1: string;
//   mem2: string;
//   mem3: string;
//   tag: number[];
// };

export const CommunitySchema = z.object({
  uuid: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  password: z.string().optional(),
  img: z.string().optional(),
  self: z.string().optional(),
  mem1: z.string().optional(),
  mem2: z.string().optional(),
  mem3: z.string().optional(),
});

export type Community = z.infer<typeof CommunitySchema>;

export const communityAtom = atom<Community>();
