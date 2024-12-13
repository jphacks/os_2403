import { apiClient } from "@/utils/client";
import { ScoutPostType } from "../types/scout";

export const postScout = async (postData: ScoutPostType): Promise<void> => {
  try {
    await apiClient.post("/scoutlist/createscout", postData);
  } catch (error) {
    console.error("Failed to post scout:", error);
    throw error;
  }
};
