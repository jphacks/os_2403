"use client";
import CardTag from "@/components/tags/card-tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateScoutStatusForReaded } from "@/features/scout/funcs/updateScoutStatus";
import { heartColor } from "@/styles/theme";
import { Heart, SquareX } from "lucide-react";
import React from "react";
import z from "zod";
import style from "../styles/ScoutCard.module.scss";
const scoutCardPropsSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string().optional(),
  tags: z.string().optional().array().optional(),
  mem1: z.string(),
  isSelected: z.boolean(),
  key: z.number(),
  onSelect: z.function(),
  isLiked: z.boolean(),
  handleReject: z.function(),
  handleApprove: z.function(),
});

type ScoutCardProps = z.infer<typeof scoutCardPropsSchema>;

export const ScoutCard = (props: ScoutCardProps) => {
  // const [isLiked, setIsLiked] = React.useState(false);
  //
  // const handleLiked = () => {
  //   setIsLiked(!isLiked);
  //   props.handleApprove(props.id);
  //   // if (props?.id) {
  //   //   updateScoutStatusForApprove(props?.id);
  //   // }
  // };

  // const handleReject = () => {
  //   if (props?.id) {
  //     updateScoutStatusForReject(props?.id);
  //   }
  // };

  React.useEffect(() => {
    updateScoutStatusForReaded(props?.id);
  }, [props?.id]);

  return (
    <Card
      className={`${style.scoutCard} ${props.isSelected ? style.selected : ""}`}
      onClick={props.onSelect}
    >
      <div className={style.cardContent}>
        <div className={style.leftContent}>
          <div className={style.avatarWrapper}>
            <Avatar className={style.avatar}>
              <AvatarImage src={props.icon} />
              <AvatarFallback>{props.name}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className={style.mainContent}>
          <div className={style.tagsContainer}>
            {props.tags?.map(tag => (
              <CardTag key={`tag-${tag}`} variant="red" className={style.tag}>
                {tag}
              </CardTag>
            ))}
          </div>
          <h2 className={style.username}>{props.name}</h2>
          <Heart
            fill={props.isLiked ? heartColor : "none"}
            stroke={heartColor}
            className={style.heart}
            onClick={props.handleApprove}
          />
        </div>

        <div className={style.rightContent}>
          <Button variant="outline" className={style.declineButton} onClick={props.handleReject}>
            <SquareX size={36} />
            招待を辞退する
          </Button>
          <div className={style.moreButtonContainer}>
            <p className={style.university}>{props.mem1}</p>
            {/*<span className={style.arrow}>もっと詳しく›</span>*/}
          </div>
        </div>
      </div>
    </Card>
  );
};
