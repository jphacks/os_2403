"use client";

import { TagType } from "@/domain/tag";
import { Ellipsis, SquareX } from "lucide-react";
import React, { useState } from "react";
import InviteForYou from "../../../public/invite-for-you";
import Letter from "../../../public/letter";
import { EventCard } from "../event";
import style from "./index.module.scss";

type CardType = {
  title: string;
  publisher: string;
  publisherIcon: string;
  datetime: string;
  tags: TagType[];
  imageUrl: string;
  liked?: boolean;
};

interface PopupProps {
  cards: CardType[];
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
        {displayedCards.map(card => (
          <EventCard
            key={card.title}
            {...card}
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
