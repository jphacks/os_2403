import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Room } from '../types/types'; // types.ts からインポート

interface ChatRoomsProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

const ChatRooms: React.FC<ChatRoomsProps> = ({ rooms, onSelectRoom }) => {
  return (
    <div className="h-[750px] w-[30%] rounded-md border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">メッセージ</h2>
      </div>
      <ScrollArea className="h-[600px]">
        <div className="p-4 space-y-4">
          {rooms.map((room) => (
            <button
              key={room.uuid}
              type="button"
              className="flex items-center w-full py-3 px-4 rounded-md hover:bg-gray-100 cursor-pointer text-left"
              onClick={() => onSelectRoom(room)}
            >
              <Avatar className="w-12 h-12 flex-shrink-0">
                <AvatarImage src={room.img} />
                <AvatarFallback>{room.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 flex-1">
                <div>{room.name}</div>
              </div>
            </button>
          ))}
        </div>
        <ScrollBar className="h-4 w-full bg-black rounded-full" />
      </ScrollArea>
    </div>
  );
};

export default ChatRooms;