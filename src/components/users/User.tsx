import { AvatarSmallView } from '@/common/avatar'
import { Typography } from '@/common/typography/typography'
import s from './UStyles.module.scss'
import { Avatar } from '@/types/messenger'
import { CurrentUser } from 'src/components/Messenger'
import { useGetUserNameQuery } from '@/app/api/users/usersApi'
import {Dispatch, useEffect, useState} from 'react'
import {useFormatDate} from "@/lib/hooks/useFormatDate";
import {StatusMessage} from "@/types/enum";
import {useLazyGetMessengerByIdQuery} from "@/app/api/messenger/messengerApi";

type Props = {
  receiverId: number
  userName: string
  text: string
  dateMessage: string
  avatar: Avatar[]
  setCurrentUser: ({userId, avaUrl, name: {firstName, lastName}}: CurrentUser) => void
  setReceiverId: (value: number) => void
  setIsFetchUser: Dispatch<(prev: boolean) => boolean>
  setIsLoadingDialog: Dispatch<boolean>
  language: 'en' | 'ru'
}
export const User = (
  {
    receiverId,
    text,
    setIsFetchUser,
    userName,
    dateMessage,
    avatar,
    setReceiverId,
    setCurrentUser,
    setIsLoadingDialog,
    language
  }: Props) => {
  const accessToken = localStorage.getItem('token-remote');
  const myId = localStorage.getItem('userId');

  const [countMessagesNotRead, setCountMessagesNotRead] = useState<number>(0)
  const [getDialogsByUser ] = useLazyGetMessengerByIdQuery()

  const { data: user } = useGetUserNameQuery({
    name: userName ? userName : null,
    accessToken: accessToken as string,
  })

  const onClickHandler = () => {
    setReceiverId(receiverId)
    setIsFetchUser(prev  => !prev)
    setIsLoadingDialog(true)
    setCurrentUser({
      userId: receiverId, 
      avaUrl: avatar[0]?.url, 
      name: {
        firstName: user?.firstName, 
        lastName: user?.lastName
      }
    })
  }

  const setTextLength = (text: string) => {
    if(text.length > 13) {
      return text.slice(0, 13) + '...'
    }
    return text
  }
  const setNameLength = (text: string) => {
    if(text?.length > 10) {
      return text.slice(0, 1) + '.'
    }
    return text
  }
  useEffect(() => {
    const fetchData = async () => {
      await getDialogsByUser({accessToken: accessToken, userId: receiverId}).then(res => {
        if (res.isSuccess) {
          const count = res.data.filter(msg => {
            if (msg.ownerId !== +myId) {
              return  msg.status === StatusMessage.RECEIVED
            }
          }).length
          setCountMessagesNotRead(count)
        }
      })
    }
    fetchData()
  }, []);

  return (
    <div className={s.userBlock} onClick={onClickHandler} >
      <AvatarSmallView avatarOwner={avatar[0]?.url} className="h-fit" />
      <div>
        <div className={s.nameAndDate}>
          <Typography>{`${user?.firstName || '...' } ${setNameLength(user?.lastName) || '...'}`}</Typography>
          <Typography className={s.colorMessageInfo} variant="small_text">
            {useFormatDate(dateMessage, language)}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography className={s.colorMessageInfo} variant="small_text">
            {setTextLength(text)}
          </Typography>
          {countMessagesNotRead > 0 &&
            <Typography as={'span'} variant={'small_text'} className={s.count}>
            {countMessagesNotRead}
          </Typography>}
        </div>
      </div>
    </div>
  )
}