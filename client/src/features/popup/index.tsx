"use client";

import { EventType } from "@/features/event/types/event";
import { Ellipsis, SquareX } from "lucide-react";
import React, { useState } from "react";
import InviteForYou from "../../../public/invite-for-you";
import Letter from "../../../public/letter";
import { EventCard } from "../event";
import style from "./index.module.scss";

interface PopupProps {
  cards: EventType[];
}

export const Popup: React.FC<PopupProps> = ({ cards }) => {
  const [display, setDisplay] = useState(true);
  const [displayedCards, setDisplayedCards] = useState(cards);

  if (!display || !displayedCards || displayedCards.length === 0) return null;

  const handleClose = () => {
    setDisplay(false);
  };

  const handleEventClose = (cardTitle: string) => {
    setDisplayedCards(displayedCards.filter(card => card.title !== cardTitle));
  };

  // 最初の3つのカードのみを表示
  const visibleCards = displayedCards.slice(0, 3);

  return (
    <div className={style.popup}>
      <div className={style.closeButton}>
        <SquareX size={36} stroke="#fff" onClick={handleClose} />
      </div>
      <div className={style.inviteForYou}>
        <InviteForYou size={1000} />
      </div>

      <div className={style.letterBackground}>
        <Letter size={1250} />
      </div>

      <div className={style.cardWrapper}>
        {visibleCards.map((card, index) => (
          <EventCard
            key={`${card.community_uuid}-${index}`}
            title={card.title}
            publisher={card.community_info.name}
            publisherIcon={card.community_info.img}
            datetime={card.date}
            tags={card.tag.map(tag => ({
              name: tag.toString(),
            }))}
            imageUrl={card.img}
            liked={false}
            handleEventClose={() => handleEventClose(card.title)}
          />
        ))}
        {displayedCards.length > 3 && (
          <a href="/event" className={style.ellipsis}>
            <Ellipsis size={100} />
          </a>
        )}
      </div>
    </div>
  );
};
