import { apiClient } from "@/utils/client";

export const getTags = async (): Promise<TagType[]> => {
  try {
    const response = await apiClient.get<TagType[]>("/tag");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw error;
  }
};
