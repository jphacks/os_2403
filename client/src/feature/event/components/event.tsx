"use client";

import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import style from "./style.module.scss";
import { Textarea } from "@/components/ui/textarea";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import TagButton from "@/components/tags/tag-button";
import { yellow } from "next/dist/lib/picocolors";
import { cn } from "@/lib/utils";
import { createEvent } from "@/feature/event/hooks/event";

const tags = [
	{ label: "英語", value: "英語" },
	{ label: "プログラミング", value: "プログラミング" },
	{ label: "数学", value: "数学" },
	{ label: "経済", value: "経済" },
	{ label: "心理学", value: "心理学" },
	{ label: "統計", value: "統計" },

	{ label: "音楽", value: "音楽" },
	{ label: "バンド", value: "バンド" },
	{ label: "演劇", value: "演劇" },
	{ label: "ダンス", value: "ダンス" },
	{ label: "合唱", value: "合唱" },
	{ label: "写真", value: "写真" },
	{ label: "映画", value: "映画" },
	{ label: "アート", value: "アート" },

	{ label: "サッカー", value: "サッカー" },
	{ label: "バスケ", value: "バスケ" },
	{ label: "テニス", value: "テニス" },
	{ label: "バレー", value: "バレー" },
	{ label: "野球", value: "野球" },
	{ label: "陸上", value: "陸上" },

	{ label: "ボランティア", value: "ボランティア" },
	{ label: "国際交流", value: "国際交流" },
	{ label: "起業", value: "起業" },
	{ label: "旅行", value: "旅行" },
	{ label: "料理", value: "料理" },
	{ label: "読書", value: "読書" },
	{ label: "ゲーム", value: "ゲーム" },
	{ label: "アニメ", value: "アニメ" },
	{ label: "漫画", value: "漫画" },
];

export const EventSettingSchema = z.object({
	eventName: z.string().min(1, { message: "入力必須です。" }),
	img: z.string().min(1, { message: "入力必須です。" }),
	eventDay: z.date(),
	tags: z.string().array(),
	detail: z.string(),
});

export type EventSettingRequest = z.infer<typeof EventSettingSchema>;

export const DatePickerField = () => {
	const form = useForm<z.infer<typeof EventSettingSchema>>({
		resolver: zodResolver(EventSettingSchema),
	});

	const onSubmit = async (data: z.infer<typeof EventSettingSchema>) => {
		const response = createEvent(data);
		console.log(response.data);
	};

	return (
		<div className={style.all}>
			<h1 className={style.heading}>イベント作成</h1>
			<br className={style.br} />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="eventName"
						render={({ field }) => (
							<FormItem className={style.form}>
								<FormLabel className={style.label}>イベント名</FormLabel>
								<FormControl>
									<Input placeholder="Text" {...field} className={style.form} />
								</FormControl>
								<FormMessage className={style.errorMessage} />
							</FormItem>
						)}
					/>
					<br />
					<FormField
						control={form.control}
						name="img"
						render={({ field }) => (
							<FormItem className={style.form}>
								<FormLabel className={style.label}>画像</FormLabel>
								<FormControl>
									<Input placeholder="Text" {...field} className={style.form} />
								</FormControl>
								<FormMessage className={style.errorMessage} />
							</FormItem>
						)}
					/>
					<br />

					<FormField
						control={form.control}
						name="tags"
						render={({ field }) => (
							<FormItem className={style.tag}>
								<FormLabel className={style.label}>
									タグ（3つまで選択可能）
								</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												// role="combobox"
												className={style.button}
											>
												{field.value?.length > 0
													? `${field.value.length}個のタグを選択中`
													: "タグを選択"}
												<ChevronsUpDown />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent>
										<Command>
											<CommandInput placeholder="タグを検索..." />
											<CommandList>
												<CommandEmpty>タグが見つかりません</CommandEmpty>
												<CommandGroup>
													{tags.map((tag) => (
														<CommandItem
															value={tag.label}
															key={tag.value}
															onSelect={() => {
																const currentTags = field.value || [];
																const isSelected = currentTags.includes(
																	tag.value,
																);

																if (isSelected) {
																	// タグを削除
																	form.setValue(
																		"tags",
																		currentTags.filter(
																			(value) => value !== tag.value,
																		),
																	);
																} else if (currentTags.length < 3) {
																	// タグを追加（3つまで）
																	form.setValue("tags", [
																		...currentTags,
																		tag.value,
																	]);
																}
															}}
														>
															{/*<Check*/}
															{/*	className={cn(*/}
															{/*		"mr-2 h-4 w-4",*/}
															{/*		field.value?.includes(tag.value)*/}
															{/*			? "opacity-100"*/}
															{/*			: "opacity-0",*/}
															{/*	)}*/}
															{/*/>*/}
															{tag.label}
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<div className={style.tagRow}>
									{field.value?.map((tagValue) => (
										<div
											key={tagValue}
											// className={style.label}
											className={style.yellow}
										>
											{tags.find((tag) => tag.value === tagValue)?.label}
										</div>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="eventDay"
						render={({ field }) => (
							<FormItem className={style.date}>
								<div className={style.label}>
									<FormLabel>開催日時</FormLabel>
								</div>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button variant={"outline"} className={style.button}>
												{/*<CalendarIcon className={style.icon} />*/}
												<span> </span>
												{field.value ? (
													format(field.value, "yyyy-MM-dd")
												) : (
													<span className={style.black}>yyyy-mm-dd</span>
												)}
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) => date < new Date()}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage className={style.dateErrorMessage} />
							</FormItem>
						)}
					/>
					<br />
					<FormField
						control={form.control}
						name="detail"
						render={({ field }) => (
							<FormItem className={style.form}>
								<FormLabel className={style.label}>詳細</FormLabel>
								<FormControl>
									<Textarea
										placeholder="詳細"
										{...field}
										className={style.form}
									/>
								</FormControl>
								<FormMessage className={style.errorMessage} />
							</FormItem>
						)}
					/>
					<div className={style.submit}>
						<Button type="submit">Submit</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
