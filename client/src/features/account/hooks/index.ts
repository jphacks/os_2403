import { AccountType } from "@/features/account/types/type";

const pathMap: Record<AccountType, string> = {
  user: "/user",
  community: "/community",
  not: "",
};

export const useSetBaseAccountType = (accountType: AccountType) => {
  return pathMap[accountType];
};
