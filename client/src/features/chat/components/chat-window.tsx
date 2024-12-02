import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React, { useState, useEffect, useRef } from "react";
import { Message, Room, SendMessage } from "../types/types";
import "./ChatWindow.scss";

const myUserID = "uuiduuiduuid";

interface ChatWindowProps {
  room: Room | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ room }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!room) {
      return;
    }

    ws.current = new WebSocket(`wss://hubme.xyz/ws/chat/${room.id}`);

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = event => {
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
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
    };

    ws.current.onerror = error => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.current?.close();
    };
  }, [room]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      newMessage.trim() === "" ||
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

    ws.current.send(JSON.stringify(message));

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

    setMessages(prevMessages => [...prevMessages, newMessageObject]);
    setNewMessage("");
  };

  if (!room) {
    return (
      <div className="chat-window-empty">
        <p>チャットするユーザーを選択してください</p>
      </div>
    );
  }

  return (
    <div className="chat-window-container">
      <div className="chat-window-header">
        <h2 className="chat-window-title">{room.name}</h2>
      </div>
      <ScrollArea className="chat-window-scroll-area">
        <div className="chat-window-messages">
          {messages.map(message => (
            <div
              key={message.id}
              className={`chat-message ${
                message.UserID === myUserID ? "my-message" : "other-message"
              }`}
            >
              <div className="chat-message-content">
                <div className="chat-message-bubble">
                  <p>{message.Message}</p>
                </div>
                <span className="chat-message-timestamp">
                  {new Date(message.CreatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar className="chat-window-scroll-bar" />
      </ScrollArea>
      <div className="chat-window-input-container">
        <form onSubmit={handleSendMessage} className="chat-window-form">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            className="chat-window-input"
            placeholder="メッセージを入力..."
          />
          <button type="submit" className="chat-window-send-button">
            送信
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
