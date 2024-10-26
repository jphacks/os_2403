'use client'

import React from "react";
import { EventCard } from "@/features/event";
import InviteCheck from "../../../public/invite-check";
import styles from "./style.module.scss";
import TagButton from "@/components/tags/tag-button";
import LikeSearch from "../../../public/like-search";

const EventPage = () => {
    return (
        <>
            <div className={styles.inviteCheck}>
                <InviteCheck size={500} />
            </div>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <LikeSearch size={100} />
                </div>

                <div className={styles.tagWrapper}>
                    <div className={styles.tagsContainer}>
                        <TagButton variant="red">Tag</TagButton>
                        <TagButton variant="green">aaaaaaaaaa</TagButton>
                        <TagButton variant="blue">Tag</TagButton>
                        <TagButton variant="red">Tag</TagButton>
                        <TagButton variant="green">Tag</TagButton>
                        <TagButton variant="blue">Tag</TagButton>
                        <TagButton variant="green">aaaaaaaaaa</TagButton>    <TagButton variant="green">aaaaaaaaaa</TagButton>    <TagButton variant="green">aaaaaaaaaa</TagButton>    <TagButton variant="green">aaaaaaaaaa</TagButton>    <TagButton variant="green">aaaaaaaaaa</TagButton>    <TagButton variant="green">aaaaaaaaaa</TagButton>    <TagButton variant="green">aaaaaaaaaa</TagButton>    <TagButton variant="green">aaaaaaaaaa</TagButton>    <TagButton variant="green">aaaaaaaaaa</TagButton>
                    </div>
                </div>
            </div>

            <div className={styles.cardWrapper}>
                <EventCard
                    title="Event Title Text"
                    publisher="Event Publisher"
                    datetime="YYYY MM/DD TT:TT〜"
                    tags={[
                        { id: "tag1", label: "たぐだあああ", variant: "red" },
                        { id: "tag2", label: "タグ", variant: "blue" },
                        { id: "tag3", label: "タグg", variant: "green" },
                    ]}
                />

                <EventCard
                    title="Event Title Text"
                    publisher="Event Publisher"
                    datetime="YYYY MM/DD TT:TT〜"
                    tags={[
                        { id: "tag1", label: "たぐだあああ", variant: "red" },
                        { id: "tag2", label: "タグ", variant: "blue" },
                        { id: "tag3", label: "タグg", variant: "green" },
                    ]}
                    imageUrl="/path/to/image.jpg"
                />
                <EventCard
                    title="Event Title Text"
                    publisher="Event Publisher"
                    datetime="YYYY MM/DD TT:TT〜"
                    tags={[
                        { id: "tag1", label: "たぐだあああ", variant: "red" },
                        { id: "tag2", label: "タグ", variant: "blue" },
                        { id: "tag3", label: "タグg", variant: "green" },
                        { id: "tag1", label: "たぐだあああ", variant: "red" },
                        { id: "tag1", label: "たぐだあああ", variant: "red" },
                    ]}
                    imageUrl="/path/to/image.jpg"
                />
                <EventCard
                    title="Event Title Text"
                    publisher="Event Publisher"
                    datetime="YYYY MM/DD TT:TT〜"
                    tags={[
                        { id: "tag1", label: "たぐだあああ", variant: "red" },
                        { id: "tag2", label: "タグ", variant: "blue" },
                        { id: "tag3", label: "タグg", variant: "green" },
                    ]}
                    imageUrl="/path/to/image.jpg"
                />
                <EventCard
                    title="Event Title Text"
                    publisher="Event Publisher"
                    datetime="YYYY MM/DD TT:TT〜"
                    tags={[
                        { id: "tag1", label: "たぐだあああ", variant: "red" },
                        { id: "tag2", label: "タグ", variant: "blue" },
                        { id: "tag3", label: "タグg", variant: "green" },
                    ]}
                    imageUrl="/path/to/image.jpg"
                />
                <EventCard
                    title="Event Title Text"
                    publisher="Event Publisher"
                    datetime="YYYY MM/DD TT:TT〜"
                    tags={[
                        { id: "tag1", label: "たぐだあああ", variant: "red" },
                        { id: "tag2", label: "タグ", variant: "blue" },
                        { id: "tag3", label: "タグg", variant: "green" },
                    ]}
                    imageUrl="/path/to/image.jpg"
                />
                <EventCard
                    title="Event Title Text"
                    publisher="Event Publisher"
                    datetime="YYYY MM/DD TT:TT〜"
                    tags={[
                        { id: "tag1", label: "たぐだあああ", variant: "red" },
                        { id: "tag2", label: "タグ", variant: "blue" },
                        { id: "tag3", label: "タグg", variant: "green" },
                    ]}
                    imageUrl="/path/to/image.jpg"
                />
                <EventCard
                    title="Event Title Text"
                    publisher="Event Publisher"
                    datetime="YYYY MM/DD TT:TT〜"
                    tags={[
                        { id: "tag1", label: "たぐだあああ", variant: "red" },
                        { id: "tag2", label: "タグ", variant: "blue" },
                        { id: "tag3", label: "タグg", variant: "green" },
                    ]}
                    imageUrl="/path/to/image.jpg"
                />

            </div>
        </>
    );
}
export default EventPage;