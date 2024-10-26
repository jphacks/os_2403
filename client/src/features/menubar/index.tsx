import React from "react";
import style from "./index.module.scss";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MailIcon } from "./components/mail";
import Invite from "@/../public/invite";
import Search from "./components/search";

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
const userIcon = "https://github.com/shadcn.png";

export const Menubar = () => {
    return (
        <div className={style.header}>
            <div className={style.icons}>
                <a href="/home" className={style.icon}>
                    <Avatar className={style.avatar}>
                        <AvatarImage src={userIcon} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </a>
                <a href="/school" className={style.icon}>
                    <Invite size={60} />
                    <span className={style.badge}>{inviteNum}</span>
                </a>
                <a href="/chat" className={style.icon}>
                    <MailIcon count={mailNum} size={40} />
                </a>
            </div>
            <div className={style.logo}>
                <a href="/event">
                    ロゴ＋タイトル
                </a>
            </div>
            <div className={style.search}>
                <Search data={mockData} />
            </div>
        </div>
    );
};