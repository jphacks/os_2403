import React from "react";
import style from "./index.module.scss";
import { Circle, Bookmark } from 'lucide-react';
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

export const Menubar = () => {

    return (
        <div className={style.header}>
            <div className={style.icons}>
                <a href="/home" className={style.icon}>
                    <Circle size={40} color="#434141" />
                </a>
                <a href="/school" className={style.icon}>
                    <Invite size={40} />
                    <span className={style.badge}>{inviteNum}</span>
                </a>
                <a href="/chat" className={style.icon}>
                    <MailIcon count={mailNum} size={40} />
                </a>
                <a href="/address" className={style.icon}>
                    <Bookmark size={40} color="#434141" />
                </a>
            </div>
            <div className={style.logo}>
                <a href="/home">
                    ロゴ＋タイトル
                </a>
            </div>
            <div className={style.search}>
                <Search data={mockData}/>
            </div>
        </div>
    );
};