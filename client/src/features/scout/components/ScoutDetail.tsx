import CardTag from "@/components/tags/card-tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import style from "@/features/scout/styles/ScoutDetail.module.scss";
import { ScoutDetailProps } from "@/features/scout/types";
import { heartColor } from "@/styles/theme";
import { Heart, SquareX } from "lucide-react";
import React from "react";

export const ScoutDetail = (props: ScoutDetailProps) => {
  const [isLiked, setIsLiked] = React.useState(false);
  return (
    <div>
      <Card className={style.scout_detail_card}>
        <div className={style.scout_detail_tags}>
          {props.tags?.map(tag => (
            <CardTag key={`tag-${tag}`} variant="red" className={style.tag}>
              {tag}
            </CardTag>
          ))}
        </div>
        <div className={style.scout_property_container}>
          <h1 className={style.scout_detail_name}>{props?.name}</h1>
          <Avatar className={style.scout_detail_avatar_card}>
            <AvatarImage src={props.icon} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className={style.scout_detail_mem1}>{props?.mem1 || "立命館大学"}</p>
        </div>
        <div className={style.scout_detail_self_container}>
          <ScrollArea className={style.scout_detail_self} type="scroll">
            {props?.self.split("\n").map(line => (
              <React.Fragment key={line}>
                {line}
                <br />
              </React.Fragment>
            ))}
            <ScrollBar />
          </ScrollArea>
        </div>
        <Button variant="outline" className={style.declineButton}>
          <SquareX size={36} />
          招待を辞退する
        </Button>
        <Heart
          size={40}
          fill={isLiked ? heartColor : "none"}
          onClick={() => {
            setIsLiked(!isLiked);
          }}
          stroke={heartColor}
          className={style.heart}
        />
      </Card>
    </div>
  );
};
