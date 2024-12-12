import { updateScoutStatus } from "@/features/scout/api";
import { ScoutStatus, UpdateScoutStatusRequest } from "@/features/scout/types";

export const updateScoutStatusForReaded = async (id: number) => {
  const req: UpdateScoutStatusRequest = {
    id: id,
    status: ScoutStatus.Read,
  };
  await updateScoutStatus(req);
};

export const updateScoutStatusForReject = async (id: number) => {
  const req: UpdateScoutStatusRequest = {
    id: id,
    status: ScoutStatus.Reject,
  };
  await updateScoutStatus(req);
};

export const updateScoutStatusForApprove = async (id: number) => {
  const req: UpdateScoutStatusRequest = {
    id: id,
    status: ScoutStatus.Approve,
  };
  await updateScoutStatus(req);
};
