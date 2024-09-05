import {IMessageType} from "@/types/messenger"
import {CurrentUser} from "src/components/Messenger"
import {Typography} from "@/common/typography/typography"
import s from './Dialogs.module.scss'
import {Scroller} from "@/common/scroller/Scroller"
import {useEffect, useRef, useState} from "react";
import {clsx} from "clsx";
import {useFormatDate} from "@/lib/hooks/useFormatDate";
import {AvatarSmallView} from "@/common/avatar";
import DoneAllOutline from "@/assets/icons/DoneAllOutline";
import CheckmarkOutline from "@/assets/icons/CheckmarkOutline";
import {StatusMessage} from "@/types/enum";
import {useOnReadMessageMutation} from "@/app/api/messenger/messengerApi";

type Props = {
  currentUser: CurrentUser | null
  dialogUser: IMessageType[]
  language: 'en' | 'ru'
}
export const Dialogs = ({currentUser, dialogUser, language}: Props) => {
  const myId = Number(localStorage.getItem("userId"))
  const accessToken = localStorage.getItem('token-remote');

  const [messageIds, setMessageIds] = useState<number[]>([]);
  const [getChangeStatus] = useOnReadMessageMutation()

  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    if (dialogUser?.length > 0) {
      const ids = dialogUser.reduce((acc: number[], msg) => {
        if (msg.ownerId !== myId && [StatusMessage.RECEIVED, StatusMessage.SENT].includes(msg.status)) {
          acc.push(msg.id);
        }

        return acc;
      }, []);

      setMessageIds(ids);
    }
  }, [dialogUser])

  useEffect(() => {
      if (messageIds?.length > 0) {
        getChangeStatus({accessToken, body: {'ids': messageIds}})
      }
  }, [messageIds]);

  const setCheckMark = (status: StatusMessage) => {
      if (status === StatusMessage.SENT) return <CheckmarkOutline fill={'white'} />
      if (status === StatusMessage.RECEIVED) return <DoneAllOutline fill={'white'} />
      if (status === StatusMessage.READ) return <DoneAllOutline />
  }

  return (
    <Scroller>
      <div className={s.messagesSide}>
        {dialogUser?.map((msg: IMessageType) => {
            return (
              <div key={msg.id} className="flex gap-1.5 mb-5">
                {msg.ownerId !== myId && <AvatarSmallView avatarOwner={currentUser.avaUrl} className="h-fit mt-auto"/>}
                <div key={msg.id} className={clsx(s.messageOwner, msg.ownerId === myId && s.rightSide)}
                     ref={lastMessageRef}>
                  <Typography>{msg.messageText}</Typography>
                  <div className="flex gap-1 items-center">
                    <Typography className={s.messageAndDateIde} variant={"small_text"}>
                      {useFormatDate(msg.updatedAt, language)}
                    </Typography>
                    {msg.ownerId === myId && setCheckMark(msg.status)}
                  </div>
                </div>
              </div>
            )
        }).reverse()}
      </div>
    </Scroller>
  )
}