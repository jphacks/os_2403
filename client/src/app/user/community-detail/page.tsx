"use client";
import { ProfileDetailCard } from "@/features/profile/components/Profile";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import style from "./style.module.scss";

const ProfileDetailPage = () => {
  return (
    <>
      <p className={style.profile_overview}>ユーザー詳細</p>
      <div className={style.profile_detail_card}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProfileDetailContent />
        </Suspense>
      </div>
      <Link href={"/user/home"} className={style.link_home}>
        <ChevronRight size={36} strokeWidth={3} />
        ホームに戻る
      </Link>
    </>
  );
};

const ProfileDetailContent = () => {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");

  return <ProfileDetailCard uuid={uuid || ""} />;
};

export default ProfileDetailPage;