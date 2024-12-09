import { ScoutCardProps, ScoutDetailProps, UpdateScoutStatusRequest } from "@/features/scout/types";
import { apiClient } from "@/utils/client";

export const GetScoutList = async () => {
  const res = await apiClient.get("/scoutlist");

  const data: ScoutCardProps = res.data;

  return data;
};

export const GetScoutDeital = async () => {
  const res = await apiClient.get("/scoutlist/getcommunitydetail");

  const data: ScoutDetailProps = res.data;

  return data;
};

export const UpdateScoutStatus = async (req: UpdateScoutStatusRequest) => {
  const res = await apiClient.put("/scoutlist/updatestatus", req);

  return res.data;
};
