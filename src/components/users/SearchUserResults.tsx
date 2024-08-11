import { AvatarSmallView } from "@/common/avatar"
import { Typography } from "@/common/typography/typography"

type Props = {
  users: IUser[]
  callback: (value: boolean) => void
}
export const SearchUserResults = ({users, callback}: Props) => {
  return (
    <>
      {users.map(user => (
        <div 
          className="flex gap-3 p-[7px] w-[270px] border-r border-b border-[#4c4c4c] bg-[#171717] cursor-pointer hover:bg-[#4c4c4c]"
          onClick={() => callback(false)}
        >
          <AvatarSmallView avatarOwner={user.avatars[0]?.url} className="h-fit" />
          <Typography>{`${user.firstName || '...' } ${user.lastName || '...'}`}</Typography>
        </div>
      ))}
    </>
  )
}