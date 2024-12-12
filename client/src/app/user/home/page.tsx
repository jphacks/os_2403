"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Community } from "@/features/account/types/community";
import { CommunityCard } from "@/features/home/user/components/community-card";
import { GetCommunities } from "@/features/home/user/hooks/gets-communities";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import InviteCheck from "../../../../public/invite-check";
import styles from "./style.module.scss";

export default function Home() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filterCommunities, setFilterCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<Community[]>([]);

  useEffect(() => {
    GetCommunities().then(Communities => {
      setCommunities(Communities);
      setFilterCommunities(Communities);
    });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilterCommunities(
        communities?.filter(communities =>
          communities.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
      return;
    }
    setFilterCommunities(communities);
  }, [searchQuery]);

  const handleCardClick = (communities: Community) => {
    if (!selectedCommunity.includes(communities)) {
      setSelectedCommunity([...selectedCommunity, communities]);
    } else {
      setSelectedCommunity(selectedCommunity.filter(selected => selected !== communities));
    }
  };

  return (
    <>
      <div className={styles.inviteCheck}>
        <InviteCheck size={500} />
      </div>
      <h1 className="text-2xl font-bold text-white mt-20 ml-10">コミュニティー一覧</h1>
      <div className="container mx-auto p-4">
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md relative">
            <Input
              type="text"
              placeholder="コミュニティー名で検索..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search size={20} />
            </div>
          </div>
        </div>

        <ScrollArea className="h-96 w-full rounded-md border">
          <div className="grid grid-cols-2 gap-2 p-4">
            {filterCommunities?.map(community => {
              return (
                <CommunityCard
                  key={community.name}
                  uuid={community.uuid}
                  communityname={community.name}
                  icon={community.img}
                  detail={community.self}
                  university={community.mem1}
                  onClick={() => {
                    handleCardClick(community);
                  }}
                />
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
