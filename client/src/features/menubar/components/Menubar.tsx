"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Invite from "../../../../public/invite";
import Logo from "../../../../public/logo";

import { useSetBaseAccountType } from "@/features/account/hooks";
import { accountTypeAtom, communityAtom, userAtom } from "@/features/account/stores";
import { useAuth } from "@/features/menubar/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAtom } from "jotai/index";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import style from "../styles/menubar.module.scss";
import { MailIcon } from "./Mail";
// import Search from "./search";

const inviteNum = 3;
const mailNum = 80;

export const Menubar = () => {
  const [currentAccountType, setCurrentAccountType] = useAtom(accountTypeAtom);
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const [currentCommunity, setCurrentCommunity] = useAtom(communityAtom);
  const baseAccountURI = useSetBaseAccountType(currentAccountType);
  const profileURI = `${baseAccountURI}/profile`;
  const settingURI = `${profileURI}/setting`;
  const homeURI = `${baseAccountURI}/home`;
  let accountName = "";
  let accountIcon = "https://github.com/shadcn.png";

  const { checkSession, signout } = useAuth();
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (currentAccountType === "user") {
    if (currentUser?.img) {
      accountIcon = currentUser?.img;
    }
    accountName = currentUser?.name || "";
  } else {
    if (currentCommunity?.img) {
      accountIcon = currentCommunity?.img;
    }
    accountName = currentCommunity?.name || "";
  }

  const onClickSignout = () => {
    signout();
    setCurrentUser(undefined);
    setCurrentCommunity(undefined);
    setCurrentAccountType("not");
    toast("サインアウトしました");
  };

  if (currentAccountType === "not") return null;
  return (
    <div className={style.header}>
      <div className={style.icons}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className={style.avatar}>
              <AvatarImage src={accountIcon} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{accountName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={profileURI}>
                <User />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={settingURI}>
                <Settings />
                <span>setting</span>
              </Link>
            </DropdownMenuItem>
            {/*{currentAccountType === "community" && (*/}
            {/*  <DropdownMenuItem asChild>*/}
            {/*    <Link href="/event/setting">*/}
            {/*      <Calendar />*/}
            {/*      イベント設定*/}
            {/*    </Link>*/}
            {/*  </DropdownMenuItem>*/}
            {/*)}*/}
            <DropdownMenuItem onClick={onClickSignout}>
              <LogOut />
              <span>signout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/user/scout" className={style.icon}>
          <Invite size={60} />
          <span className={style.badge}>{inviteNum}</span>
        </Link>
        <Link href="/user/chat" className={style.icon}>
          <MailIcon count={mailNum} size={40} />
        </Link>
      </div>
      <div className={style.logo}>
        <Link href={homeURI}>
          <Logo size={50} />
        </Link>
      </div>
      {/* {currentAccountType === "user" ? (
        <div className={style.search}>
          <Search data={mockData} />
        </div>
      ) : (
        <></>
      )} */}
    </div>
  );
};
