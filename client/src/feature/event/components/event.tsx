"use client";

import TagButton from "@/components/tags/tag-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { communityAtom } from "@/domain/community";
import { accountTypeAtom } from "@/domain/general";
import { cn, uploadImageToS3 } from "@/lib/utils";
import { apiClient } from "@/utils/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useAtom } from "jotai/index";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { yellow } from "next/dist/lib/picocolors";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import style from "./style.module.scss";

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
  community_uuid: z.string(),
  title: z.string().min(1, { message: "入力必須です。" }),
  img: z.string().min(1, { message: "入力必須です。" }),
  date: z.date(),
  tag: z.string().array(),
  detailed: z.string(),
});

export type EventSettingRequest = z.infer<typeof EventSettingSchema>;

export const EventSetting = () => {
  const [currentCommunity] = useAtom(communityAtom);
  const [currentAccountType] = useAtom(accountTypeAtom);
  const [previewImg, setPreviewImg] = React.useState("");

  const router = useRouter();

  const form = useForm<EventSettingRequest>({
    resolver: zodResolver(EventSettingSchema),
    defaultValues: {
      community_uuid: currentCommunity?.uuid,
      title: "",
      img: "",
      date: undefined,
      tag: [],
      detailed: "",
    },
  });

  const onImgChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const imgFile = event.target.files?.[0];
    if (imgFile) {
      const imgURL = await uploadImageToS3(imgFile);
      if (imgURL) {
        form.setValue("img", imgURL);
        toast("イメージをアップロードしました");
        setPreviewImg(imgURL);
      }
    }
  };

  const onSubmit = async (event: EventSettingRequest): Promise<void> => {
    apiClient.post("/createdevent", event).then(() => {
      router.push("/event");
      toast("イベントを作成しました");
    });
  };

  React.useEffect((): void => {
    if (!currentCommunity?.uuid || currentAccountType === "not" || currentAccountType === "user") {
      router.push("/signin/community");
    }
  });
  return (
    <div className={style.all}>
      <h1 className={style.heading}>イベント作成</h1>
      <br className={style.br} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
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
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem className={style.form}>
                <FormLabel className={style.label}>画像</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder="Text"
                    onChange={onImgChange}
                    {...field}
                    className={style.form}
                  />
                </FormControl>
                <FormMessage className={style.errorMessage} />
              </FormItem>
            )}
          />
          <div>
            {previewImg ? (
              <img src={previewImg} alt="" className={style.img} />
            ) : (
              <div>
                {/*空やばいので修正要*/}
                <img src={""} alt="" />
              </div>
            )}
          </div>
          <br />

          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem className={style.tag}>
                <FormLabel className={style.label}>タグ（3つまで選択可能）</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={style.button}>
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
                          {tags.map(tag => (
                            <CommandItem
                              value={tag.label}
                              key={tag.value}
                              onSelect={() => {
                                const currentTags = field.value || [];
                                const isSelected = currentTags.includes(tag.value);

                                if (isSelected) {
                                  // タグを削除
                                  form.setValue(
                                    "tag",
                                    currentTags.filter(value => value !== tag.value),
                                  );
                                } else if (currentTags.length < 3) {
                                  // タグを追加（3つまで）
                                  form.setValue("tag", [...currentTags, tag.value]);
                                }
                              }}
                            >
                              {tag.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className={style.tagRow}>
                  {field.value?.map(tagValue => (
                    <div
                      key={tagValue}
                      // className={style.label}
                      className={style.yellow}
                    >
                      {tags.find(tag => tag.value === tagValue)?.label}
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={date => date < new Date()}
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
            name="detailed"
            render={({ field }) => (
              <FormItem className={style.form}>
                <FormLabel className={style.label}>詳細</FormLabel>
                <FormControl>
                  <Textarea placeholder="詳細" {...field} className={style.form} />
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
