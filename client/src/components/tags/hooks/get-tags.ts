import { TagType } from "@/domain/tag";
import { apiClient } from "@/utils/client"; // axios clientをインポート

export const getTags = async (): Promise<TagType[]> => {
  try {
    const response = await apiClient.get<TagType[]>("/tag");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error;
  }
};
