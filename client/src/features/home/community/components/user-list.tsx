// components/UserList.tsx

import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCard } from "@/features/home/community/components/user-card";
import { User } from "@/features/account/types/user";
import  style  from "./style.module.scss";

type UserListProps = {
  users: User[];
  handleCardClick: (user: User) => void;
  selectedUser: User[];
};

export function UserList({ users, handleCardClick, selectedUser }: UserListProps) {
  return (
    <ScrollArea className={style.userContainer}>
      <div className="grid grid-cols-2 gap-2 p-4">
        {users.map((user) => (
          <UserCard
            key={user.uuid}
            uuid={user.uuid}
            username={user.name}
            icon={user.img}
            tags={user.tags}
            detail={user.self}
            university={user.mem1}
            onClick={() => handleCardClick(user)}
            selected={selectedUser.includes(user)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}