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
import { CircleChevronRight } from "lucide-react";
import Link from "next/link";
import style from "./style.module.scss";

type LoginCardProps = {
	title: string;
};

export const LoginDialog = (props: LoginCardProps) => {
	return (
		<Card className={style.form}>
			<CardHeader className={style.title}>
				<CardTitle className={style.mobo}>{props.title}</CardTitle>
			</CardHeader>
			<div className={style.login}>
				<CardContent>
					<form>
						<Label htmlFor="mail">メールアドレス</Label>
						<Input
							type="email"
							placeholder="メールアドレスを入力してください"
							className={style.input}
						/>
						<Label htmlFor="password">パスワード</Label>
						<Input
							type="password"
							placeholder="パスワードを入力してください"
							className={style.input}
						/>
						<Link href="">
							<div className={style.flex}>
								<CircleChevronRight />
								パスワードを忘れですか？
							</div>
						</Link>
					</form>
				</CardContent>
				<CardFooter>
					{/*<div className={style.center}>*/}
					<Button className={style.button}>
						ログインする
						<CircleChevronRight />
					</Button>
					{/*</div>*/}
				</CardFooter>
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
						イベント・サークル運営者の方はこちら
					</div>
				</Link>
			</div>

			<br />
		</Card>
	);
};
