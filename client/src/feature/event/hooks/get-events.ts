import { EventType } from "@/domain/event"; // 先ほど定義した型をインポート
import { apiClient } from "@/utils/client"; // axios clientをインポート

export const getEvents = async (): Promise<EventType[]> => {
  try {
    const response = await apiClient.get<EventType[]>("/getevent");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error;
  }
};