'use client'

import { useAtom } from 'jotai';
import { invitesAtom } from '@/domain/inviteAtom';
import { Invite } from '@/components/ui/inviteOne';
import styles from './style.module.scss';

export const InviteList = () => {
  const [invites] = useAtom(invitesAtom);

  return (
    <div className="space-y-4">
      {invites.map((invite) => (
        <Invite
          key={invite.id}
          {...invite}
          onViewDetail={() => console.log(`View detail for ${invite.id}`)}
        />
      ))}
    </div>
  );
};
