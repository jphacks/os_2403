import { Menubar } from "@/features/menubar";
import { ProfileCard } from "@/features/profile/components/Profile";
import style from "./style.module.scss";

const ProfilePage = () => {
  return (
    <>
      <Menubar />
      <div className={style.all}>
        <p className={style.profile}>団体概要</p>
        <ProfileCard />
      </div>
    </>
  );
};

export default ProfilePage;
