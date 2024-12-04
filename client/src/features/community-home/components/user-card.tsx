"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import styles from '../styles/user-card.module.scss';

type ProfileCardProps = {
  username: string;
  icon: string;
  tags: string[];
  detail: string;
  university: string;
};

export function UserCard({ username,tags, icon, detail, university
}: ProfileCardProps) {
  return (
    <Card className={styles.profileCard}>
      <div className={styles.cardContent}>
        <div className={styles.leftContent}>
          <div className={styles.avatarWrapper}>
            <Avatar className={styles.avatar}>
              <AvatarImage src={icon} />
              <AvatarFallback>{username}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.tagsContainer}>
            {tags.map(tag => (
              <Badge key={`tag-${tag}`} variant="secondary" className={styles.tag}>
                {tag}
              </Badge>
            ))}
          </div>
          <h2 className={styles.username}>{username}</h2>
          <div className={styles.details}>{detail}</div>
        </div>

        <div className={styles.rightContent}>
          <p className={styles.university}>{university}</p>
          もっと詳しく
          <span className={styles.arrow}>›</span>
        </div>
      </div>
    </Card>
  );
}