'use client'

import React from 'react';
import { useAtom } from 'jotai';
import { Heart } from 'lucide-react';
import { declineInviteAtom } from '@/domain/inviteAtom';

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
    <div className="max-w-sm bg-gray-100 rounded-lg p-4">
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold">{title}</h3>
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => declineInvite(id)}
            >
              招待を辞退する
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Heart className="text-red-500" size={20} />
            <span className="text-gray-600">{date}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">{university}</span>
            <button
              type="button"
              className="text-gray-600 hover:text-gray-800 flex items-center"
              onClick={onViewDetail}
            >
              もっと詳しく
              <svg
                className="w-4 h-4 ml-1"
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
