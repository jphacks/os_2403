import { GetCommunityDetailResponse, UpdateScoutStatusRequest } from "@/features/scout/types";
import { apiClient } from "@/utils/client";

export const getScoutCommunityDetail = async (uuid: string) => {
  if (!uuid) {
    return undefined;
  }
  const res = await apiClient.get("/scoutlist/getcommunitydetail", {
    params: {
      user_uuid: uuid,
    },
  });

  const data: GetCommunityDetailResponse[] = res.data;

  return data;
};

export const updateScoutStatus = async (req: UpdateScoutStatusRequest) => {
  await apiClient.put("/scoutlist/updatestatus", req);

  return;
};
