'use client';

import React, { useState } from 'react';
import { EventCard } from '../event';
import style from './index.module.scss';
import Letter from '../../../public/letter';
import InviteForYou from '../../../public/invite-for-you';
import { Ellipsis, SquareX } from 'lucide-react';

interface Tag {
  id: string;
  label: string;
  variant?: 'red' | 'blue' | 'green' | 'gray';
}

interface CardType {
  title: string;
  publisher: string;
  publisherIcon: string;
  datetime: string;
  tags: Tag[];
  imageUrl: string;
  liked?: boolean;
}

interface PopupProps {
  cards: CardType[];
}

export const Popup: React.FC<PopupProps> = ({ cards }) => {
  const [display, setDisplay] = useState(true);

  if (!display || !cards || cards.length === 0) return null;

  const handleClose = () => {
    setDisplay(false);
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
        {cards.map((card) => (
          <EventCard key={card.title} {...card} />
        ))}
        {cards.length > 3 && (
          <a href="/event" className={style.ellipsis}>
            <Ellipsis size={100} />
          </a>
        )}
      </div>
    </div>
  );
};