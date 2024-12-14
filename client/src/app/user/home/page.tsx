"use client";

import CardTag from "@/components/tags/card-tag";
import { getTags } from "@/components/tags/hooks/get-tags";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Community } from "@/features/account/types/community";
import { CommunityCard } from "@/features/home/user/components/CommunityCard";
import { GetCommunities } from "@/features/home/user/hooks/gets-communities";
import { TagType } from "@/features/tags/types/tag";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import InviteCheck from "../../../../public/invite-check";
import styles from "./style.module.scss";

export default function Home() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<Community[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const isFirstRender = useRef(true);
  const [searchQueryTag, setSearchQueryTag] = useState("");

  const filteredTags = tags?.filter(tag =>
    tag.name.toLowerCase().includes(searchQueryTag.toLowerCase())
  );

  useEffect(() => {
    if (isFirstRender.current) {
      GetCommunities().then(communities => {
        setCommunities(communities);
      });

      getTags().then(tags => {
        setTags(tags);
      });
      isFirstRender.current = false;
    }
  }, []);

  const handleTagClick = (tag: TagType) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredCommunities = communities?.filter(community => {
    const matchesName = community.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every(selectedTag => community.tag_name?.includes(selectedTag.name));
    return matchesName && matchesTags;
  });

  const handleCardClick = (community: Community) => {
    if (!selectedCommunity.includes(community)) {
      setSelectedCommunity([...selectedCommunity, community]);
    } else {
      setSelectedCommunity(selectedCommunity.filter(selected => selected !== community));
    }
  };

  return (
    <>
      <div className={styles.inviteCheck}>
        <InviteCheck size={500} />
      </div>
      <h1 className="text-2xl font-bold text-[#FFFFFFD0] mt-20 ml-10">コミュニティー一覧</h1>
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

        <div className="bg-[#FFFFFF1A] p-4 rounded-md mb-6">
          <h1 className="text-xl font-bold text-[#FFFFFFD0] mb-2">タグで絞り込む</h1>
          <Input
            type="text"
            placeholder="タグ名で検索..."
            value={searchQueryTag}
            onChange={(e) => setSearchQueryTag(e.target.value)}
            className="mb-4"
          />
          <ScrollArea className="w-full whitespace-nowrap rounded-md gap-1">
            <div className="flex w-max space-x-4 p-4">
              {filteredTags?.map(tag => (
                <CardTag key={tag.name} variant={tag.color} onClick={() => handleTagClick(tag)}>
                  {tag.name}
                </CardTag>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <ScrollArea className={styles.communityContainer}>
          <div className="grid grid-cols-2 gap-2 p-4">
            {filteredCommunities?.map(community => (
              <CommunityCard
                key={community.name}
                uuid={community.uuid}
                communityname={community.name}
                icon={community.img}
                tags={community.tag_name}
                tag_colors={community.tag_colors}
                detail={community.self}
                university={community.mem1}
                onClick={() => {
                  handleCardClick(community);
                }}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
