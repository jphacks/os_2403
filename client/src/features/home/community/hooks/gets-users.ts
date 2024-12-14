import { User } from "@/features/account/types/user";
import { apiClient } from "@/utils/client";

export const GetUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>("/users");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error;
  }
};
