import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React, { useState, useEffect, useRef } from "react";
import { Message, Room, SendMessage } from "../types/types";
import "./ChatWindow.scss";
import { userAtom } from "@/features/account/stores";
import { communityAtom } from "@/features/account/stores";
import { accountTypeAtom } from "@/features/account/stores"; // axiosをインポート
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai/index";

interface ChatWindowProps {
  room: Room | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ room }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [current, setCurrent] = useState<string>("");
  const [accountType] = useAtom(accountTypeAtom);
  const [currentUser] = useAtom(userAtom);
  const [currentCommunity] = useAtom(communityAtom);
  const ws = useRef<WebSocket | null>(null);

  // メッセージ履歴を取得する関数
  const fetchMessageHistory = async (roomId: number) => {
    try {
      const response = await apiClient.get(`messages/${roomId}`);
      // 日付の降順でソートされているため、そのまま設定
      setMessages(response.data);
    } catch (error) {
      console.error("メッセージ履歴の取得に失敗:", error);
    }
  };

  useEffect(() => {
    if (!room) {
      return;
    }

    let account;
    if (accountType === "community") {
      account = currentCommunity?.uuid || "gg";
    } else if (accountType === "user") {
      account = currentUser?.uuid || "gg";
    }
    setCurrent(account || "");

    // メッセージ履歴を取得
    fetchMessageHistory(room.id);

    ws.current = new WebSocket(`ws://localhost:8080/api/ws/chat/` + room.id);

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

      // 重複チェックを追加
      setMessages(prevMessages => {
        // 既に同じIDのメッセージが存在しないか確認
        const messageExists = prevMessages.some(msg => msg.id === receivedMessage.id);

        // 重複していない場合のみ追加
        return messageExists ? prevMessages : [receivedMessage, ...prevMessages];
      });
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
      user_id: current,
    };

    ws.current.send(JSON.stringify(message));
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
        <h2 className="chat-window-title">{room.detail_info.name}</h2>
      </div>
      <ScrollArea className="chat-window-scroll-area">
        <div className="chat-window-messages">
          {messages
            .sort((a, b) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime())
            .map(message => (
              <div
                key={message.id}
                className={`${message.UserID === current ? "my-message" : "other-message"}`}
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
