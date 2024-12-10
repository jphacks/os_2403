"use client";

import { accountTypeAtom } from "@/features/account/stores";
import { useAtom } from "jotai/index";
import React from "react";
import style from "./style.module.scss";

export const BackGroundColor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAccountType] = useAtom(accountTypeAtom);
  return (
    <div className={currentAccountType === "user" ? style.user_theme : style.community_theme}>
      {children}
    </div>
  );
};
