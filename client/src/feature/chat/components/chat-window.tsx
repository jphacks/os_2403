import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Room, Message, SendMessage } from '../types/types'; // types.ts からインポート

const myUserID = '867aec0c-d47c-4b42-bfa9-fc0b40cd2ce2';

interface ChatWindowProps {
  room: Room | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ room }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!room) {
      return;
    }

    ws.current = new WebSocket(`ws://localhost:8080/ws/chat/${room.id}`);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const receivedMessage: Message = {
        id: data.id,
        Message: data.Message,
        UserID: data.UserID,
        RoomID: data.RoomID,
        Looked: data.Looked,
        CreatedAt: data.CreatedAt,
        UpdatedAt: data.UpdatedAt,
        DeletedAt: data.DeletedAt,
      };
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // クリーンアップ関数
    return () => {
      ws.current?.close();
    };
  }, [room]);

  // メッセージ送信時の処理
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      newMessage.trim() === '' ||
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN ||
      !room
    ) {
      return;
    }

    const message: SendMessage = {
      content: newMessage,
      messagefrom: myUserID,
      user_id: room.uuid,
    };

    // WebSocket 経由でメッセージを送信
    ws.current.send(JSON.stringify(message));

    // 自分のメッセージをすぐに表示（オプション）
    const newMessageObject: Message = {
      id: Date.now(),
      Message: newMessage,
      UserID: myUserID,
      RoomID: room.id,
      Looked: 0,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      DeletedAt: null,
    };

    setMessages((prevMessages) => [...prevMessages, newMessageObject]);

    // メッセージ入力欄をクリア
    setNewMessage('');
  };

  if (!room) {
    return (
      <div className="h-[750px] w-[70%] flex flex-col items-center justify-center">
        <p>チャットするユーザーを選択してください</p>
      </div>
    );
  }

  return (
    <div className="h-[750px] w-[70%] rounded-md border border-gray-200 flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">{room.name}</h2>
      </div>
      {/* スクロールエリア */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.UserID === myUserID ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="block">
                {/* メッセージバブル */}
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.UserID === myUserID
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <p>{message.Message}</p>
                </div>
                {/* タイムスタンプ */}
                <span className="text-xs text-gray-600">
                  {new Date(message.CreatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar className="h-4 w-full bg-black rounded-full" />
      </ScrollArea>
      {/* メッセージ入力欄 */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
            placeholder="メッセージを入力..."
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;