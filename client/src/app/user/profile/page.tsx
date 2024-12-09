import { ProfileCard } from "@/features/profile/components/Profile";
import style from "./style.module.scss";

const ProfilePage = () => {
  return (
    <>
      <div className={style.all}>
        <p className={style.profile}>プロフィール</p>
        <ProfileCard />
      </div>
    </>
  );
};

export default ProfilePage;
