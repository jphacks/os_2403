"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, userAtom } from "@/domain/user";
import style from "@/feature/profile/components/style.module.scss";
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai/index";
import { useRouter } from "next/navigation";
import react, { useState } from "react";

//user

export const ProfileCard = () => {
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const router = useRouter();

  react.useEffect(() => {
    if (currentUser != null) {
      const response = apiClient.post("/user", currentUser.uuid);
      const user: User = {
        uuid: response.data.uuid,
        name: response.data.name,
      };

      setCurrentUser(user);
    }
  });

  const onClick = () => {
    router.push("/");
  };

  return (
    <Card className={style.profile_card}>
      <CardHeader>
        <CardTitle className={style.word}>
          {/*{currentUser?.name}{" "}*/}
          <div>
            <h1 className={style.h1}>やまけん</h1>
          </div>
          {/*<span>*/}
          {/*	/!*{currentUser?.mem1}, {currentUser?.mem2}*!/*/}
          {/*</span>*/}
        </CardTitle>
      </CardHeader>
      <CardContent>{currentUser?.self}</CardContent>

      <Button onClick={onClick} className={style.button}>
        プロフィール編集
      </Button>
    </Card>
  );
};
