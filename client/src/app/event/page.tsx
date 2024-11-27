"use client";

import { getTags } from "@/components/tags/hooks/get-tags";
import TagButton from "@/components/tags/tag-button";
import { Skeleton } from "@/components/ui/skeleton";
import { EventType } from "@/domain/event";
import { TagType } from "@/domain/tag";
import { EventCard } from "@/feature/event";
import { getEvents } from "@/feature/event/hooks/get-events";
import { Popup } from "@/feature/popup";
import { AuthProvider } from "@/lib/provider";
import { set } from "date-fns";
import React, { useState, useEffect } from "react";
import InviteCheck from "../../../public/invite-check";
import LikeSearch from "../../../public/like-search";
import styles from "./style.module.scss";

const EventPage = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const fetchTags = async () => {
      try {
        const response = await getTags();
        setTags(response);
        console.log("Fetched tags:", response);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
        console.log("Fetched events:", fetchedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
    fetchEvents();
    return () => {
      mounted = false;
    };
  }, []);

  const handleEventClose = () => {
    console.log("Event closed");
  };

  return (
    <>
      <AuthProvider>
        <Popup
          cards={[
            {
              title: "タイトル",
              publisher: "発行者",
              publisherIcon: "https://github.com/shadcn.png",
              datetime: "aaa",
              tags: [],
              imageUrl: "https://github.com/shadcn.png",
            },
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
            {tags?.length > 0 ? (
              <div className={styles.tagsContainer}>
                {tags.map(tag => (
                  <TagButton key={tag.name} variant="red">
                    {tag.name}
                  </TagButton>
                ))}
              </div>
            ) : (
              <Skeleton className={"w-full h-[40px] rounded-lg"} />
            )}
          </div>
        </div>

        <div className={styles.cardWrapper}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            events.map(event => (
              <EventCard
                key={event.community_uuid}
                title={event.title}
                publisher={event.community_info.name}
                publisherIcon={event.community_info.img}
                datetime={event.date}
                tags={event.tag.map(tag => ({
                  name: tag.toString(),
                }))}
                imageUrl={event.img}
                handleEventClose={handleEventClose}
              />
            ))
          )}
        </div>
      </AuthProvider>
    </>
  );
};

export default EventPage;
