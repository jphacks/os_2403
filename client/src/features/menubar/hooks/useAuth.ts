// hooks/useAuth.ts

import { SessionData } from "@/features/account/types/session";
import { apiClient } from "@/utils/client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useAuth = () => {
  const router = useRouter();
  const checkSession = useCallback(async () => {
    try {
      const res = await apiClient.get("/session");
      const session = res.data;
      const userData: SessionData = {
        uuid: session.user_id,
        email: session.email,
      };
      console.log(userData);
    } catch (error) {
      console.error("Session check failed:", error);
    } finally {
      console.log("set user");
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
