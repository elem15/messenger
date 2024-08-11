import { useTranslation } from '@/lib/hooks/useTranslation'
import { AvatarSmallView } from '../../common/avatar/index'
import { Typography } from '../../common/typography/typography'
import s from './UStyles.module.scss'
import { TimeAgo } from '@/common/time-ago'
import { Avatar } from '@/types/messanger'

type Props = {
  receiverId: number
  userName: string
  text: string
  dateMessage: string
  avatar: Avatar[]
  setReceiverId: (value: number) => void
}
export const User = ({ receiverId, text, userName, dateMessage, avatar, setReceiverId }: Props) => {
  const { t } = useTranslation()
  return (
    <div className={s.userBlock} onClick={() => setReceiverId(receiverId)} >
      <AvatarSmallView avatarOwner={avatar[0].url} className="h-fit" />
      <div>
        <div className="flex items-center justify-between w-[200px]">
          <Typography>{userName}</Typography>
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