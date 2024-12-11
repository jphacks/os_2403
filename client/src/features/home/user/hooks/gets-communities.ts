import { Community } from "@/features/account/types/community";
import { apiClient } from "@/utils/client";

export const GetCommunities = async (): Promise<Community[]> => {
  try {
    const response = await apiClient.get<Community[]>("/communities");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch communities:", error);
    throw error;
  }
};
