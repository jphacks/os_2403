import { atom } from "jotai";
import { z } from "zod";

export type User = {
	uuid: number;
	name: string;
	email: string;
	password: string;
	img: string;
	self: string;
	mem1: number;
	mem2: number;
	mem3: number;
	tag: number[];
};
export const userAtom = atom<User | null>(null);

export const SignupFormSchema = z.object({
	nickname: z.string().min(1, { message: "入力必須な項目です。" }),
	belong_to1: z.string().min(1, { message: "入力必須な項目です。" }),
	belong_to2: z.string(),
	belong_to3: z.string(),
	img: z.string(),
	mail: z.string().min(1, { message: "入力必須な項目です。" }),
	password: z.string().min(1, { message: "入力必須な項目です。" }),
	introduction: z.string(),
});

export type SignupForm = z.infer<typeof SignupFormSchema>;
