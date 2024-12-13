import { Community } from "@/features/account/types/community";
import { User } from "@/features/account/types/user";
import { apiClient } from "@/utils/client";

export const getUserByUUID = async (uuid: string) => {
  const response = await apiClient.get(`/user/${uuid}`);
  const userData: User = response.data;
  return userData;
};

export const getCommunityByUUID = async (uuid: string) => {
  const response = await apiClient.get(`/community/${uuid}`);
  const communityData: Community = response.data;
  return communityData;
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>("/users");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error;
  }
};
