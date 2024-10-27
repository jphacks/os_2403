'use client'

import React from "react";
import { EventCard } from "@/feature/event";
import InviteCheck from "../../../public/invite-check";
import styles from "./style.module.scss";
import TagButton from "@/components/tags/tag-button";
import LikeSearch from "../../../public/like-search";
import { Popup } from "@/feature/popup";

const EventPage = () => {
    return (
        <>
            <Popup cards={[
                {
                    title: "タイトル",
                    publisher: "発行者",
                    publisherIcon: "",
                    datetime: "",
                    tags: [
                    ],
                    imageUrl: ""
                }
            ]}
            />
            <div className={styles.inviteCheck}>
                <InviteCheck size={500} />
            </div>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <LikeSearch size={100} />
                </div>

                <div className={styles.tagWrapper}>
                    <div className={styles.tagsContainer}>
                        {/* ここにtag */}
                    </div>
                </div>
            </div>

            <div className={styles.cardWrapper}>
                {/* ここにcard */}
            </div>
        </>
    );
}
export default EventPage;