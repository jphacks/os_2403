"use client";

import { accountTypeAtom, communityAtom, userAtom } from "@/features/account/stores";
import { useAtom } from "jotai/index";
import { useRouter } from "next/navigation";
import React from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser] = useAtom(userAtom);
  const [currentCommunity] = useAtom(communityAtom);
  const [currentAccountType] = useAtom(accountTypeAtom);
  const router = useRouter();

  React.useEffect(() => {
    if (currentAccountType === "not" || (currentAccountType === "user" && !currentUser)) {
      router.push("/signin/user");
    } else if (currentAccountType === "community" && !currentCommunity) {
      router.push("/signin/community");
    }
  }, [currentAccountType, currentUser, currentCommunity, router]);

  return <>{children}</>;
}
