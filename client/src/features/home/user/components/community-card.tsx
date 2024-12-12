"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import styles from "../styles/community-card.module.scss";

export type UserCardType = {
  uuid: string;
  communityname: string;
  icon?: string;
  tags?: number[];
  detail?: string;
  university?: string;
  onClick: () => void;
};

export function CommunityCard({
  uuid,
  communityname,
  icon,
  tags,
  detail,
  university,
  onClick,
}: UserCardType) {
  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // window.location.href = `/community/user/${uuid}`;
    console.log(uuid);
  };

  const handleClick = () => {
    onClick();
  };

  return (
    <Card className={styles.profileCard} onClick={handleClick}>
      <div className={styles.tagsContainer}>
        {tags?.map(tag => (
          <Badge key={tag} className={styles.tag}>
            {tag}
          </Badge>
        ))}
      </div>

      <div className={styles.cardContent}>
        <div className={styles.leftSection}>
          <Avatar className={styles.avatar}>
            <AvatarImage src={icon} />
            <AvatarFallback>{communityname}</AvatarFallback>
          </Avatar>
        </div>

        <div className={styles.middleSection}>
          <h2 className={styles.username} title={communityname}>
            {communityname}
          </h2>
          <div className={styles.details} title={detail}>
            {detail}
          </div>
        </div>

        <div className={styles.rightSection}>
          <p className={styles.university} title={university}>
            {university}
          </p>
          <button
            className={styles.moreButton}
            onClick={handleDetailClick}
            type="button"
            aria-label="詳細を見る"
          >
            <span className={styles.arrow}>›</span>
            もっと詳しく
          </button>
        </div>
      </div>
    </Card>
  );
}
