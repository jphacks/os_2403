"use client";

import { ProfileCard } from "@/features/profile/components/Profile";
import style from "./style.module.scss";

const CommunityHome = () => {
  return (
    <div className={style.profile_card}>
      <h1>団体概要</h1>
      <ProfileCard />
    </div>
  );
};

export default CommunityHome;
