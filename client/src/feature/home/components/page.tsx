"use client";
import { Community } from "@/domain/community";
import { accountTypeAtom, statusAtom } from "@/domain/general";
import { userAtom } from "@/domain/user";
import { useAtom } from "jotai/index";
import { useRouter } from "next/navigation";
import react, { useState } from "react";

export const HomeComponent = () => {
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>();
  const [currentAccountType, setCurrentAccountType] = useAtom(accountTypeAtom);
  const router = useRouter();

  react.useEffect(() => {
    router.push("/signin/user");
  });

  return <></>;
};
