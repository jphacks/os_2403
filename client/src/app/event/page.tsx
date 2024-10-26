import React from "react";
import { EventCard } from "@/features/event-card";

const EventPage = () => {
    return (
        <div>
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
    );
}
export default EventPage;