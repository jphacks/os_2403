import CardTag from "@/components/tags/card-tag";
import { TagType } from "@/features/tags/types/tag";
import style from "../styles/search-tags.module.scss";

type SearchTagsProps = {
  tags: TagType[];
  handleTagClick: (tag: TagType) => void;
};

export function SearchTags({ tags, handleTagClick }: SearchTagsProps) {
  return (
    <div className={style.container}>
      <h1 className={style.title}>タグで絞り込む</h1>
      <div className={style.tags}>
        {tags?.map(tag => (
          <CardTag key={tag.name} variant={tag.color} onClick={() => handleTagClick(tag)}>
            {tag.name}
          </CardTag>
        ))}
      </div>
    </div>
  );
}
