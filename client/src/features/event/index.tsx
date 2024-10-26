'use client'

import type { ReactElement } from "react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import CardTag from "@/components/tags/card-tag"
import {  Heart, SquareX } from "lucide-react"
import style from "./style.module.scss"


type TagVariant = "red" | "blue" | "green" | "gray"

interface Tag {
  id: string
  label: string
  variant?: TagVariant
}

interface EventCardProps {
  title: string
  publisher: string
  datetime: string
  tags: Tag[]
  imageUrl?: string
  liked?: boolean
  bookmarked?: boolean
}


export function EventCard({
  title,
  publisher,
  datetime,
  tags,
  imageUrl = "https://github.com/shadcn.png",
  liked = false,
}: EventCardProps): ReactElement {
  const [isLiked, setIsLiked] = useState(liked)

  return (

    <Card className={style.card}>
      <CardHeader className={style.cardHeader}>
        <div className={style.tagWrapper}>
          <div className={style.tags}>
            {tags.map((tag) => (
              <CardTag key={tag.id} variant={tag.variant ?? "red"}>
                {tag.label}
              </CardTag>
            ))}
          </div>
        </div>
        <div className={style.closeButton}>
          <SquareX size={24} stroke="#434141" onClick={() => console.log("delete")} />
        </div>
      </CardHeader>

      <CardContent>
        <div className={style.imgBox}>
          <img
            className={style.img}
            src={imageUrl}
            alt={title}
          />
        </div>
        <div className={style.icons}>
          <Heart
            size={32}
            fill={isLiked ? "#E74C3C" : "none"}
            stroke="#E74C3C"
            onClick={() => setIsLiked(!isLiked)}
          />
        </div>

        <h3 className="mt-4 mb-4 text-lg font-semibold">{title}</h3>
      </CardContent>
      <CardFooter className={style.cardFooter}>
        <div className={style.footerContent}>
          <div className={style.footerInfo}>
            <div className={style.publisherRow}>
              <Avatar className={style.avatar}>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className={style.publisherName}>{publisher}</span>
            </div>
            <time className={style.dateDisplay}>{datetime}</time>
          </div>
        </div>
      </CardFooter>
    </Card >
  )
}