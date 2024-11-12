"use client";

import ChatRooms from "@/feature/chat/components/chat-rooms";
import ChatWindow from "@/feature/chat/components/chat-window";
import { Room } from "@/feature/chat/types/types";
import React, { useState } from "react";
import "./Page.scss";

const ChatPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const rooms: Room[] = [
    {
      uuid: "uuiduuid1",
      id: 1,
      name: "Alice",
      img: "https://example.com/avatar1.png",
    },
    {
      uuid: "uuiduuid2",
      id: 2,
      name: "Bob",
      img: "https://example.com/avatar2.png",
    },
    // 他のユーザーを追加
  ];

  return (
    <div className="chat-page-container">
      <ChatRooms rooms={rooms} onSelectRoom={room => setSelectedRoom(room)} />
      <ChatWindow room={selectedRoom} />
    </div>
  );
};

export default ChatPage;
