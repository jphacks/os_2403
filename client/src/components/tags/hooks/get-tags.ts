import { ButtonVariant, TagType } from "@/features/tags/types/tag";
import { apiClient } from "@/utils/client";

export const getTags = async (): Promise<TagType[]> => {
  try {
    const response = await apiClient.get("/tag");
    // APIレスポンスの型を明示的に定義
    type ApiTag = {
      Name: string;
      Color: string;
    };

    // タグの変換時に明示的な型付け
    return response?.data?.tags?.map((tag: ApiTag) => ({
      name: tag.Name,
      color: tag.Color.toLowerCase() as ButtonVariant,
    }));
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw error;
  }
};
