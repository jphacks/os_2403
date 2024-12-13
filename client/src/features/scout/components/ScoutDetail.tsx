import CardTag from "@/components/tags/card-tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getCommunityByUUID } from "@/features/account/api";
import { Community } from "@/features/account/types/community";
import style from "@/features/scout/styles/ScoutDetail.module.scss";
import { heartColor } from "@/styles/theme";
import { Heart, SquareX } from "lucide-react";
import React from "react";
import z from "zod";

const scoutDetailPropsSchema = z.object({
  community_uuid: z.string(),
  isLiked: z.boolean(),
  handleReject: z.function(),
  handleApprove: z.function(),
  // isEmpty: z.boolean(),
});

type ScoutDetailProps = z.infer<typeof scoutDetailPropsSchema>;

const communityInfoSchema = z.object({
  name: z.string(),
  mem1: z.string(),
  tags: z.string().array().optional(),
  icon: z.string().optional(),
  self: z.string().optional(),
});

type CommunityInfo = z.infer<typeof communityInfoSchema>;

export const ScoutDetail = (props: ScoutDetailProps) => {
  const [currentCommunityInfo, setCurrenttCommunityInfo] = React.useState<CommunityInfo>();

  const convertCommunityInfo = (communityData: Community) => {
    const communityInfo: CommunityInfo = {
      name: communityData.name,
      mem1: communityData.mem1,
      tags: communityData.tags,
      icon: communityData.img,
      self: communityData.self,
    };

    return communityInfo;
  };

  React.useEffect(() => {
    const fetchCommunityData = async () => {
      if (!props.community_uuid) {
        setCurrenttCommunityInfo(undefined);
        return;
      }

      // if (props.isEmpty) {
      //   setCurrenttCommunityInfo(undefined);
      // }

      try {
        const communityData = await getCommunityByUUID(props.community_uuid);
        if (!communityData) {
          setCurrenttCommunityInfo(undefined);
          return;
        }
        const communityInfo = convertCommunityInfo(communityData);
        setCurrenttCommunityInfo(communityInfo);
      } catch (error) {
        setCurrenttCommunityInfo(undefined);
        console.error(error);
      }
    };

    fetchCommunityData();
  }, [props?.community_uuid]);

  return (
    <div>
      <Card className={style.scout_detail_card}>
        <div className={style.scout_detail_tags}>
          {currentCommunityInfo?.tags?.map(tag => (
            <CardTag key={`tag-${tag}`} variant="red" className={style.tag}>
              {tag}
            </CardTag>
          )) || "タグなし"}
        </div>
        <div className={style.scout_property_container}>
          <h1 className={style.scout_detail_name}>{currentCommunityInfo?.name || "名無し"}</h1>
          <Avatar className={style.scout_detail_avatar_card}>
            <AvatarImage src={currentCommunityInfo?.icon} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className={style.scout_detail_mem1}>{currentCommunityInfo?.mem1 || "所属なし"}</p>
        </div>
        <div className={style.scout_detail_self_container}>
          <ScrollArea className={style.scout_detail_self} type="scroll">
            {currentCommunityInfo?.self?.split("\n").map(line => (
              <React.Fragment key={line}>
                {line}
                <br />
              </React.Fragment>
            )) || "データなし"}
            <ScrollBar />
          </ScrollArea>
        </div>
        <Button variant="outline" className={style.declineButton} onClick={props.handleReject}>
          <SquareX size={36} />
          招待を辞退する
        </Button>
        <Heart
          size={40}
          fill={props.isLiked ? heartColor : "none"}
          onClick={props.handleApprove}
          stroke={heartColor}
          className={style.heart}
        />
      </Card>
    </div>
  );
};
