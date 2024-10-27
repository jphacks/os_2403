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
	name: z.string().min(1, { message: "入力必須な項目です。" }),
	mem1: z.string().min(1, { message: "入力必須な項目です。" }),
	mem2: z.string(),
	mem3: z.string(),
	img: z.string(),
	email: z.string().min(1, { message: "入力必須な項目です。" }),
	password: z.string().min(1, { message: "入力必須な項目です。" }),
	self: z.string(),
});

export type SignupForm = z.infer<typeof SignupFormSchema>;

export const LoginFormSchema = z.object({
	email: z.string().min(1, { message: "入力必須な項目です。" }),
	password: z.string().min(1, { message: "入力必須な項目です。" }),
});

export type LoginForm = z.infer<typeof LoginFormSchema>;
