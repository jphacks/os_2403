"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { User, userAtom } from "@/domain/user";
import { createUser } from "@/feature/signup/hook/signup";
import { apiClient } from "@/utils/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai/index";
import { CircleChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import react, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import style from "./style.module.scss";

type SignUpProps = {
  type: "user" | "community";
};

const SignupFormSchema = z.object({
  name: z.string().min(1, { message: "入力必須な項目です。" }),
  mem1: z.string().min(1, { message: "入力必須な項目です。" }),
  mem2: z.string(),
  mem3: z.string(),
  img: z.string(),
  email: z.string().min(1, { message: "入力必須な項目です。" }),
  password: z.string().min(1, { message: "入力必須な項目です。" }),
  self: z.string(),
});

type SignupForm = z.infer<typeof SignupFormSchema>;

export const SignUpDialog = (props: SignUpProps) => {
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const router = useRouter();

  let name = "";
  let introduction = "";
  let api_url = "";
  let go_url = "";
  if (props.type === "user") {
    name = "ニックネーム";
    introduction = "自己紹介";
    api_url = "/user/signup";
    go_url = "/signin/user";
  } else if (props.type === "community") {
    name = "団体名";
    introduction = "団体紹介";
    api_url = "/community/signup";
    go_url = "/signin/community";
  }

  const form = useForm<SignupForm>({
    // resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      mem1: "",
      mem2: "",
      mem3: "",
      email: "",
      password: "",
      self: "",
    },
  });

  const onSubmit = async (signupData: SignupForm) => {
    try {
      await apiClient.post(api_url, signupData);
      router.push(go_url);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={style.card}>
          <CardHeader>
            <CardTitle className={style.mobo}>新規会員登録</CardTitle>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className={style.form}>
                  <FormLabel className={style.label}>
                    <span className={style.span}>*</span>
                    {name}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="やまけん" {...field} className={style.input} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mem1"
              render={({ field }) => (
                <FormItem className={style.form}>
                  <FormLabel className={style.label}>
                    <span className={style.span}>*</span>所属1
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="立命館大学" {...field} className={style.input} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mem2"
              render={({ field }) => (
                <FormItem className={style.form}>
                  <FormLabel className={style.label}>所属2</FormLabel>
                  <FormControl>
                    <Input placeholder="立命館大学" {...field} className={style.input} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mem3"
              render={({ field }) => (
                <FormItem className={style.form}>
                  <FormLabel className={style.label}>所属3</FormLabel>
                  <FormControl>
                    <Input placeholder="立命館大学" {...field} className={style.input} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={style.form}>
                  <FormLabel className={style.label}>
                    <span className={style.span}>*</span>メールアドレス
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e-mail" {...field} className={style.input} />
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
                    <Input placeholder="text" {...field} className={style.input} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <br />
            <br />

            <FormField
              control={form.control}
              name="self"
              render={({ field }) => (
                <FormItem className={style.form}>
                  <FormLabel className={style.label}>{introduction}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Text" {...field} className={style.input} />
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
              新規会員登録
              <CircleChevronRight />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
