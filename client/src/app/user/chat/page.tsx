"use client";

import { Menubar } from "@/features/menubar";
import ChatRooms from "@/features/chat/components/chat-rooms";
import ChatWindow from "@/features/chat/components/chat-window";
import { Room } from "@/features/chat/types/types";
import { useState } from "react";
import "./Page.scss";

const ChatPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <div className="chat-page-container">
      <Menubar />
      <ChatRooms onSelectRoom={room => setSelectedRoom(room)} />
      <ChatWindow room={selectedRoom} />
    </div>
  );
};

export default ChatPage;
