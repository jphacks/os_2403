import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useState } from "react";
import { Room } from "../types/types";
import "./ChatRooms.scss";
import { userAtom } from "@/features/account/stores";
import { accountTypeAtom } from "@/features/account/stores";
import { communityAtom } from "@/features/account/stores";
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai/index";

interface ChatRoomsProps {
  // rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

const ChatRooms: React.FC<ChatRoomsProps> = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [accountType, ] = useAtom(accountTypeAtom);
  const [currentUser] = useAtom(userAtom);
  const [currentCommunity] = useAtom(communityAtom);

  // chat相手一覧を取得する関数
  const fetchRooms = async () => {
    try {
      if (accountType === "user") {
        const user_uuid = currentUser?.uuid;
        const response = await apiClient.get("scoutlist/getdmlist/community", {
          params: { user_uuid },
        });
        setRooms(response.data);
      } else if (accountType === "community") {
        const community_uuid = currentCommunity?.uuid;
        const response = await apiClient.get("scoutlist/getdmlist/user", {
          params: { community_uuid },
        });
        setRooms(response.data);
      }
    } catch (error) {
      console.error("chat相手一覧の取得に失敗:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="chat-rooms-container">
      <div className="chat-rooms-header">
        <h2 className="chat-rooms-title">メッセージ</h2>
      </div>
      <ScrollArea className="chat-rooms-scroll-area">
        <div className="chat-rooms-list">
          {rooms.map(room => (
            <button
              key={room.id}
              type="button"
              className="chat-room-item"
              onClick={() => onSelectRoom(room)}
            >
              <Avatar className="chat-room-avatar">
                <AvatarImage
                  src={
                    room.detail_info?.img ||
                    "https://kotonohaworks.com/free-icons/wp-content/uploads/kkrn_icon_user_4.png"
                  }
                />
                <AvatarFallback>{room.detail_info?.name || "0"}</AvatarFallback>
              </Avatar>
              <div className="chat-room-info">
                <div className="chat-room-name">{room.detail_info?.name}</div>
              </div>
            </button>
          ))}
        </div>
        <ScrollBar className="chat-rooms-scroll-bar" />
      </ScrollArea>
    </div>
  );
};

export default ChatRooms;
