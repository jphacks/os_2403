"use client";
import { Community } from "@/domain/community";
import { userAtom } from "@/domain/user";
import { PutObjectCommand, PutObjectRequest, S3, S3Client } from "@aws-sdk/client-s3";
import { type ClassValue, clsx } from "clsx";
import { useAtom } from "jotai/index";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// S3の設定

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_REGION || "",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY || "",
  },
});

export const uploadImageToS3 = async (file: File): Promise<string | undefined> => {
  const fileName = `${Date.now()}-${file.name}`;
  const params: PutObjectRequest = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME ? process.env.NEXT_PUBLIC_S3_BUCKET_NAME : "",
    Key: fileName,
    ContentType: file.type,
    Body: file,
  };

  try {
    const command = new PutObjectCommand(params);
    const uploadResult = await s3Client.send(command);
    console.log("画像アップロード成功:", uploadResult);
    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("画像アップロードエラー:", error);
    return undefined;
  }
};
