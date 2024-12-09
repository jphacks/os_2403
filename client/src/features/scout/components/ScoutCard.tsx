"use client";
import CardTag from "@/components/tags/card-tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoutCardProps } from "@/features/scout/types";
import { heartColor } from "@/styles/theme";
import { Heart, SquareX } from "lucide-react";
import React from "react";
import style from "../styles/ScoutCard.module.scss";

export const ScoutCard = (props: ScoutCardProps) => {
  const [isLiked, setIsLiked] = React.useState(false);

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
              <AvatarFallback>{props.username}</AvatarFallback>
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
          <h2 className={style.username}>{props.username}</h2>
          <Heart
            fill={isLiked ? heartColor : "none"}
            onClick={() => {
              setIsLiked(!isLiked);
            }}
            stroke={heartColor}
            className={style.heart}
          />
        </div>

        <div className={style.rightContent}>
          <Button variant="outline" className={style.declineButton}>
            <SquareX size={36} />
            招待を辞退する
          </Button>
          <div className={style.moreButtonContainer}>
            <p className={style.university}>{props.university}</p>
            <span className={style.arrow}>もっと詳しく›</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// const scoutDetailPropsSchema = z.object({
//   name: z.string(),
//   mem1: z.string(),
//   self: z.string(),
// });
//
// type ScoutDetailProps = z.infer<typeof scoutDetailPropsSchema>;
//
// export const ScoutDetail = (scoutDetail: ScoutDetailProps) => {
//   const [isLiked, setIsLiked] = React.useState(false);
//   return (
//     <div>
//       <Card className={style.scout_detail_card}>
//         <div className={style.scout_detail_tags}>タグず</div>
//         <div className={style.scout_property_container}>
//           <h1 className={style.scout_detail_name}>{scoutDetail?.name || "田中角栄"}</h1>
//           <Avatar className={style.scout_detail_avatar_card}>
//             <AvatarImage src="https://github.com/shadcn.png" />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//           <p className={style.scout_detail_mem1}>{scoutDetail?.mem1 || "立命館大学"}</p>
//         </div>
//         <div className={style.scout_detail_self_container}>
//           <ScrollArea className={style.scout_detail_self} type="scroll">
//             {scoutDetail?.self ||
//               `
//       上手くいって欲しい……そんなのは当たり前のごとく思ってますけれども、やっぱりこの界隈で簡単に許されることでは無い
//       単純にスパンが短すぎて、この前ボロ泣きした私や大勢のファン、ホロメンたちが浮かばれない気がしてさ
//       まぁさ、嬉しいんだけれども。
//       さすがに1,2年は空けて欲しかった気持ち
//       激重厄介ファンだからこそ、大好きだったからこそ容易には受け入れられない壁があるんや……
//     `
//                 .split("\n")
//                 .map(line => (
//                   <React.Fragment key={line}>
//                     {line}
//                     <br />
//                   </React.Fragment>
//                 ))}
//             <ScrollBar />
//           </ScrollArea>
//         </div>
//         <Button variant="outline" className={style.declineButton}>
//           <SquareX size={36} />
//           招待を辞退する
//         </Button>
//         <Heart
//           size={40}
//           fill={isLiked ? heartColor : "none"}
//           onClick={() => {
//             setIsLiked(!isLiked);
//           }}
//           stroke={heartColor}
//           className={style.heart}
//         />
//       </Card>
//     </div>
//   );
// };
