import { ButtonVariant, TagType } from "@/features/tags/types/tag";
import { apiClient } from "@/utils/client";

export const getTags = async (): Promise<TagType[]> => {
  try {
    const response = await apiClient.get("/tag");
    // APIレスポンスの型を明示的に定義
    type ApiTag = {
      name: string;
      color: string;
    };
    // タグの変換時に明示的な型付けを行う
    return response.data.map((tag: ApiTag) => ({
      name: tag.name,
      color: tag.color.toLowerCase() as ButtonVariant,
    }));
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw error;
  }
};
