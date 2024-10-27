'use client'

import styles from './card.module.scss';

interface InviteCardProps {
  title: string;
  subtitle: string;
  timestamp: string;
  content: string;
  tags: string[];
  onReject?: () => void;
}

export const InviteCard = ({
  title,
  subtitle,
  timestamp,
  content,
}: InviteCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.metadata}>
          <span className={styles.timestamp}>{timestamp}</span>
        </div>

        <div className={styles.description}>
          {content}
        </div>
      </div>
      </div>
  );
};
