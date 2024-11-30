"use client";

import { accountTypeAtom, userAtom } from "@/features/account/stores";
import { Community } from "@/features/account/types/community";
import { useAtom } from "jotai/index";
import { useRouter } from "next/navigation";
import react, { useState } from "react";

export const HomeComponent = () => {
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>();
  const [currentAccountType, setCurrentAccountType] = useAtom(accountTypeAtom);
  const router = useRouter();

  react.useEffect(() => {
    router.push("/user/signin");
  });

  return <></>;
};
