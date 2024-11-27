"use client";

import CardTag from "@/components/tags/card-tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { TagType } from "@/domain/tag";
import { Heart, SquareX } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";
import style from "./style.module.scss";

type EventCardProps = {
  title: string;
  publisher: string;
  publisherIcon: string;
  datetime: string;
  tags: TagType[];
  imageUrl: string;
  liked?: boolean;
  handleEventClose: () => void;
};

export function EventCard({
  title,
  publisher,
  publisherIcon = "https://github.com/shadcn.png",
  datetime,
  tags,
  imageUrl = "https://github.com/shadcn.png",
  liked = false,
  handleEventClose,
}: EventCardProps): ReactElement {
  const [isLiked, setIsLiked] = useState(liked);

  return (
    <Card className={style.card}>
      <CardHeader className={style.cardHeader}>
        <div className={style.tagWrapper}>
          <div className={style.tags}>
            {tags.map(tag => (
              <CardTag key={tag.name} variant={"red"}>
                {tag.name}
              </CardTag>
            ))}
          </div>
        </div>
        <div className={style.closeButton}>
          <SquareX size={24} stroke="#434141" onClick={handleEventClose} />
        </div>
      </CardHeader>

      <CardContent>
        <div className={style.imgBox}>
          <img className={style.img} src={imageUrl} alt={title} />
        </div>
        <div className={style.icons}>
          <Heart
            size={32}
            fill={isLiked ? "#E74C3C" : "none"}
            stroke="#E74C3C"
            onClick={() => setIsLiked(!isLiked)}
          />
        </div>

        <h3 className="mt-4 mb-4 text-lg font-semibold">{title}</h3>
      </CardContent>
      <CardFooter className={style.cardFooter}>
        <div className={style.footerContent}>
          <div className={style.footerInfo}>
            <div className={style.publisherRow}>
              <Avatar className={style.avatar}>
                <AvatarImage src={publisherIcon} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className={style.publisherName}>{publisher}</span>
            </div>
            <time className={style.dateDisplay}>{datetime}</time>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
