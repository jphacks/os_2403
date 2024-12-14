"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Home = () => {
  const router = useRouter();
  React.useEffect(() => {
    router.push("user/signin");
  }, []);
  return <></>;
};

export default Home;
