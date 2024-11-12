"use client";
import Invite from "@/../public/invite";
import Logo from "@/../public/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { communityAtom } from "@/domain/community";
import { accountTypeAtom } from "@/domain/general";
import { userAtom } from "@/domain/user";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAtom } from "jotai/index";
import { Calendar, CreditCard, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MailIcon } from "./components/mail";
import Search from "./components/search";
import style from "./index.module.scss";

const mockData = [
  { label: "東京大学" },
  { label: "京都大学" },
  { label: "大阪大学" },
  { label: "東北大学" },
  { label: "名古屋大学" },
  { label: "九州大学" },
  { label: "北海道大学" },
  { label: "筑波大学" },
  { label: "早稲田大学" },
  { label: "慶應義塾大学" },
];

const inviteNum = 3;
const mailNum = 80;

export const Menubar = () => {
  let accountName = "";
  let accountIcon = "https://github.com/shadcn.png";
  let settingURI = "";
  const [currentAccountType, setCurrentAccountType] = useAtom(accountTypeAtom);
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const [currentCommunity, setCurrentCommunity] = useAtom(communityAtom);

  if (currentAccountType === "user") {
    if (currentUser?.img) {
      accountIcon = currentUser?.img;
    }
    accountName = currentUser?.name;
    settingURI = "/profile/setting/user";
  } else {
    if (currentCommunity?.img) {
      accountIcon = currentCommunity?.img;
    }
    accountName = currentCommunity?.name;
    settingURI = "/profile/setting/community";
  }

  const onClickSignout = () => {
    setCurrentUser(undefined);
    setCurrentCommunity(undefined);
    setCurrentAccountType("not");
    toast("サインアウトしました");
  };

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
              <Link href="/profile">
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
            {currentAccountType === "community" && (
              <DropdownMenuItem asChild>
                <Link href="/event/setting">
                  <Calendar />
                  イベント設定
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/signin/user" onClick={onClickSignout}>
                <LogOut />
                <span>signout</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <a href="/invite" className={style.icon}>
          <Invite size={60} />
          <span className={style.badge}>{inviteNum}</span>
        </a>
        <a href="/chat" className={style.icon}>
          <MailIcon count={mailNum} size={40} />
        </a>
      </div>
      <div className={style.logo}>
        <a href="/event">
          <Logo size={50} />
        </a>
      </div>
      <div className={style.search}>
        <Search data={mockData} />
      </div>
    </div>
  );
};
