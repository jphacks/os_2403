import { apiClient } from "@/utils/client";
import {
	EventSettingRequest,
	EventSettingSchema,
} from "@/feature/event/components/event";

export const createEvent = async (data: EventSettingRequest) => {
	const response = await apiClient.post("/createevent", data);
	return response.data;
};
