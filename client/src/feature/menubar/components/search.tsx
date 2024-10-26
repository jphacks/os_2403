'use client'

import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import {
	Command,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from "@/components/ui/command";
import style from "./search.module.scss";

const universities = [
	{ value: "tokyo", label: "東京大学" },
	{ value: "kyoto", label: "京都大学" },
	{ value: "osaka", label: "大阪大学" },
	{ value: "tohoku", label: "東北大学" },
    { value: "tokyo", label: "東京大学" },
	{ value: "kyoto", label: "京都大学" },
	{ value: "osaka", label: "大阪大学" },
	{ value: "tohoku", label: "東北大学" },
	{ value: "nagoya", label: "名古屋大学" },
];

function Search() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={style.container}>
			<Command className={style.search} onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(false)}>
				<div className={style.inputWrapper}>
					<CommandInput className={style.input} placeholder="イベント・サークルを探す" />
				</div>
				{isOpen && (
					<div className={style.listWrapper}>
						<CommandList className={style.list}>
							<CommandEmpty>見つかりません。</CommandEmpty>
							<CommandGroup title="大学">
								{universities.slice(0, 5).map((university) => (
									<CommandItem
										key={university.label}
										value={university.label}
									>
										{university.label}
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