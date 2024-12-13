"use client";
import CardTag from "@/components/tags/card-tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ButtonVariant } from "@/features/tags/types/tag";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import styles from "../styles/user-card.module.scss";

export type UserCardType = {
  uuid: string;
  username: string;
  icon?: string;
  tags?: string[];
  tag_colors?: string[];
  detail?: string;
  university?: string;
  onClick: () => void;
  selected: boolean;
};

export function UserCard({
  uuid,
  username,
  icon,
  tags,
  tag_colors,
  detail,
  university,
  onClick,
  selected,
}: UserCardType) {
  const router = useRouter();
  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/community/user-detail?uuid=${uuid}`);
  };

  const handleClick = () => {
    onClick();
  };

  return (
    <Card className={cn(styles.profileCard, selected && styles.selected)} onClick={handleClick}>
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
            <AvatarFallback>{username}</AvatarFallback>
          </Avatar>
        </div>

        <div className={styles.middleSection}>
          <h2 className={styles.username} title={username}>
            {username}
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
            <span className={styles.moreButtonText}>もっと詳しく</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
