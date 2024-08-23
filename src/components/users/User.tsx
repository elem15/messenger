// import { useTranslation } from '@/lib/hooks/useTranslation'
import { AvatarSmallView } from '@/common/avatar'
import { Typography } from '@/common/typography/typography'
import s from './UStyles.module.scss'
import { TimeAgo } from '@/common/time-ago'
import { Avatar } from '@/types/messanger'
import { CurrentUser } from 'src/components/Messenger'
import { useGetUserNameQuery } from '@/app/api/users/usersApi'
import {Dispatch, useEffect} from 'react'

type Props = {
  receiverId: number
  userName: string
  text: string
  dateMessage: string
  avatar: Avatar[]
  setCurrentUser: ({userId, avaUrl, name: {firstName, lastName}}: CurrentUser) => void
  setReceiverId: (value: number) => void
  setIsFetchUser: Dispatch<(prev: boolean) => boolean>
}
export const User = ({ receiverId, text, setIsFetchUser, userName, dateMessage, avatar, setReceiverId, setCurrentUser }: Props) => {
  // const { t } = useTranslation()
  const accessToken = localStorage.getItem('token');

  const { data: user } = useGetUserNameQuery({
    name: userName ? userName : null,
    accessToken: accessToken as string,
  })

  const onClickHandler = () => {
    setReceiverId(receiverId)
    setIsFetchUser(prev  => !prev)
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

  return (
    <div className={s.userBlock} onClick={onClickHandler} >
      <AvatarSmallView avatarOwner={avatar[0]?.url} className="h-fit" />
      <div>
        <div className="flex items-center justify-between w-[245px]">
          <Typography>{`${user?.firstName || '...' } ${setNameLength(user?.lastName) || '...'}`}</Typography>
          <Typography className={s.colorMessageInfo} variant="small_text">
            {/*<TimeAgo lg={t.lg} updatedAt={dateMessage} />*/}
          </Typography>
        </div>
        <Typography className={s.colorMessageInfo} variant="small_text">
          {setTextLength(text)}
        </Typography>
      </div>
    </div>
  )
}