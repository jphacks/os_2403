import { Community } from "@/features/account/types/community";
import { AccountType } from "@/features/account/types/type";
import { User } from "@/features/account/types/user";
import { atom } from "jotai/index";

export const userAtom = atom<User>();

export const communityAtom = atom<Community>();

export const accountTypeAtom = atom<AccountType>("not");
