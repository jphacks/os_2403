"use client";
import CardTag from "@/components/tags/card-tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ButtonVariant } from "@/features/tags/types/tag";
import { useRouter } from "next/navigation";
import styles from "../styles/community-card.module.scss";

export type CommunityCardType = {
  uuid: string;
  communityname: string;
  icon?: string;
  tags?: string[];
  tag_colors?: string[];
  detail?: string;
  university?: string;
  onClick: () => void;
};

export function CommunityCard({
  uuid,
  communityname,
  icon,
  tags,
  tag_colors,
  detail,
  university,
  onClick,
}: CommunityCardType) {
  const router = useRouter();
  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/user/community-detail?uuid=${uuid}`);
    console.log(uuid);
  };

  const handleClick = () => {
    onClick();
  };

  return (
    <Card className={styles.profileCard} onClick={handleClick}>
      <div className={styles.tagsContainer}>
        {tags?.map((tag, index) => (
          <CardTag key={tag} variant={tag_colors?.[index]?.toLowerCase() as ButtonVariant}>
            {tag}
          </CardTag>
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
