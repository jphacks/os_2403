'use client';

import React, { useState } from 'react';
import ChatRooms from '../../feature/chat/components/chat-rooms'; // パスを適宜調整してください
import ChatWindow from '../../feature/chat/components/chat-window'; // パスを適宜調整してください
import { Room } from '../../feature/chat/types/types'; // types.ts からインポート

const ChatPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const rooms: Room[] = [
    { uuid: 'uuiduuid1', id: 1, name: 'Alice', img: 'https://github.com/shadcn.png' },
    { uuid: 'uuiduuid2', id: 2, name: 'Bob', img: 'https://example.com/avatar2.png' },
    { uuid: 'uuiduuid3', id: 3, name: 'Charlie', img: 'https://example.com/avatar3.png' },
    { uuid: 'uuiduuid4', id: 4, name: 'David', img: 'https://example.com/avatar4.png' },
    { uuid: 'uuiduuid5', id: 5, name: 'Eve', img: 'https://example.com/avatar5.png' },
    { uuid: 'uuiduuid6', id: 6, name: 'Frank', img: 'https://example.com/avatar6.png' },
    { uuid: 'uuiduuid7', id: 7, name: 'Grace', img: 'https://example.com/avatar7.png' },
    { uuid: 'uuiduuid8', id: 8, name: 'Hank', img: 'https://example.com/avatar8.png' },
    { uuid: 'uuiduuid9', id: 9, name: 'Ivy', img: 'https://example.com/avatar9.png' },
    { uuid: 'uuiduuid10', id: 10, name: 'Jack', img: 'https://example.com/avatar10.png' },
    { uuid: 'uuiduuid11', id: 11, name: 'Karl', img: 'https://example.com/avatar11.png' },
    { uuid: 'uuiduuid12', id: 12, name: 'Liam', img: 'https://example.com/avatar12.png' },
    { uuid: 'uuiduuid13', id: 13, name: 'Mia', img: 'https://example.com/avatar13.png' },
    { uuid: 'uuiduuid14', id: 14, name: 'Noah', img: 'https://example.com/avatar14.png' },
    { uuid: 'uuiduuid15', id: 15, name: 'Olivia', img: 'https://example.com/avatar15.png' },
    { uuid: 'uuiduuid16', id: 16, name: 'Peter', img: 'https://example.com/avatar16.png' },
    { uuid: 'uuiduuid17', id: 17, name: 'Quinn', img: 'https://example.com/avatar17.png' },
    // 他のユーザーを追加
  ];

  return (
    <div className="flex h-full">
      <ChatRooms rooms={rooms} onSelectRoom={(room) => setSelectedRoom(room)} />
      <ChatWindow room={selectedRoom} />
    </div>
  );
};

export default ChatPage;