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
import { Community, communityAtom } from "@/domain/community";
import { accountTypeAtom } from "@/domain/general";
import { User, userAtom } from "@/domain/user";
import { apiClient } from "@/utils/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai/index";
import { CircleChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import react, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import style from "./style.module.scss";

type LoginCardProps = {
  // title: string;
  type: "user" | "community";
};

const LoginFormSchema = z.object({
  email: z.string().min(1, { message: "入力必須な項目です。" }),
  password: z.string().min(1, { message: "入力必須な項目です。" }),
});

type LoginForm = z.infer<typeof LoginFormSchema>;

export const SignInDialog = (props: LoginCardProps) => {
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const [currentCommunity, setCurrentCommunity] = useAtom(communityAtom);
  const [currentAccountType, setCurrentAccountType] = useAtom(accountTypeAtom);
  const router = useRouter();

  react.useEffect(() => {
    console.log("currentUser updated:", currentUser);
    console.log("currentCommunity updated:", currentCommunity);
  }, [currentUser, currentCommunity]);

  let title = "";
  let alternative = "";
  let get_base_url = "";
  let signin_url = "";
  let signup_url = "";
  let link = "";
  if (props.type === "user") {
    title = "ユーザーログイン";
    alternative = "イベント・サークル運営者の方はこちら";
    get_base_url = "/user";
    signin_url = "/user/signin";
    signup_url = "/signup/user";
    link = "/signin/community";
  } else if (props.type === "community") {
    title = "イベント・サークル運営者ログイン";
    alternative = "ユーザーの方はこちら";
    get_base_url = "/community";
    signin_url = "/community/signin";
    signup_url = "/signup/community";
    link = "/signin/user";
  }

  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (loginData: LoginForm) => {
    try {
      // await apiClient.post(api_url, data);
      const signInResponse = await apiClient.post(signin_url, loginData);

      if (props.type === "user") {
        setCurrentAccountType("user");
        const uuid = signInResponse.data.uuid;
        const response = await apiClient.get(`${get_base_url}/${uuid}`);
        console.log(response);
        const user: User = {
          uuid: response.data.uuid,
          name: response.data.name,
          email: response.data.email,
          img: response.data.img,
        };
        setCurrentUser(user);
      } else if (props.type === "community") {
        setCurrentAccountType("community");
        const uuid = signInResponse.data.uuid;
        const response = await apiClient.get(`${get_base_url}/${uuid}`);
        console.log(response);
        const community: Community = {
          uuid: response.data.uuid,
          name: response.data.name,
          email: response.data.email,
          img: response.data.img,
        };
        setCurrentCommunity(community);
      }

      router.push("/event");
      toast("サインインしました。");
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
                        type="password"
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
        <CardDescription>イベント招待を受け取るには会員登録が必要です。</CardDescription>
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
