"use client";
import CardTag from "@/components/tags/card-tag";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import style from "./style.module.scss";

type TagCardProps = {
  className?: string;
};

export const TagCard = ({ className }: TagCardProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/event");
  };
  return (
    <Card className={`${style.register_tag} ${className ? className : ""}`}>
      <CardHeader className={style.header}>
        <CardTitle className={style.title}>タグを探してみよう！</CardTitle>
        <CardDescription className={style.description}>
          気になるタグを3個以上選んでみよう！
        </CardDescription>
      </CardHeader>
      <CardContent className={style.content}>
        <CardTag key="1" variant="red" className={style.tag1}>
          test
        </CardTag>
        <CardTag key="2" variant="blue" className={style.tag2}>
          test
        </CardTag>
        <CardTag key="3" variant="green" className={style.tag3}>
          test
        </CardTag>
        <CardTag key="4" variant="blue" className={style.tag1}>
          test
        </CardTag>
        <CardTag key="5" variant="blue" className={style.tag2}>
          test
        </CardTag>
        <CardTag key="6" variant="red" className={style.tag1}>
          test
        </CardTag>
        <CardTag key="7" variant="red" className={style.tag1}>
          test
        </CardTag>
        <CardTag key="8" variant="red" className={style.tag3}>
          test
        </CardTag>
        <CardTag key="9" variant="red" className={style.tag1}>
          test
        </CardTag>
        <CardTag key="10" variant="blue" className={style.tag2}>
          test
        </CardTag>
        <CardTag key="11" variant="red" className={style.tag3}>
          test
        </CardTag>
        <CardTag key="12" variant="red" className={style.tag1}>
          test
        </CardTag>
      </CardContent>
      <CardFooter className={style.footer}>
        <Button onClick={onClick} className={style.button}>
          これが気に入った！
        </Button>
      </CardFooter>
    </Card>
  );
};
