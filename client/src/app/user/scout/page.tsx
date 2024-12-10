"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ScoutCard } from "@/features/scout/components/ScoutCard";
import { ScoutDetail } from "@/features/scout/components/ScoutDetail";
import React from "react";
import style from "./style.module.scss";

const ScoutListPage = () => {
  const [selectNumber, setSelectNumber] = React.useState<number>(1);

  //モック
  const scouts = [
    {
      id: 1,
      username: "test",
      icon: "test",
      university: "立命館",
      tags: ["test", "test", "test"],
    },
    {
      id: 2,
      username: "test",
      icon: "test",
      university: "立命館",
      tags: undefined,
    },
    {
      id: 3,
      username: "test",
      icon: "test",
      university: "立命館",
      tags: undefined,
    },
    {
      id: 4,
      username: "test",
      icon: "test",
      university: "立命館",
      tags: undefined,
    },
    {
      id: 5,
      username: "test",
      icon: "test",
      university: "立命館",
      tags: undefined,
    },
  ];

  return (
    <div className={style.topContainer}>
      <div className={style.leftContainer}>
        <h1 className={style.listHeader}>招待一覧</h1>
        <div className={style.scrollAreaContainer}>
          <ScrollArea type="scroll">
            {scouts.map(scout => (
              <ScoutCard
                key={scout.id}
                {...scout}
                isSelected={selectNumber === scout.id}
                onSelect={() => setSelectNumber(scout.id)}
              />
            ))}

            <ScrollBar className={style.scrollBar} />
          </ScrollArea>
        </div>
      </div>
      <div className={style.rightContainer}>
        <ScoutDetail name={"test"} self={"test"} mem1={"test"} tags={["test", "test"]} />
      </div>
    </div>
  );
};

export default ScoutListPage;
