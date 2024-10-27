'use client'

import React, { useState, useEffect } from 'react';
import { EventCard } from "@/feature/event";
import InviteCheck from "../../../public/invite-check";
import styles from "./style.module.scss";
import TagButton from "@/components/tags/tag-button";
import LikeSearch from "../../../public/like-search";
import { Popup } from "@/feature/popup";
import axios from 'axios';

interface Tag {
  id: string;
  name: string;
}

const mockTags: Tag[] = [
    { id: "1", name: "tag1" },
    { id: "2", name: "tag2" },
    { id: "3", name: "tag3" },
    { id: "4", name: "tag4" },
    { id: "5", name: "tag5" },
    ];


const EventPage = () => {

    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTags = async () => {
          setLoading(true);
          try {
            const response = await axios.get('http://haveme.xyz/tag');
            const data = response.data;
            if (data.tags) {
              setTags(data.tags);
            } else {
              setError('No tags data found');
            }
          } catch (err) {
            if (axios.isAxiosError(err)) {
              setError(`Failed to fetch tags: ${err.message}`);
            } else {
              setError('An unexpected error occurred');
            }
          } finally {
            setLoading(false);
          }
        };

        fetchTags();
      }, []);


    return (
        <>
            <Popup cards={[
                {
                    title: "タイトル",
                    publisher: "発行者",
                    publisherIcon: "https://github.com/shadcn.png",
                    datetime: "aaa",
                    tags: [
                    ],
                    imageUrl: "https://github.com/shadcn.png",
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
                        {mockTags.map((tag) => (
                            <TagButton key={tag.id} variant="red">
                                {tag.name}
                            </TagButton>
                        ))}
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