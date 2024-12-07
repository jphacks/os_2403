"use client";
import CardTag from "@/components/tags/card-tag";
import { TagType, ButtonVariant } from "@/features/tags/types/tag";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import style from "./style.module.scss";
import { useEffect, useState } from "react";
import { getTags } from "@/components/tags/hooks/get-tags";

// MockDataの型定義
export type MockData = {
  message: string;
  tags: {
    ID: number;
    color: string;
    Name: string;
  }[];
};

// TagCardPropsの型定義を更新
type TagCardProps = {
  className?: string;
  mockData?: MockData;  // mockDataプロパティを追加
};

// モックデータをTagType形式に変換する関数
const convertMockToTagType = (mockTags: MockData['tags']): TagType[] => {
  return mockTags.map(tag => ({
    name: tag.Name,
    color: tag.color as ButtonVariant
  }));
};

export const TagCard = ({ className, mockData }: TagCardProps) => {
  const router = useRouter();
  const [tags, setTags] = useState<TagType[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();
        if (response && response.length > 0) {
          setTags(response);
        } else if (mockData) {
          // APIレスポンスが空の場合はモックデータを使用
          setTags(convertMockToTagType(mockData.tags));
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        // APIエラーの場合もモックデータを使用
        if (mockData) {
          setTags(convertMockToTagType(mockData.tags));
        }
      }
    };

    fetchTags();
  }, [mockData]);

  const onClick = () => {
    router.push("/user/signin");
  };

  // モックデータを12個に複製する
  const displayTags = [...tags];
  while (displayTags.length < 12) {
    displayTags.push(...tags);
  }
  displayTags.length = 12; // 12個に制限

  return (
    <Card className={`${style.register_tag} ${className ? className : ""}`}>
      <CardHeader className={style.header}>
        <CardTitle className={style.title}>タグを探してみよう！</CardTitle>
        <CardDescription className={style.description}>
          気になるタグを3個以上選んでみよう！
        </CardDescription>
      </CardHeader>
      <CardContent className={style.content}>
        <CardTag key="1" variant={displayTags[0]?.color} className={style.tag1}>
          {displayTags[0]?.name}
        </CardTag>
        <CardTag key="2" variant={tags[1]?.color} className={style.tag2}>
          {tags[1]?.name}
        </CardTag>
        <CardTag key="3" variant={tags[2]?.color} className={style.tag3}>
          {tags[2]?.name}
        </CardTag>
        <CardTag key="4" variant={tags[3]?.color} className={style.tag1}>
          {tags[3]?.name}
        </CardTag>
        <CardTag key="5" variant={tags[4]?.color} className={style.tag2}>
          {tags[4]?.name}
        </CardTag>
        <CardTag key="6" variant={tags[5]?.color} className={style.tag1}>
          {tags[5]?.name}
        </CardTag>
        <CardTag key="7" variant={tags[6]?.color} className={style.tag1}>
          {tags[6]?.name}
        </CardTag>
        <CardTag key="8" variant={tags[7]?.color} className={style.tag3}>
          {tags[7]?.name}
        </CardTag>
        <CardTag key="9" variant={tags[8]?.color} className={style.tag1}>
          {tags[8]?.name}
        </CardTag>
        <CardTag key="10" variant={tags[9]?.color} className={style.tag2}>
          {tags[9]?.name}
        </CardTag>
        <CardTag key="11" variant={tags[10]?.color} className={style.tag3}>
          {tags[10]?.name}
        </CardTag>
        <CardTag key="12" variant={tags[11]?.color} className={style.tag1}>
          {tags[11]?.name}
        </CardTag>
      </CardContent>
      <CardFooter className={style.footer}>
        <Button onClick={onClick} className={style.button}>
          これが気に入った！
        </Button>
      </CardFooter>
    </Card>
  );
};
