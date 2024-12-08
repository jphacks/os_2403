import { Menubar } from "@/features/menubar";
import { ProfileSetting } from "@/features/profile/components/ProfileSetting";

const ProfileSettingPage = () => {
  return (
    <>
      <Menubar />
      <ProfileSetting type="user" />
    </>
  );
};

export default ProfileSettingPage;
