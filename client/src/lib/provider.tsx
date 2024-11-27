"use client";
import { Community, communityAtom } from "@/domain/community";
import { accountTypeAtom } from "@/domain/general";
import { User, userAtom } from "@/domain/user";
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai/index";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const [currentCommunity, setCurrentCommunity] = useAtom(communityAtom);
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
