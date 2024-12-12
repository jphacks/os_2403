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
import { useEffect, useState, useRef } from "react";
import { getTags } from "@/components/tags/hooks/get-tags";
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai";
import { userAtom } from "@/features/account/stores";
import { communityAtom } from "@/features/account/stores";

type TagCardProps = {
  type: "user" | "community";
};

export const TagCard = ({ type }: TagCardProps) => {
  const router = useRouter();
  const ws = useRef<WebSocket | null>(null);
  const [tags, setTags] = useState<TagType[]>([]);
  const [aiRecommendedTags, setAiRecommendedTags] = useState<TagType[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser] = useAtom(userAtom);
  const [currentCommunity] = useAtom(communityAtom);

  // aiRecommendedTagsの変更を監視
  useEffect(() => {
    console.log('aiRecommendedTags updated:', aiRecommendedTags);
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
      setError("Failed to load tags");
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

        const wsUrl = `ws://localhost:8080/api/ws/tag_recommend/${uuid}`;
        console.log("Initializing WebSocket connection to:", wsUrl);
        wsInstance = new WebSocket(wsUrl);
        ws.current = wsInstance;

        wsInstance.onopen = () => {
          console.log("WebSocket connection established");
        };

        wsInstance.onmessage = (event) => {
          if (!isComponentMounted) return;
        
          console.log('Raw WebSocket message:', event.data);
        
          try {
            const data = JSON.parse(event.data);
            if (Array.isArray(data.recommendedTagName) && Array.isArray(data.recommendedTagColor)) {
              const recommendedTags: TagType[] = data.recommendedTagName.map((name, index) => ({
                id: index,
                name: name,
                color: data.recommendedTagColor[index] as ButtonVariant,
              }));
              console.log('Received new recommended tags:', recommendedTags);
              setAiRecommendedTags(recommendedTags);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        wsInstance.onerror = (error) => {
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

  const handleTagClick = (index: number) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
        
        if (ws.current?.readyState === WebSocket.OPEN) {
          const message = {
            tag: tags[index].name
          };
          ws.current.send(JSON.stringify(message));
        }
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

    const selectedTagNames = Array.from(selectedTags).map(index => tags[index].name);

    try {
      if (ws.current) {
        ws.current.close();
      }
      
      await apiClient.put(endpoint, {
        tag: selectedTagNames
      });
      router.push(redirectPath);
    } catch (error) {
      alert("タグの更新に失敗しました。もう一度お試しください。");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>タグを探してみよう！</CardTitle>
        <CardDescription>
          気になるタグを3個以上選んでみよう！
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tags[0] && (
          <CardTag 
            variant={tags[0].color} 
            className={`${style.tag1} ${selectedTags.has(0) ? style.selected : ''}`}
            onClick={() => handleTagClick(0)}
          >
            {tags[0].name}
          </CardTag>
        )}
        {tags[1] && (
          <CardTag 
            variant={tags[1].color} 
            className={`${style.tag2} ${selectedTags.has(1) ? style.selected : ''}`}
            onClick={() => handleTagClick(1)}
          >
            {tags[1].name}
          </CardTag>
        )}
        {tags[2] && (
          <CardTag 
            variant={tags[2].color} 
            className={`${style.tag3} ${selectedTags.has(2) ? style.selected : ''}`}
            onClick={() => handleTagClick(2)}
          >
            {tags[2].name}
          </CardTag>
        )}
        {tags[3] && (
          <CardTag 
            variant={tags[3].color} 
            className={`${style.tag1} ${selectedTags.has(3) ? style.selected : ''}`}
            onClick={() => handleTagClick(3)}
          >
            {tags[3].name}
          </CardTag>
        )}
        {tags[4] && (
          <CardTag 
            variant={tags[4].color} 
            className={`${style.tag2} ${selectedTags.has(4) ? style.selected : ''}`}
            onClick={() => handleTagClick(4)}
          >
            {tags[4].name}
          </CardTag>
        )}
        {tags[5] && (
          <CardTag 
            variant={tags[5].color} 
            className={`${style.tag3} ${selectedTags.has(5) ? style.selected : ''}`}
            onClick={() => handleTagClick(5)}
          >
            {tags[5].name}
          </CardTag>
        )}
        {tags[6] && (
          <CardTag 
            variant={tags[6].color} 
            className={`${style.tag1} ${selectedTags.has(6) ? style.selected : ''}`}
            onClick={() => handleTagClick(6)}
          >
            {tags[6].name}
          </CardTag>
        )}
        {tags[7] && (
          <CardTag 
            variant={tags[7].color} 
            className={`${style.tag2} ${selectedTags.has(7) ? style.selected : ''}`}
            onClick={() => handleTagClick(7)}
          >
            {tags[7].name}
          </CardTag>
        )}
        {tags[8] && (
          <CardTag 
            variant={tags[8].color} 
            className={`${style.tag3} ${selectedTags.has(8) ? style.selected : ''}`}
            onClick={() => handleTagClick(8)}
          >
            {tags[8].name}
          </CardTag>
        )}
        {tags[9] && (
          <CardTag 
            variant={tags[9].color} 
            className={`${style.tag1} ${selectedTags.has(9) ? style.selected : ''}`}
            onClick={() => handleTagClick(9)}
          >
            {tags[9].name}
          </CardTag>
        )}
        {tags[10] && (
          <CardTag 
            variant={tags[10].color} 
            className={`${style.tag2} ${selectedTags.has(10) ? style.selected : ''}`}
            onClick={() => handleTagClick(10)}
          >
            {tags[10].name}
          </CardTag>
        )}
        {tags[11] && (
          <CardTag 
            variant={tags[11].color} 
            className={`${style.tag3} ${selectedTags.has(11) ? style.selected : ''}`}
            onClick={() => handleTagClick(11)}
          >
            {tags[11].name}
          </CardTag>
        )}
      {aiRecommendedTags && aiRecommendedTags.length > 0 && aiRecommendedTags.some(tag => tag.name) && (
        <div className={style.aiRecommendedSection}>
          <div className={style.aiRecommendedLabel}>AIおすすめ</div>
          <div className={style.aiRecommendedTags}>
            {aiRecommendedTags.map((tag, index) => (
              <CardTag
                key={`ai-recommended-${index}`}
                variant={tag.color}
                className={style.aiTag}
              >
                {tag.name}
              </CardTag>
            ))}
          </div>
        </div>
      )}
      </CardContent>
      <CardFooter className={style.footer}>
        <Button 
          onClick={onClick} 
          className={style.button}
          disabled={selectedTags.size < 3}
        >
          これが気に入った！
        </Button>
      </CardFooter>
    </Card>
  );
};
