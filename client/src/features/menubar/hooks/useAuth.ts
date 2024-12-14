// hooks/useAuth.ts
"use client";
import { getCommunityByUUID, getUserByUUID } from "@/features/account/api";
import { accountTypeAtom, communityAtom, userAtom } from "@/features/account/stores";
import { SessionData } from "@/features/account/types/session";
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai/index";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useAuth = () => {
  const [_currentAccountType, setCurrentAccountType] = useAtom(accountTypeAtom);
  const [_currentUser, setCurrentUser] = useAtom(userAtom);
  const [_currentCommunity, setCurrentCommunity] = useAtom(communityAtom);

  const router = useRouter();
  const checkSession = useCallback(async () => {
    try {
      const res = await apiClient.get("/session");
      const session = res.data;
      const userData: SessionData = {
        uuid: session.uuid,
        account_type: session.account_type,
        status: session.status,
      };
      // console.log(userData);

      switch (userData.account_type) {
        case "user": {
          setCurrentAccountType(userData.account_type);
          const getUser = await getUserByUUID(userData.uuid);
          setCurrentUser(getUser);
          router.push("/user/home");
          break;
        }

        case "community": {
          setCurrentAccountType(userData.account_type);
          const getCommunity = await getCommunityByUUID(userData.uuid);
          setCurrentCommunity(getCommunity);
          router.push("/community/home");
          break;
        }
        default:
          setCurrentAccountType("not");
          router.push("/user/signin");
          break;
      }
    } catch (error) {
      console.error("Session check failed:", error);
    } finally {
    }
  }, []);

  const signout = useCallback(async () => {
    try {
      apiClient.get("signout").then(() => {
        router.push("/user/signin");
      });
    } catch (error) {
      console.log("Signout failed:", error);
    }
  }, [router]);

  return {
    checkSession,
    signout,
  };
};
