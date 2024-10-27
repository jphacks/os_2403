// app/features/Invite/index.tsx
'use client'

import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { invitesAtom } from '@/domain/inviteAtom';
import { InviteList } from './components/InviteList';
import { InviteCard } from './components/InviteCard';
import styles from './index.module.scss';

export function Invite() {
  const [, setInvites] = useAtom(invitesAtom);

  useEffect(() => {
    setInvites([
      {
        id: '1',
        title: 'ぬんううぬぬうぬぬぬぬぬぬぬぬぬぬぬぬ',
        date: '2024年5月1日',
        university: '○○大学',
      },
      {
        id: '2',
        title: 'ぬんううぬぬうぬぬぬぬぬぬぬぬぬぬぬぬ',
        date: '2024年5月1日',
        university: '○○大学',
      },
      {
        id: '3',
        title: 'ぬんううぬぬうぬぬぬぬぬぬぬぬぬぬぬぬ',
        date: '2024年5月1日',
        university: '○○大学',
      },
      // 招待データ
    ]);
  }, [setInvites]);

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <InviteList />
      </div>
      <div className={styles.rightPanel}>
        <InviteCard
          title="ぬんううぬぬうぬぬぬぬぬぬぬぬぬぬぬぬ"
          subtitle="推しだったあなたへ"
          timestamp="YYYY/MM/DD TT:TT"
          content="上手くいって欲しい...そんなのは当たり前のことと思ってます..."
          tags={['Tag1', 'Tag2', 'Tag3']}
          onReject={() => console.log('招待を辞退')}
        />
      </div>
    </div>
  );
}
