import { Card, CardHeader } from "@/components/ui/card";
import { ProfileCard } from "@/feature/profile/components/Profile";
import style from "./style.module.scss";

const ProfilePage = () => {
  return (
    <div className={style.all}>
      <ProfileCard />
    </div>
  );
};

export default ProfilePage;
