// atoms/inviteAtoms.ts
import { atom } from 'jotai'

export interface Invite {
  id: string
  title: string
  date: string
  university: string
}

// 招待リストのatom
export const invitesAtom = atom<Invite[]>([])

// 招待を辞退する関数を持つatom
export const declineInviteAtom = atom(
  null, // read
  (get, set, inviteId: string) => {
    const invites = get(invitesAtom)
    set(invitesAtom, invites.filter(invite => invite.id !== inviteId))
  }
)
