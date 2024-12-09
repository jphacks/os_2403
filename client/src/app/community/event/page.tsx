"use client";
import InviteCheck from "@/../public/invite-check";
import LikeSearch from "@/../public/like-search";
import { getTags } from "@/components/tags/hooks/get-tags";
import TagButton from "@/components/tags/tag-button";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/features/event";
import { getEvents } from "@/features/event/hooks/get-events";
import { EventType } from "@/features/event/types/event";
import { Menubar } from "@/features/menubar/components/Menubar";
import { Popup } from "@/features/popup";
import { TagType } from "@/features/tags/types/tag";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";

const EventPage = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [invitedEvents, setInvitedEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const fetchTags = async () => {
      try {
        const response = await getTags();
        if (mounted) {
          setTags(response);
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        if (mounted) {
          setEvents(fetchedEvents);
          setInvitedEvents(fetchedEvents);
          //本来は以下のようにして招待されたイベントのみを取得する
          //setInvitedEvents(fetchedEvents.filter((home) => home.invited));
          if (invitedEvents.length > 0) {
            setShowPopup(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchTags();
    fetchEvents();
    return () => {
      mounted = false;
    };
  }, [invitedEvents]);

  const handleEventClose = () => {
    console.log("Event closed");
  };

  return (
    <>
      {/*<AuthProvider>*/}
      {!loading && events.length > 0 && showPopup && <Popup cards={events} />}
      <Menubar />
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
            <Skeleton className="w-full h-[40px] rounded-lg" />
          )}
        </div>
      </div>

      <div className={styles.cardWrapper}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          events.map((event, index) => (
            <EventCard
              key={`${event.community_uuid}-${index}`}
              title={event.title}
              publisher={event.community_info.name}
              publisherIcon={event.community_info.img}
              datetime={event.date}
              tags={event.tag.map(tag => ({
                name: tag.toString(),
              }))}
              imageUrl={event.img}
              liked={false}
              handleEventClose={handleEventClose}
            />
          ))
        )}
      </div>
      {/*</AuthProvider>*/}
    </>
  );
};

export default EventPage;
