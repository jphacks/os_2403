"use client";

import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/features/account/types/user";
import { UserCard } from "@/features/home/community/components/user-card";
import { GetUsers } from "@/features/home/community/hooks/gets-users";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { useAtom } from "jotai";
import { communityAtom } from "@/features/account/stores";
import { apiClient } from "@/utils/client";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User[]>([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [community] = useAtom(communityAtom);

  useEffect(() => {
    GetUsers().then(users => {
      setUsers(users);
    });
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCardClick = (user: User) => {
    if (!selectedUser.includes(user)) {
      setSelectedUser([...selectedUser, user]);
    } else {
      setSelectedUser(selectedUser.filter(selected => selected !== user));
    }
  };

  const uuidSchema = z.object({
    user_uuid: z.string(),
  });

  const scoutPostSchema = z.object({
    content: z.string(),
    community_uuid: z.string(),
    uuids: uuidSchema.array(),
  });

  type ScoutPostType = z.infer<typeof scoutPostSchema>;

  const handleSubmit = () => {
    //selectedUserのuuidを配列に格納
    const uuids = selectedUser.map(user => ({ user_uuid: user.uuid }));
    //ScoutPostTypeの型に合わせてデータを格納
    const postData: ScoutPostType = {
      content: textAreaValue,
      community_uuid: community.uuid,
      uuids: uuids,
    };
    apiClient.post("/scoutlist/createscout", postData);
    console.log(postData);
    setTextAreaValue("");
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mt-4 ml-10">ホーム</h1>
      <div className="container mx-auto p-4">
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md relative">
            <Input
              type="text"
              placeholder="ユーザー名で検索..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search size={20} />
            </div>
          </div>
        </div>

        <ScrollArea className="h-96 w-full rounded-md border">
          <div className="grid grid-cols-2 gap-2 p-4">
            {filteredUsers.map(user => {
              return (
                <UserCard
                  key={user.name}
                  uuid={user.uuid}
                  username={user.name}
                  icon={user.img}
                  tags={user.tags}
                  detail={user.self}
                  university={user.mem1}
                  onClick={() => {
                    handleCardClick(user);
                  }}
                />
              );
            })}
          </div>
        </ScrollArea>
        <div className="mt-4">
          <div className="w-full h-full pointer-events-none">
            <div className="p-2">
              {selectedUser.map(user => (
                <span key={user.uuid} className={`${styles.userName} ${styles.fadeIn}`}>
                  <Badge className="bg-white text-black border-blue-500">{user.name}</Badge>
                </span>
              ))}
            </div>
          </div>
          <textarea
            className="w-full h-60 p-2 border rounded-md"
            value={textAreaValue}
            onChange={e => setTextAreaValue(e.target.value)}
            placeholder="スカウトメッセージを入力してください..."
          />
          <div className="flex justify-end mt-2">
            <Button onClick={handleSubmit}>招待を送る</Button>
          </div>
        </div>
      </div>
    </>
  );
}