import { Community } from "@/features/account/types/community";
import { User } from "@/features/account/types/user";
import { apiClient } from "@/utils/client";

export const GetUserByUUID = async (uuid: string) => {
  const response = await apiClient.get(`/user/${uuid}`);
  const userData: User = response.data;
  return userData;
};

export const GetCommunityByUUID = async (uuid: string) => {
  const response = await apiClient.get(`/community/${uuid}`);
  const communityData: Community = response.data;
  return communityData;
};
