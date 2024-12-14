"use client";

import { getTags } from "@/components/tags/hooks/get-tags";
import { communityAtom } from "@/features/account/stores";
import { User } from "@/features/account/types/user";
import { GetUsers } from "@/features/home/community/hooks/gets-users";
import { postScout } from "@/features/home/community/hooks/post-scout";
import { ScoutPostType } from "@/features/home/community/types/scout";
import { TagType } from "@/features/tags/types/tag";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MessageForm } from "./components/MessageForm";
import { SearchBar } from "./components/SearchBar";
import { SearchTags } from "./components/SearchTags";
import { SelectedUserBadges } from "./components/SelectedUserBadges";
import { UserList } from "./components/UserList";

export function CommunityHome() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User[]>([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [community] = useAtom(communityAtom);
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const isFirstRender = useRef(true);
  const [tags, setTags] = useState<TagType[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);

  useEffect(() => {
    if (isFirstRender.current) {
      GetUsers().then(users => {
        setUsers(users);
      });

      getTags().then(tags => {
        setTags(tags);
      });
      isFirstRender.current = false;
    }
  }, []);

  const filteredUsers = users?.filter(user => {
    const matchesName = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every(selectedTag => user.tags?.includes(selectedTag.name));
    return matchesName && matchesTags;
  });

  const handleCardClick = (user: User) => {
    if (!selectedUser.includes(user)) {
      setSelectedUser([...selectedUser, user]);
    } else {
      setSelectedUser(selectedUser.filter(selected => selected.uuid !== user.uuid));
    }
  };

  const handleBadgeClick = (uuid: string) => {
    setSelectedUser(selectedUser => {
      const foundUser = users?.find(user => user.uuid === uuid);
      if (!foundUser) return selectedUser;

      return selectedUser.some(user => user.uuid === uuid)
        ? selectedUser.filter(user => user.uuid !== uuid)
        : [...selectedUser, foundUser];
    });
  };

  const handleTagClick = (tag: TagType) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!community?.uuid) {
      toast.error("一度サインアウトして再度サインインしてください。");
      router.push("/community/signin");
      return;
    }

    const uuids = selectedUser.map(user => ({ user_uuid: user.uuid }));
    const postData: ScoutPostType = {
      content: textAreaValue,
      community_uuid: community.uuid,
      uuids: uuids,
    };

    try {
      setSending(true);
      await postScout(postData);
      toast.success("送信しました");
      setTextAreaValue("");
      setSelectedUser([]);
    } catch (error) {
      console.error("Error posting scout:", error);
      toast.error("送信に失敗しました。もう一度お試しください。");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mt-5 ml-10 pt-3">ホーム</h1>
      <div className="container mx-auto p-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <SearchTags tags={tags} handleTagClick={handleTagClick} />

        <UserList
          users={filteredUsers}
          handleCardClick={handleCardClick}
          selectedUser={selectedUser}
        />

        <SelectedUserBadges selectedUser={selectedUser} onBadgeClick={handleBadgeClick} />

        <MessageForm
          textAreaValue={textAreaValue}
          setTextAreaValue={setTextAreaValue}
          handleSubmit={handleSubmit}
          isSending={sending}
          canSubmit={textAreaValue !== "" && selectedUser.length > 0}
        />
      </div>
    </>
  );
}
