import CardTag from "@/components/tags/card-tag";
import { TagType } from "@/features/tags/types/tag";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import style from "../styles/search-tags.module.scss";

type SearchTagsProps = {
  tags: TagType[];
  handleTagClick: (tag: TagType) => void;
};

export function SearchTags({ tags, handleTagClick }: SearchTagsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTags = tags?.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={style.container}>
      <h1 className={style.title}>タグで絞り込む</h1>
      <Input
        type="text"
        placeholder="タグ名で検索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="w-full whitespace-nowrap rounded-md border gap-1">
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
  );
}