import axios from "axios";

export const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});
