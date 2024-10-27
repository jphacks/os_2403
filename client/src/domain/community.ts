import { atom } from "jotai/index";
import { User } from "@/domain/user";

export type Community = {
	uuid: number;
	// name: string;
	// email: string;
	// password: string;
	// img: string;
	// self: string;
	// mem1: number;
	// mem2: number;
	// mem3: number;
	// tag: number[];
};
export const userAtom = atom<Community | null>(null);
