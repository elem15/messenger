import { IMessageType } from "@/types/messanger"
import { CurrentUser } from "src/components/Messenger"
import { Typography } from "@/common/typography/typography"
import s from './Dialogs.module.scss'
import { useTranslation } from "@/lib/hooks/useTranslation"
import { TimeAgo } from "@/common/time-ago"
import { Scroller } from "@/common/scroller/Scroller"
import {useEffect, useRef} from "react";

type Props = {
  currentUser: CurrentUser | null
  dialogUser: IMessageType[]
}
export const Dialogs = ({currentUser, dialogUser}: Props) => {
  const { t } = useTranslation()

  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dialogUser]);

  return (
    <>
      {currentUser ? 
        <Scroller>
          <div className="grid justify-items-end">
            {dialogUser?.filter((msg: IMessageType) => currentUser.userId === msg.receiverId)
              .reverse()
              .map((msg: IMessageType) => {
                return (
                  <div key={msg.id} className={s.messageOwner} ref={lastMessageRef}>
                    <Typography>{msg.messageText}</Typography>
                    <Typography className="flex justify-end w-full" variant={"small_text"}>
                      <TimeAgo lg={t.lg} updatedAt={msg.updatedAt}/>
                    </Typography>
                  </div>
                ) 
              })}
          </div>
        </Scroller> 
        :
        <div className={s.change}>
          <Typography>Выберите, кому хотели бы написать</Typography>
        </div>
      }
    </>
  )
}