'use client'

import { useAtom } from 'jotai';
import { invitesAtom } from '@/domain/inviteAtom';
import { Invite } from '@/feature/invite/components/invite-one';


export const InviteList = () => {
  const [invites] = useAtom(invitesAtom);

  return (
    <div className="flex flex-col gap-4">
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
