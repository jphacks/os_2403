import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Room } from "../types/types";
import "./ChatRooms.scss";

interface ChatRoomsProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

const ChatRooms: React.FC<ChatRoomsProps> = ({ rooms, onSelectRoom }) => {
  return (
    <div className="chat-rooms-container">
      <div className="chat-rooms-header">
        <h2 className="chat-rooms-title">メッセージ</h2>
      </div>
      <ScrollArea className="chat-rooms-scroll-area">
        <div className="chat-rooms-list">
          {rooms.map(room => (
            <button
              key={room.uuid}
              type="button"
              className="chat-room-item"
              onClick={() => onSelectRoom(room)}
            >
              <Avatar className="chat-room-avatar">
                <AvatarImage src={room.img} />
                <AvatarFallback>{room.name[0]}</AvatarFallback>
              </Avatar>
              <div className="chat-room-info">
                <div className="chat-room-name">{room.name}</div>
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
