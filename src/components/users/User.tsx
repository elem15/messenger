import { useTranslation } from '@/lib/hooks/useTranslation'
import { AvatarSmallView } from '../../common/avatar/index'
import { Typography } from '../../common/typography/typography'
import s from './UStyles.module.scss'
import { TimeAgo } from '@/common/time-ago'
import { Avatar } from '@/types/messanger'
import { CurrentUser } from '../Messanger'
import { useGetUserNameQuery } from '@/app/api/users/usersApi'

type Props = {
  receiverId: number
  userName: string
  text: string
  dateMessage: string
  avatar: Avatar[]
  setCurrentUser: ({avaUrl, name: {firstName, lastName}}: CurrentUser) => void
  setReceiverId: (value: number) => void
}
export const User = ({ receiverId, text, userName, dateMessage, avatar, setReceiverId, setCurrentUser }: Props) => {
  const { t } = useTranslation()
  const accessToken = localStorage.getItem('token');

  const { data: user } = useGetUserNameQuery({
    name: userName ? userName : null,
    accessToken: accessToken as string,
  })

  const onClickHandler = () => {
    setReceiverId(receiverId)
    setCurrentUser({avaUrl: avatar[0].url, name: {firstName: user.firstName, lastName: user.lastName}})
  }

  return (
    <div className={s.userBlock} onClick={onClickHandler} >
      <AvatarSmallView avatarOwner={avatar[0].url} className="h-fit" />
      <div>
        <div className="flex items-center justify-between w-[200px]">
          <Typography>{`${user?.firstName || '...' } ${user?.lastName || '...'}`}</Typography>
          <Typography className={s.colorMessageInfo} variant="small_text">
            <TimeAgo lg={t.lg} updatedAt={dateMessage} />
          </Typography>
        </div>
        <Typography className={s.colorMessageInfo} variant="small_text">
          {text}
        </Typography>
      </div>
    </div>
  )
}