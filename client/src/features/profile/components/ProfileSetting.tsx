"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import style from "@/features/profile/components/style.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleChevronRight } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";

const profileFormShema = z.object({
	nickname: z.string().min(1, { message: "入力必須な項目です。" }),
	belong_to1: z.string().min(1, { message: "入力必須な項目です。" }),
	belong_to2: z.string(),
	belong_to3: z.string(),
	mail: z.string().min(1, { message: "入力必須な項目です。" }),
	password: z.string().min(1, { message: "入力必須な項目です。" }),
	introduction: z.string(),
});

export const ProfileSetting = () => {
	const form = useForm<z.infer<typeof profileFormShema>>({
		resolver: zodResolver(profileFormShema),
		defaultValues: {
			nickname: "",
			belong_to1: "",
			belong_to2: "",
			belong_to3: "",
			mail: "",
			password: "",
			introduction: "",
		},
	});
	const onSubmit = (data: z.infer<typeof profileFormShema>) => {
		console.log("フォーム送信データ:", data);
	};

	return (
		<Card className={style.card}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle className={style.mobo}>プロフィール編集</CardTitle>
					</CardHeader>
					<CardContent>
						<FormField
							control={form.control}
							name="nickname"
							render={({ field }) => (
								<FormItem className={style.form}>
									<FormLabel className={style.label}>
										<span className={style.span}>*</span>ニックネーム
									</FormLabel>
									<FormControl>
										<Input
											placeholder="やまけん"
											{...field}
											className={style.input}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="belong_to1"
							render={({ field }) => (
								<FormItem className={style.form}>
									<FormLabel className={style.label}>
										<span className={style.span}>*</span>所属1
									</FormLabel>
									<FormControl>
										<Input
											placeholder="立命館大学"
											{...field}
											className={style.input}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="belong_to2"
							render={({ field }) => (
								<FormItem className={style.form}>
									<FormLabel className={style.label}>所属2</FormLabel>
									<FormControl>
										<Input
											placeholder="立命館大学"
											{...field}
											className={style.input}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="belong_to3"
							render={({ field }) => (
								<FormItem className={style.form}>
									<FormLabel className={style.label}>所属3</FormLabel>
									<FormControl>
										<Input
											placeholder="立命館大学"
											{...field}
											className={style.input}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="mail"
							render={({ field }) => (
								<FormItem className={style.form}>
									<FormLabel className={style.label}>
										<span className={style.span}>*</span>メールアドレス
									</FormLabel>
									<FormControl>
										<Input
											placeholder="e-mail"
											{...field}
											className={style.input}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className={style.form}>
									<FormLabel className={style.label}>
										<span className={style.span}>*</span>パスワード
									</FormLabel>
									<FormControl>
										<Input
											placeholder="text"
											{...field}
											className={style.input}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<br />
						<br />

						<FormField
							control={form.control}
							name="introduction"
							render={({ field }) => (
								<FormItem className={style.form}>
									<FormLabel className={style.label}>自己紹介</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Text"
											{...field}
											className={style.input}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<br />
					<br />
					<CardFooter className={style.cardFooter}>
						<Button type="submit" className={style.button}>
							プロフィール更新
							<CircleChevronRight />
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
};
