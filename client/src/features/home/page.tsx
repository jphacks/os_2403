"use client";
import { useRouter } from "next/navigation";
import react from "react";

export const HomeComponent = () => {
  const router = useRouter();

  react.useEffect(() => {
    router.push("/user/signin");
  });

  return <></>;
};
