import { z } from "zod";
import style from "./style.module.scss";

import { EventSetting } from "@/feature/event/components/event";

const EventSettingSchema = z.object({
  // eventName: z.string().min(1, { message: "入力必須です。" }),
  // img: z.string().min(1, { message: "入力必須です。" }),
  eventDay: z.date(),
  // tag: z.string().array(),
  // detail: z.string(),
});

const EventSettingPage = () => {
  return (
    <div className={style.background}>
      <EventSetting />
    </div>
  );
};

export default EventSettingPage;
