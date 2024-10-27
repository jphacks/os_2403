"use client";
import react from "react";
import { useRouter } from "next/navigation";

export const HomeComponent = () => {
	const router = useRouter();
	react.useEffect(() => {
		router.push("/login/user");
	});

	return <></>;
};
