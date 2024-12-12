import { Badge } from "@/components/ui/badge";
import { User } from "@/features/account/types/user";
import styles from "./style.module.scss";

type SelectedUserBadgesProps = {
  selectedUser: User[];
  onBadgeClick: (uuid: string) => void;
};

export function SelectedUserBadges({ selectedUser, onBadgeClick }: SelectedUserBadgesProps) {
  return (
    <div className="w-full h-full pointer-events-none">
      <div className="p-2 mt-2">
      {selectedUser.map(user => (
          <span key={user.uuid} className={`${styles.userName} ${styles.fadeIn}`}>
            <Badge className={styles.userBadge} onClick={() => onBadgeClick(user.uuid)}>
              {user.name}
              <span className={styles.closeIcon}>x</span>
            </Badge>
          </span>
        ))}
      </div>
    </div>
  );
}