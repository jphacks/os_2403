"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, { useState, useEffect } from "react";
import style from "./search.module.scss";

interface Datatype {
  label: string;
}

function Search({ data }: { data: Datatype[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentArray, setCurrentArray] = useState<Datatype[]>([]);

  useEffect(() => {
    const filtered = data.filter(datatype =>
      datatype.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setCurrentArray(filtered);
  }, [searchValue, data]);

  return (
    <div className={style.container}>
      <Command
        className={style.search}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        <CommandInput
          className={style.input}
          placeholder="イベント・サークルを探す"
          value={searchValue}
          onValueChange={setSearchValue}
        />
        {isOpen && (
          <div className={style.listWrapper}>
            <CommandList className={style.list}>
              <CommandEmpty className={style.empty}>見つかりません。</CommandEmpty>
              <CommandGroup title="検索">
                {currentArray.slice(0, 5).map(datatype => (
                  <CommandItem key={datatype.label} value={datatype.label} className={style.item}>
                    {datatype.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}

export default Search;
