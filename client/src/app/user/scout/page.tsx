"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { userAtom } from "@/features/account/stores";
import { getScoutCommunityDetail } from "@/features/scout/api";
import { ScoutCard } from "@/features/scout/components/ScoutCard";
import { ScoutDetail } from "@/features/scout/components/ScoutDetail";
import {
  updateScoutStatusForApprove,
  updateScoutStatusForReject,
} from "@/features/scout/funcs/updateScoutStatus";
import { GetCommunityDetailResponse, ScoutStatus } from "@/features/scout/types";
import { useAtom } from "jotai/index";
import React from "react";
import { toast } from "sonner";
import z from "zod";
import style from "./style.module.scss";

const scoutListSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  mem1: z.string(),
  tags: z.string().array().optional(),
  isLiked: z.boolean(),
});

type ScoutList = z.infer<typeof scoutListSchema>;

const ScoutListPage = () => {
  const [currentUser, _setCurrentUser] = useAtom(userAtom);
  const [scoutList, setScoutList] = React.useState<ScoutList[]>([]);
  const [selectNumber, setSelectNumber] = React.useState<number>();
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const generalToastTimeout = 500;

  const createScoutCommunityStruct = (data: GetCommunityDetailResponse[]): ScoutList[] => {
    return data
      .filter(item => item.status !== ScoutStatus.Reject)
      .map(item => ({
        id: item.id,
        uuid: item.uuid,
        name: item.detail_info.name,
        icon: item.detail_info.img,
        mem1: item.detail_info.mem1,
        tags: item.detail_info.tags,
        isLiked: false,
      }));
  };

  const fetchScoutList = async () => {
    if (!currentUser?.uuid) {
      setTimeout(() => {
        toast.error("サインインしてください");
      }, generalToastTimeout);
      return;
    }

    try {
      const getScoutCommunityDetailRes = await getScoutCommunityDetail(currentUser.uuid);

      if (!getScoutCommunityDetailRes) return;

      const scoutListData: ScoutList[] = createScoutCommunityStruct(getScoutCommunityDetailRes);
      setScoutList(scoutListData);

      setSelectNumber(scoutListData[0].id);
    } catch (error) {
      console.error(error);

      setTimeout(() => {
        toast.error("新着スカウトはありません");
      }, generalToastTimeout);
    }
  };

  const handleReject = async (id: number) => {
    if (!id) return;

    try {
      await updateScoutStatusForReject(id);
      setTimeout(() => {
        toast.warning("スカウトを辞退しました");
      }, 0);

      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error("更新に失敗しました");
    }
  };

  const handleApprove = async (id: number) => {
    if (!id) return;

    try {
      setScoutList(prevList =>
        prevList?.map(item => {
          if (item.id === id) {
            return { ...item, isLiked: !item.isLiked };
          }
          return item;
        }),
      );

      await updateScoutStatusForApprove(id);

      setTimeout(() => {
        toast.success("スカウトを承認しました!");
      }, 0);

      setRefreshTrigger(prev => prev + 1);
      await fetchScoutList();
    } catch (error) {
      console.error("更新に失敗しました: ", error);
    }
  };

  const selectIsLiked = scoutList?.find(item => item.id === selectNumber)?.isLiked;
  React.useEffect(() => {
    // updateScoutStatusForReaded(props?.id);
    fetchScoutList();
  }, [refreshTrigger]);

  return (
    <div className={style.topContainer}>
      <div className={style.leftContainer}>
        <h1 className={style.listHeader}>招待一覧</h1>
        <div className={style.scrollAreaContainer}>
          <ScrollArea type="scroll">
            {scoutList?.map(scout => (
              <ScoutCard
                key={scout.id}
                {...scout}
                isSelected={selectNumber === scout.id}
                isLiked={scout.isLiked}
                onSelect={() => setSelectNumber(scout.id)}
                handleReject={() => handleReject(scout.id)} // または onReject={handleReject}
                handleApprove={() => handleApprove(scout.id)}
              />
            ))}

            <ScrollBar className={style.scrollBar} />
          </ScrollArea>
        </div>
      </div>
      <div className={style.rightContainer}>
        {scoutList && scoutList.length > 0 ? (
          <ScoutDetail
            community_uuid={scoutList?.find(item => item.id === selectNumber)?.uuid ?? ""}
            isLiked={selectIsLiked ?? false}
            handleReject={() => handleReject(selectNumber ?? 0)}
            handleApprove={() => handleApprove(selectNumber ?? 0)}
            // isEmpty={scoutList.length === 0}
          />
        ) : (
          <div className={style.noScoutMessage}>スカウト情報がありません</div>
        )}
      </div>
    </div>
  );
};

export default ScoutListPage;
