"use client";
import Pencil from "@/../public/pencil";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { communityAtom } from "@/domain/community";
import { accountTypeAtom } from "@/domain/general";
import { User, userAtom } from "@/domain/user";
import style from "@/feature/profile/components/style.module.scss";
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai/index";
import Link from "next/link";
import { useRouter } from "next/navigation";
import react, { useState } from "react";
import React from "react";
import z from "zod";

//user
const profileSchema = z.object({
  name: z.string(),
  mem1: z.string(),
  img: z.string(),
  self: z.string(),
});

type Profile = z.infer<typeof profileSchema>;

export const ProfileCard = () => {
  const [currentUser] = useAtom(userAtom);
  const [currentCommunity] = useAtom(communityAtom);
  const [currentAccountType] = useAtom(accountTypeAtom);
  const [currentProfile, setCurrentProfile] = React.useState<Profile>();
  const router = useRouter();
  let settingURI = "";

  if (currentAccountType === "user") {
    settingURI = "/profile/setting/user";
  }

  react.useEffect(() => {
    if (currentAccountType === "user" && currentProfile === undefined) {
      apiClient.get(`/user/${currentUser?.uuid}`).then(res => {
        const userProfileResponse: Profile = {
          name: res?.data.name,
          mem1: res?.data.mem1,
          img: res?.data.img,
          self: res?.data.self,
        };
        setCurrentProfile(userProfileResponse);
      });
    } else if (currentAccountType === "community" && currentProfile === undefined) {
      apiClient.get(`/community/${currentCommunity?.uuid}`).then(res => {
        const userProfileResponse: Profile = {
          name: res?.data.name,
          mem1: res?.data.mem1,
          img: res?.data.img,
          self: res?.data.self,
        };
        setCurrentProfile(userProfileResponse);
      });
    }
  }, [currentAccountType, currentProfile, currentUser, currentCommunity]);

  return (
    <div className={style.profile_card_container}>
      <Card className={style.profile_card}>
        <Avatar className={style.avatar}>
          <AvatarImage src={currentProfile?.img} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className={style.profile_word_container}>
          <CardHeader>
            <CardTitle className={style.profile_title}>
              <p className={style.profile_name}>{currentProfile?.name}</p>
              <p className={style.profile_mem}>{currentProfile?.mem1}</p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={style.profile_self}>{currentProfile?.self}</p>
          </CardContent>
        </div>
        <Button className={style.setting_button} asChild>
          <Link href={settingURI}>
            <Pencil />
            プロフィール編集
          </Link>
        </Button>
      </Card>
    </div>
  );
};
