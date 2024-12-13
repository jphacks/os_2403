"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { accountTypeAtom, communityAtom } from "@/features/account/stores";
import { userAtom } from "@/features/account/stores";
import { Community } from "@/features/account/types/community";
import { User } from "@/features/account/types/user";
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai";
import { CircleChevronRight } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const [currentCommunity, setCurrentCommunity] = useAtom(communityAtom);
  const [_currentAccountType, setCurrentAccountType] = useAtom(accountTypeAtom);

  const get_base_url = `/${props.type}`;
  const api_url = `/${props.type}/signup`;
  const go_url = `/${props.type}/signup/tags`;

  const config = {
    user: {
      name: "ニックネーム",
      introduction: "自己紹介",
    },
    community: {
      name: "団体名",
      introduction: "団体紹介",
    },
  };

  const { name, introduction } = config[props.type] || {};

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

  const onSubmit = async (loginData: SignupForm) => {
    try {
      const signUpResponse = await apiClient.post(api_url, loginData);

      if (props.type === "user") {
        setCurrentAccountType("user");
        const uuid = signUpResponse.data.uuid;
        const response = await apiClient.get(`${get_base_url}/${uuid}`);
        const user: User = {
          uuid: response.data.uuid,
          name: response.data.name,
          email: response.data.email,
          img: response.data.img,
        };
        setCurrentUser(user);

        // Atomの状態確認
        console.log("Current User Atom after setting:", user);

        // 非同期更新後の状態を確認
        setTimeout(() => {
          console.log("Current User Atom after delay:", currentUser);
        }, 100);
      } else if (props.type === "community") {
        setCurrentAccountType("community");
        const uuid = signUpResponse.data.uuid;
        const response = await apiClient.get(`${get_base_url}/${uuid}`);
        const community: Community = {
          uuid: response.data.uuid,
          name: response.data.name,
          email: response.data.email,
          img: response.data.img,
        };
        setCurrentCommunity(community);

        // Atomの状態確認
        console.log("Current Community Atom after setting:", community);

        // 非同期更新後の状態を確認
        setTimeout(() => {
          console.log("Current Community Atom after delay:", currentCommunity);
        }, 100);
      }
      toast("サインインしました。");
      router.push(go_url);
    } catch (err) {
      console.error("Sign up error:", err);
      setTimeout(() => {
        toast.error("サインアップに失敗しました");
      }, 10);
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
                  <div className="relative w-full max-w-md">
                    <FormControl>
                      <Input
                        placeholder="パスワード"
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className={`${style.input} pr-12`}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
