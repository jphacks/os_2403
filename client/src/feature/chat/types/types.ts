// types.ts

export interface Room {
  uuid: string;
  id: number;
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
  messagefrom: string;
  user_id: string;
}
