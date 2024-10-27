"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
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
import { Label } from "@/components/ui/label";
import { LoginForm, LoginFormSchema, User, userAtom } from "@/domain/user";
import { apiClient } from "@/utils/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai/index";
import { CircleChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import style from "./style.module.scss";
import react, { useState } from "react";
import { Community } from "@/domain/community";

type LoginCardProps = {
	// title: string;
	type: "user" | "community";
};

export const LoginDialog = (props: LoginCardProps) => {
	const [currentUser, setCurrentUser] = useAtom<User | null>(userAtom);
	const [currentCommunity, setCurrentCommunity] = useState<Community | null>();
	const router = useRouter();

	react.useEffect(() => {
		console.log("currentUser updated:", currentUser);
		console.log("currentCommunity updated:", currentCommunity);
	}, [currentUser, currentCommunity]);

	let title = "";
	let alternative = "";
	let api_url = "";
	let signup_url = "";
	let link = "";
	if (props.type === "user") {
		title = "利用者ログイン";
		alternative = "イベント・サークル運営者の方はこちら";
		api_url = "/user/signin";
		signup_url = "/signup/user";
		link = "/login/community";
	} else if (props.type === "community") {
		title = "イベント・サークル運営者ログイン";
		alternative = "利用者の方はこちら";
		api_url = "/community/signin";
		signup_url = "/signup/community";
		link = "/login/user";
	}

	const form = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
		try {
			// await apiClient.post(api_url, data);

			const response = await apiClient.post(api_url, data);

			if (props.type === "user") {
				const user: User = {
					uuid: response.data.uuid,
				};
				setCurrentUser(user);
			} else if (props.type === "community") {
				const community: Community = {
					uuid: response.data.uuid,
				};
				setCurrentCommunity(community);
			}

			router.push("/");
		} catch (err) {
			console.error(err);
		}
	};

	const onClick = () => {
		router.push(signup_url);
	};

	return (
		<Card className={style.card}>
			<CardHeader className={style.title}>
				<CardTitle className={style.mobo}>{title}</CardTitle>
			</CardHeader>
			<div className={style.login}>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>メールアドレス</FormLabel>
										<FormControl>
											<Input
												placeholder="メールアドレスを入力してください"
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
									<FormItem>
										<FormLabel>パスワード</FormLabel>
										<FormControl>
											<Input
												placeholder="パスワードを入力してください"
												{...field}
												className={style.input}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<br />
							<Link href="" className={style.link}>
								<div className={style.flex}>
									<CircleChevronRight />
									パスワードを忘れですか？
								</div>
							</Link>
						</CardContent>
						<CardFooter>
							{/*<div className={style.center}>*/}
							<Button className={style.button}>
								ログインする
								<CircleChevronRight />
							</Button>
							{/*</div>*/}
						</CardFooter>
					</form>
				</Form>
			</div>

			<div className={style.signup}>
				<br />
				<br />
				<h1 className={style.heading}>はじめての方はこちら</h1>
				<CardDescription>
					イベント招待を受け取るには会員登録が必要です。
				</CardDescription>
				<br />
				<br />
				<CardFooter className={style.cardFot}>
					<Button className={style.button} onClick={onClick}>
						新規会員登録
						<CircleChevronRight />
					</Button>
				</CardFooter>

				<br />
				<br />
				<Link href={link}>
					<div className={style.flex}>
						<CircleChevronRight />
						{alternative}
					</div>
				</Link>
			</div>

			<br />
		</Card>
	);
};
