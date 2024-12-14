// TagCard.tsx
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { userAtom } from "@/features/account/stores";
import { communityAtom } from "@/features/account/stores";
import { ButtonVariant, TagType } from "@/features/tags/types/tag";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SearchBar } from "./SearchBar";
import style from "./style.module.scss";
import { SearchBar } from "./SearchBar";

type TagCardProps = {
  type: "user" | "community";
};

export const TagCard = ({ type }: TagCardProps) => {
  const router = useRouter();
  const ws = useRef<WebSocket | null>(null);
  const [tags, setTags] = useState<TagType[]>([]);
  const [aiRecommendedTags, setAiRecommendedTags] = useState<TagType[]>([]);
  const [selectedRegularTags, setSelectedRegularTags] = useState<Set<number>>(new Set());
  const [selectedAiTags, setSelectedAiTags] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser] = useAtom(userAtom);
  const [currentCommunity] = useAtom(communityAtom);
  const [searchQuery, setSearchQuery] = useState("");

  const totalSelectedTags = new Set([...selectedRegularTags, ...selectedAiTags]);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())

  useEffect(() => {
    console.log("aiRecommendedTags updated:", aiRecommendedTags);
  }, [aiRecommendedTags]);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const response = await getTags();
      if (response && response.length > 0) {
        setTags(response);
        setAiRecommendedTags(response.slice(0, 3));
      }
      setError(null);
    } catch (error) {
      setError(`Failed to load tags:${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let wsInstance: WebSocket | null = null;
    let isComponentMounted = true;

    const initializeWebSocket = async () => {
      const uuid = type === "user" ? currentUser?.uuid : currentCommunity?.uuid;
      if (!uuid) {
        console.log("No UUID available, skipping WebSocket connection");
        return;
      }

      try {
        await fetchTags();

        const wsUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/ws/tag_recommend/${uuid}`;
        console.log("Initializing WebSocket connection to:", wsUrl);
        wsInstance = new WebSocket(wsUrl);
        ws.current = wsInstance;

        wsInstance.onopen = () => {
          console.log("WebSocket connection established");
        };

        wsInstance.onmessage = event => {
          if (!isComponentMounted) return;

          console.log("Raw WebSocket message:", event.data);

          try {
            const data = JSON.parse(event.data);
            if (Array.isArray(data.recommendedTagName) && Array.isArray(data.recommendedTagColor)) {
              const recommendedTags: TagType[] = data.recommendedTagName.map(
                (name: string, index: number) => ({
                  id: index,
                  name: name,
                  color: data.recommendedTagColor[index] as ButtonVariant,
                }),
              );
              console.log("Received new recommended tags:", recommendedTags);
              setAiRecommendedTags(recommendedTags);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        wsInstance.onerror = error => {
          console.error("WebSocket error:", error);
        };

        wsInstance.onclose = () => {
          if (isComponentMounted) {
            setTimeout(initializeWebSocket, 5000);
          }
        };
      } catch (error) {
        console.error("Error in WebSocket initialization:", error);
      }
    };

    initializeWebSocket();

    return () => {
      isComponentMounted = false;
      if (wsInstance) {
        wsInstance.close();
      }
    };
  }, [type, currentUser?.uuid, currentCommunity?.uuid]);

  const handleTagClick = (index: number, isAiTag: boolean = false) => {
    if (isAiTag) {
      const aiTag = aiRecommendedTags[index];
      const regularTagIndex = tags.findIndex(tag => tag.name === aiTag.name);

      setSelectedAiTags(prev => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
          if (regularTagIndex !== -1) {
            setSelectedRegularTags(prevRegular => {
              const newRegularSet = new Set(prevRegular);
              newRegularSet.delete(regularTagIndex);
              return newRegularSet;
            });
          }
        } else {
          newSet.add(index);
          if (regularTagIndex !== -1) {
            setSelectedRegularTags(prevRegular => {
              const newRegularSet = new Set(prevRegular);
              newRegularSet.add(regularTagIndex);
              return newRegularSet;
            });
          }

        }
        return newSet;
      });
    } else {
      setSelectedRegularTags(prev => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    }

    if (ws.current?.readyState === WebSocket.OPEN) {
      const tagName = isAiTag ? aiRecommendedTags[index].name : tags[index].name;
      const message = {
        tag: tagName,
      };
      ws.current.send(JSON.stringify(message));
    }
  };

  const onClick = async () => {
    let uuid: string | undefined;
    let endpoint: string;
    let redirectPath: string;

    if (type === "user") {
      uuid = currentUser?.uuid;
      endpoint = `/user/${uuid}`;
      redirectPath = "/user/home";
    } else {
      uuid = currentCommunity?.uuid;
      endpoint = `/community/${uuid}`;
      redirectPath = "/community/home";
    }

    if (!uuid) {
      alert(type === "user" ? "ユーザー情報が取得できません" : "コミュニティ情報が取得できません");
      return;
    }

    if (totalSelectedTags.size < 1) {
      alert("1つ以上のタグを選択してください");
      return;
    }

    const selectedTagNames = [
      ...Array.from(selectedRegularTags).map(index => tags[index]?.name),
      ...Array.from(selectedAiTags).map(index => aiRecommendedTags[index]?.name)
    ].filter(Boolean);

    try {
      if (ws.current) {
        ws.current.close();
      }

      await apiClient.put(endpoint, {
        tag: selectedTagNames,
      });
      router.push(redirectPath);
    } catch (error) {
      alert("タグの更新に失敗しました。もう一度お試しください。");
      console.error(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className={style.cardContainer}>
      <CardHeader>
        <CardTitle className={style.cardTitle}>タグを探してみよう！</CardTitle>
        <CardDescription className={style.CardDescription}>
          気になるタグを1つ以上選んでみよう！
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <ScrollArea className="w-full h-[120px] whitespace-nowrap rounded-md border">
          <div className={style.tagContainer}>
            {filteredTags.map((tag, index) => (
              <CardTag
                key={index}
                variant={tag.color}
                className={`${selectedRegularTags.has(index) ? style.selected : ""}`}
                onClick={() => handleTagClick(index)}
              >
                {tag.name}
              </CardTag>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {aiRecommendedTags &&
          aiRecommendedTags.length > 0 &&
          aiRecommendedTags.some(tag => tag.name) && (
            <div className={style.aiRecommendedSection}>
              <div className={style.aiRecommendedLabel}>AIおすすめ</div>
              <div className={style.aiRecommendedTags}>
                {aiRecommendedTags.map((tag, index) => (
                  <CardTag
                    key={`ai-recommended-${index}`}
                    variant={tag.color}
                    className={`${selectedAiTags.has(index) ? style.selected : ""} ${style.aiTag}`}
                    onClick={() => handleTagClick(index, true)}
                  >
                    {tag.name}
                  </CardTag>
                ))}
              </div>
            </div>
          )}
      </CardContent>
      <CardFooter className={style.footer}>
        <Button onClick={onClick} className={style.button} disabled={totalSelectedTags.size < 1}>
          これが気に入った！
        </Button>
      </CardFooter>
    </Card>
  );
};
