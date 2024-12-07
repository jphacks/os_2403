"use client";

import { ProfileDetailCard } from "@/features/profile/components/Profile";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import style from "./style.module.scss";

const ProfileDetailPage = () => {
  return (
    <>
      <p className={style.profile_overview}>ユーザー詳細</p>
      <div className={style.profile_detail_card}>
        <ProfileDetailCard />
      </div>
      <Link href={"/"} className={style.link_home}>
        <ChevronRight size={36} strokeWidth={3} />
        ホームに戻る
      </Link>
    </>
  );
};

export default ProfileDetailPage;
