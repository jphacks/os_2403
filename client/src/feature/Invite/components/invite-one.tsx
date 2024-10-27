'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { Heart } from 'lucide-react';
import { declineInviteAtom } from '@/domain/inviteAtom';
import './Invite.scss'; // SCSS ファイルをインポート

interface InviteProps {
  id: string;
  title: string;
  date: string;
  university: string;
  onViewDetail: () => void;
}

export const Invite = ({
  id,
  title,
  date,
  university,
  onViewDetail,
}: InviteProps) => {
  const [, declineInvite] = useAtom(declineInviteAtom);

  return (
    <div className="invite-container">
      <div className="invite-content">
        <div className="invite-details">
          <div className="invite-header">
            <h3 className="invite-title">{title}</h3>
            <button
              type="button"
              className="decline-button"
              onClick={() => declineInvite(id)}
            >
              招待を辞退する
            </button>
          </div>

          <div className="invite-date">
            <Heart className="heart-icon" size={20} />
            <span className="date-text">{date}</span>
          </div>

          <div className="invite-footer">
            <span className="university-text">{university}</span>
            <button
              type="button"
              className="view-detail-button"
              onClick={onViewDetail}
            >
              もっと詳しく
              <svg
                className="chevron-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-labelledby="chevronRightTitle"
                role="img"
              >
                <title id="chevronRightTitle">詳細を見る</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};