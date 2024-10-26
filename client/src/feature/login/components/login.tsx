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
import react from "react";

type LoginCardProps = {
	// title: string;
	type: "user" | "community";
};

// const loginForm = z.object({
// 	mail: z.string().min(1, { message: "メールアドレスを入力してください。" }),
// 	password: z.string().min(1, { message: "パスワードを入力してください。" }),
// });

export const LoginDialog = (props: LoginCardProps) => {
	const [currentUser, setCurrentUser] = useAtom<User | null>(userAtom);
	const router = useRouter();

	react.useEffect(() => {
		console.log("currentUser updated:", currentUser);
	}, [currentUser]);

	let title = "";
	let alternative = "";
	if (props.type === "user") {
		title = "利用者ログイン";
		alternative = "イベント・サークル運営者の方はこちら";
	} else if (props.type === "community") {
		title = "イベント・サークル運営者ログイン";
		alternative = "利用者の方はこちら";
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
			await apiClient.post("/user/signin", data);

			const response = await apiClient.post("/user/signin", data);

			const user: User = {
				uuid: response.data.uuid,
			};
			setCurrentUser(user);

			router.push("/");
		} catch (err) {
			console.error(err);
		}
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
					<Button className={style.button}>
						新規会員登録
						<CircleChevronRight />
					</Button>
				</CardFooter>

				<br />
				<br />
				<Link href="">
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
