"use client";
import Pencil from "@/../public/pencil";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getCommunityByUUID, getUserByUUID } from "@/features/account/api";
import { useSetBaseAccountType } from "@/features/account/hooks";
import { accountTypeAtom, communityAtom, userAtom } from "@/features/account/stores";
import { Community } from "@/features/account/types/community";
import { User } from "@/features/account/types/user";
import style from "@/features/profile/components/style.module.scss";
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai/index";
import Link from "next/link";
import react from "react";
import React from "react";
import z from "zod";

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
  const settingURI = `${useSetBaseAccountType(currentAccountType)}/profile/setting`;

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

const profileDetailCardPropsSchema = z.object({
  uuid: z.string(),
});

type ProfileDetailCardProps = z.infer<typeof profileDetailCardPropsSchema>;

//uuidを渡すように
export const ProfileDetailCard = (props: ProfileDetailCardProps) => {
  const [currentAccountType] = useAtom(accountTypeAtom);

  const [detail, setDetail] = React.useState<User | Community>();
  const uuid = props.uuid;

  React.useEffect(() => {
    const fetch = async () => {
      if (currentAccountType === "user") {
        const data = await getCommunityByUUID(uuid);
        setDetail(data);
      } else {
        const data = await getUserByUUID(uuid);
        setDetail(data);
      }
    };
    fetch();
  }, [uuid]);

  return (
    <div>
      <Card className={style.profile_detail_card}>
        <div className={style.profile_detail_tags}>タグず</div>
        <div className={style.profile_property_container}>
          <h1 className={style.profile_detail_name}>{detail?.name || "データなし"}</h1>
          <Avatar className={style.profile_detail_avatar_card}>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className={style.profile_detail_mem1}>{detail?.mem1 || "データなし"}</p>
        </div>
        <div className={style.profile_detail_self_container}>
          <ScrollArea className={style.profile_detail_self} type="scroll">
            {detail?.self ||
              `
    データなし
    `
                .split("\n")
                .map(line => (
                  <React.Fragment key={line}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
            <ScrollBar />
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};
