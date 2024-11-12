import { atom } from "jotai/index";
import { Atom } from "lucide-react";
import { z } from "zod";

export const accountTypeSchema = z.enum(["not", "user", "community"]);

export type AccountType = z.infer<typeof accountTypeSchema>;

export const accountTypeAtom = atom<AccountType>("not");
