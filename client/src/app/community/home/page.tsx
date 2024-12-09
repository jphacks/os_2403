import { UserCard } from "@/features/community-home/components/user-card";
import { Menubar } from "@/features/menubar";


export default function Home() {
  const mockData = {
    username: "ユーザ名",
    icon: "/default-icon.png",
    tags: ["プログラミング", "デザイン", "Web開発", "UI/UX"],
    detail: "コンピュータサイエンス専攻",
    university: "立命館大学",
  };

  return (
    <>
      <Menubar />
      {/*<AuthProvider>*/}
      <UserCard
        username={mockData.username}
        icon={mockData.icon}
        tags={mockData.tags}
        detail={mockData.detail}
        university={mockData.university}
      />
      {/*</AuthProvider>*/}
    </>
  );
}
