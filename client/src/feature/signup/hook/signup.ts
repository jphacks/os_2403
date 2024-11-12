import { LoginForm, SignupForm, User } from "@/domain/user";
import { apiClient } from "@/utils/client";

export const createUser = async (data: SignupForm) => {
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
  const response = await apiClient.post("/user/signup", data);
  return response.data;
};
