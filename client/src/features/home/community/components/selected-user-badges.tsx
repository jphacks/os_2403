// components/SelectedUserBadges.tsx

import { Badge } from "@/components/ui/badge";
import { User } from "@/features/account/types/user";
import styles from "./style.module.scss";

type SelectedUserBadgesProps = {
  selectedUser: User[];
};

export function SelectedUserBadges({ selectedUser }: SelectedUserBadgesProps) {
  return (
    <div className="w-full h-full pointer-events-none">
      <div className="p-2 mt-2">
        {selectedUser.map(user => (
          <span key={user.uuid} className={`${styles.userName} ${styles.fadeIn}`}>
            <Badge className="bg-white text-black border-blue-500">{user.name}</Badge>
          </span>
        ))}
      </div>
    </div>
  );
}