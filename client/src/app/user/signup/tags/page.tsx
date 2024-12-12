"use client";

import { TagCard } from "@/features/tags/components/TagCard";
import style from "./style.module.scss";

const RegisterTags = () => {
  const mockData = {
    message: "sign in successful",
    tags: [
      {
        ID: 2,
        color: "red",
        Name: "st",
      },
      {
        ID: 3,
        color: "blue",
        Name: "a",
      },
      {
        ID: 5,
        color: "green",
        Name: "r",
      },
      {
        ID: 1,
        color: "gray",
        Name: "hogehoge",
      },
      {
        ID: 4,
        color: "purple",
        Name: "d",
      },
    ],
  };

  return (
    <div className={style.card}>
      <TagCard />
    </div>
  );
};

export default RegisterTags;
