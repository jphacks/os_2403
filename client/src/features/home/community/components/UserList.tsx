import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/features/account/types/user";
import { UserCard } from "@/features/home/community/components/UserCard";
import style from "../styles/user-list.module.scss";

type UserListProps = {
  users: User[];
  handleCardClick: (user: User) => void;
  selectedUser: User[];
};

export function UserList({ users, handleCardClick, selectedUser }: UserListProps) {
  return (
    <ScrollArea className={style.userContainer}>
      {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">*/}
      <div className={style.cardContainer}>
        {users?.map(user => (
          <UserCard
            key={user.uuid}
            uuid={user.uuid}
            username={user.name}
            icon={user.img}
            tags={user.tags}
            tag_colors={user.tag_colors}
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
