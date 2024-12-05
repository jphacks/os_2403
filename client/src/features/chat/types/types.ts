// types.ts

export interface Room {
  id: number;
  status: number;
  unreadCount: number;
  uuid: string;
  detail_info: DetailInfo;
}

export interface DetailInfo{
  name: string;
  img: string;
}
export interface Message {
  id: number;
  Message: string;
  UserID: string;
  RoomID: number;
  Looked: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

export interface SendMessage {
  content: string;
  user_id: string;
}