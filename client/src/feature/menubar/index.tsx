import React from "react";
import style from "./index.module.scss";
import { Circle, Bookmark } from 'lucide-react';
import { MailIcon } from "./components/mail";
import Invite from "@/../public/invite";
import  Search  from "./components/search";

export const Menubar = () => {
    return (
        <div className={style.header}>
            <div className={style.icons}>
                <a href="/home" className={style.icon}>
                    <Circle size={40} color="#434141" />
                </a>
                <a href="/school" className={style.icon}>
                    <Invite size={40} />
                    <span className={style.badge}>89</span>
                </a>
                <a href="/chat" className={style.icon}>
                    <MailIcon count={3} size={40}/>
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
                <Search />
            </div>
        </div>
    );
};