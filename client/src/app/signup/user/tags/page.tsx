"use client";

import { TagCard } from "@/feature/tags/components/TagCard";
import style from "./style.module.scss";

const RegisterTags = () => {
  return (
    <div className={style.card}>
      <TagCard />
    </div>
  );
};

export default RegisterTags;
