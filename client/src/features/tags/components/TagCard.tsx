"use client";
import CardTag from "@/components/tags/card-tag";
import { getTags } from "@/components/tags/hooks/get-tags";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { userAtom } from "@/features/account/stores";
import { communityAtom } from "@/features/account/stores";
import { TagType } from "@/features/tags/types/tag";
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from "./style.module.scss";

type TagCardProps = {
  type: "user" | "community";
  className?: string;
};

export const TagCard = ({ type, className }: TagCardProps) => {
  const router = useRouter();
  const [tags, setTags] = useState<TagType[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser] = useAtom(userAtom);
  const [currentCommunity] = useAtom(communityAtom);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const response = await getTags();
      if (response && response.length > 0) {
        setTags(response);
      }
      setError(null);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      setError("Failed to load tags");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTagClick = (index: number) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const onClick = async () => {
    let uuid: string | undefined;
    let endpoint: string;
    let redirectPath: string;

    if (type === "user") {
      uuid = currentUser?.uuid;
      endpoint = `/user/${uuid}`;
      redirectPath = "/user/signin";
    } else {
      uuid = currentCommunity?.uuid;
      endpoint = `/community/${uuid}`;
      redirectPath = "/community/signin";
    }

    if (!uuid) {
      alert(type === "user" ? "ユーザー情報が取得できません" : "コミュニティ情報が取得できません");
      return;
    }

    if (selectedTags.size < 3) {
      alert("3つ以上のタグを選択してください");
      return;
    }

    const selectedTagNames = Array.from(selectedTags).map(index => tags[index]?.name);

    try {
      await apiClient.put(endpoint, {
        tag: selectedTagNames,
      });

      router.push(redirectPath);
    } catch (error) {
      console.error("Failed to update tags:", error);
      alert("タグの更新に失敗しました。もう一度お試しください。");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const displayTags = [...tags];
  while (displayTags.length < 12) {
    displayTags.push(...tags);
  }
  displayTags.length = 12;

  return (
    <Card className={`${style.register_tag} ${className ? className : ""}`}>
      <CardHeader className={style.header}>
        <CardTitle className={style.title}>タグを探してみよう！</CardTitle>
        <CardDescription className={style.description}>
          気になるタグを3個以上選んでみよう！
        </CardDescription>
      </CardHeader>
      <CardContent className={style.content}>
        <CardTag
          key="1"
          variant={displayTags[0]?.color}
          className={`${style.tag1} ${selectedTags.has(0) ? style.selected : ""}`}
          onClick={() => handleTagClick(0)}
        >
          {displayTags[0]?.name}
        </CardTag>
        <CardTag
          key="2"
          variant={tags[1]?.color}
          className={`${style.tag2} ${selectedTags.has(1) ? style.selected : ""}`}
          onClick={() => handleTagClick(1)}
        >
          {tags[1]?.name}
        </CardTag>
        <CardTag
          key="3"
          variant={tags[2]?.color}
          className={`${style.tag3} ${selectedTags.has(2) ? style.selected : ""}`}
          onClick={() => handleTagClick(2)}
        >
          {tags[2]?.name}
        </CardTag>
        <CardTag
          key="4"
          variant={tags[3]?.color}
          className={`${style.tag1} ${selectedTags.has(3) ? style.selected : ""}`}
          onClick={() => handleTagClick(3)}
        >
          {tags[3]?.name}
        </CardTag>
        <CardTag
          key="5"
          variant={tags[4]?.color}
          className={`${style.tag2} ${selectedTags.has(4) ? style.selected : ""}`}
          onClick={() => handleTagClick(4)}
        >
          {tags[4]?.name}
        </CardTag>
        <CardTag
          key="6"
          variant={tags[5]?.color}
          className={`${style.tag1} ${selectedTags.has(5) ? style.selected : ""}`}
          onClick={() => handleTagClick(5)}
        >
          {tags[5]?.name}
        </CardTag>
        <CardTag
          key="7"
          variant={tags[6]?.color}
          className={`${style.tag1} ${selectedTags.has(6) ? style.selected : ""}`}
          onClick={() => handleTagClick(6)}
        >
          {tags[6]?.name}
        </CardTag>
        <CardTag
          key="8"
          variant={tags[7]?.color}
          className={`${style.tag3} ${selectedTags.has(7) ? style.selected : ""}`}
          onClick={() => handleTagClick(7)}
        >
          {tags[7]?.name}
        </CardTag>
        <CardTag
          key="9"
          variant={tags[8]?.color}
          className={`${style.tag1} ${selectedTags.has(8) ? style.selected : ""}`}
          onClick={() => handleTagClick(8)}
        >
          {tags[8]?.name}
        </CardTag>
        <CardTag
          key="10"
          variant={tags[9]?.color}
          className={`${style.tag2} ${selectedTags.has(9) ? style.selected : ""}`}
          onClick={() => handleTagClick(9)}
        >
          {tags[9]?.name}
        </CardTag>
        <CardTag
          key="11"
          variant={tags[10]?.color}
          className={`${style.tag3} ${selectedTags.has(10) ? style.selected : ""}`}
          onClick={() => handleTagClick(10)}
        >
          {tags[10]?.name}
        </CardTag>
        <CardTag
          key="12"
          variant={tags[11]?.color}
          className={`${style.tag1} ${selectedTags.has(11) ? style.selected : ""}`}
          onClick={() => handleTagClick(11)}
        >
          {tags[11]?.name}
        </CardTag>
      </CardContent>
      <CardFooter className={style.footer}>
        <Button onClick={onClick} className={style.button} disabled={selectedTags.size < 3}>
          これが気に入った！
        </Button>
      </CardFooter>
    </Card>
  );
};
