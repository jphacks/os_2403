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
import { Textarea } from "@/components/ui/textarea";
import style from "@/feature/profile/components/style.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleChevronRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Community, communityAtom } from "@/domain/community";
import { User, userAtom } from "@/domain/user";
import { uploadImageToS3 } from "@/lib/utils";
import { apiClient } from "@/utils/client";
import { useAtom } from "jotai/index";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileFormShema = z.object({
  name: z.string().min(1, { message: "入力必須な項目です。" }),
  mem1: z.string().min(1, { message: "入力必須な項目です。" }),
  mem2: z.string().optional(),
  mem3: z.string(),
  img: z.string(),
  email: z.string().min(1, { message: "入力必須な項目です。" }),
  self: z.string(),
});

type PrpfileSettingProps = {
  type: "user" | "community";
};

export const ProfileSetting = (props: PrpfileSettingProps) => {
  let name = "";
  let introduce = "";
  if (props.type === "user") {
    name = "ニックネーム";
    introduce = "自己紹介";
  } else if (props.type === "community") {
    name = "団体名";
    introduce = "団体紹介";
  }

  const [currentUser, setCurrentUser] = useAtom(userAtom);
  const [currentCommunity, setCurrentCommunity] = useAtom(communityAtom);
  const [preview, setPreview] = React.useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof profileFormShema>>({
    resolver: zodResolver(profileFormShema),
    defaultValues: {
      name: "",
      mem1: "",
      mem2: "",
      mem3: "",
      img: "",
      email: "",
      self: "",
    },
  });
  const onIconChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (file) {
      const url = await uploadImageToS3(file);
      console.log(url);
      if (url) {
        form.setValue("img", url);
        setPreview(url);
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof profileFormShema>): Promise<void> => {
    if (props.type === "user" && currentUser?.uuid !== undefined) {
      const user: User = {
        uuid: currentUser?.uuid,
        name: data?.name,
        mem1: data?.mem1,
        mem2: data?.mem2,
        mem3: data?.mem3,
        self: data?.self,
        img: data?.img,
        email: data?.email,
      };
      await apiClient.put(`/user/${currentUser?.uuid}`, user);

      //扱うのはuuidとnameとimgのみ
      const setUser: User = {
        uuid: currentUser?.uuid,
        name: data?.name,
        img: data?.img,
      };
      setCurrentUser(setUser);
      router.push("/event");
    } else if (props.type === "community" && currentCommunity?.uuid !== "") {
      const community: Community = {
        uuid: currentCommunity?.uuid,
        name: data?.name,
        mem1: data?.mem1,
        mem2: data?.mem2,
        mem3: data?.mem3,
        self: data?.self,
        img: data?.img,
        email: data?.email,
      };
      await apiClient.put(`/community/${currentCommunity?.uuid}`, community);
      console.log(community);

      //扱うのはuuidとnameとimgのみ
      const setCommunity: Community = {
        uuid: currentCommunity?.uuid,
        name: data?.name,
        img: data?.img,
      };
      setCurrentCommunity(setCommunity);
      router.push("/event");
    }
  };

  React.useEffect(() => {
    if (props.type === "user" && currentUser?.uuid) {
      apiClient.get(`/user/${currentUser?.uuid}`).then(res => {
        console.log(res.data);
        form.reset({
          name: res.data.name,
          mem1: res.data.mem1,
          mem2: res.data.mem2,
          mem3: res.data.mem3,
          img: res.data.img,
          email: res.data.email,
          self: res.data.self,
        });
        setPreview(res.data.img);
      });
    } else if (props.type === "community" && currentCommunity?.uuid) {
      apiClient.get(`/community/${currentCommunity?.uuid}`).then(res => {
        // console.log(res.data);
        form.reset({
          name: res.data.name,
          mem1: res.data.mem1,
          mem2: res.data.mem2,
          mem3: res.data.mem3,
          img: res.data.img,
          email: res.data.email,
          self: res.data.self,
        });
        setPreview(res.data.img);
      });
    }
  }, [currentUser, currentCommunity, props.type, form]);

  return (
    <Card className={style.card}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className={style.mobo}>{name}編集</CardTitle>
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
              name="img"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem className={style.form}>
                  <FormLabel>アイコン</FormLabel>
                  <div className={style.avatorForm}>
                    {preview ? (
                      <Avatar className={style.avatorPreview}>
                        <AvatarImage src={preview} />
                        <AvatarFallback>BU</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarImage />
                        <AvatarFallback>BU</AvatarFallback>
                      </Avatar>
                    )}
                    <FormControl className={style.avatorFormControl}>
                      <Input
                        type="file"
                        {...field}
                        className={style.avatorinput}
                        onChange={onIconChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
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

            <br />
            <br />

            <FormField
              control={form.control}
              name="self"
              render={({ field }) => (
                <FormItem className={style.form}>
                  <FormLabel className={style.label}>{introduce}</FormLabel>
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
              プロフィール更新
              <CircleChevronRight />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
